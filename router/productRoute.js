const express = require('express');
const { isSignrequired } = require('../middleware/authMiddleware');
const formidale = require('express-formidable')
const fs = require('fs');
const productModel = require('../models/product');
const { default: slugify } = require('slugify');
const product = require('../models/product');
const orderModel = require('../models/order');

const router = express.Router();
const braintree = require('braintree');
const dotenv = require('dotenv');
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

// route to create products
router.post('/create-product' , isSignrequired , formidale() , async(req , res)=>{
    try {
        const {name , slug , description ,price ,stock , category, shipping}= req.fields;
        const{image} = req.files;
        if(!name  || !description || !price || !stock || !category || !image){
            return res.status(500).send({message :"please fill all the info correctly" , success : false})
        }
        if(image.size > 1000000){
            return res.status(500).send({message :"image is too big" ,success : false})
        }
        const products = new productModel({...req.fields , slug : slugify(name)});
        if(image){
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }
        const newprod = await products.save();
        return res.status(200).send({message : "product created successfully" , newprod ,success : true})
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in create-product", error ,success : false})
    }
})
// route to get all products
router.get('/get-products' , async(req ,res)=>{
    try {
        const getProducts = await product.find({}).select('-image').limit(12).sort({createdAt :-1});
        if(getProducts){
            return res.status(201).send({
                message : "product fetched successfuly",
                count : getProducts.length,
                getProducts,
                success : true
            })
        }else{
            return res.status(500).send({
                message : "product not fetched",
                success : false
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in get-products", error , success : false})
    }
    
    
})

// route to get single product
router.get('/singleprod/:slug' , async(req , res)=>{
    const{slug} = req.params;
    try {
        const singleprod = await product.findOne({slug : slug}).select('-image').populate({path :'categories' , strictPopulate : false});
        if (singleprod) {
            return res.status(200).send({message : 'mil gya single product' , singleprod , success : true})
        }else{
            return res.status(200).send({message : 'nhi mila single product' , success : false})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in get-single product", error , success : false})
    }
})

// route to get image
router.get('/prodImage/:pid' , async(req , res)=>{
    try {
        const{pid} = req.params;
        const prodimg = await product.findById(pid).select('image');
        if(prodimg.image.data){
            // console.log(prodimg);
            res.set('Content-type' , prodimg.image.contentType)
            return res.status(200).send(prodimg.image.data);
        }else{
            return res.status(500).send({message : "not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in getting  product image", error})
    }
})

// route to delete product
router.delete('/deleteProd/:pid' , async(req , res)=>{
    try {
        const {pid} = req.params;
        const delProd = await product.findByIdAndDelete(pid).select('-image');
        if(delProd){
            return res.status(200).send(delProd);
        }else{
            return res.status(500).send("not deleted or not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in deleting produc", error})
    }
})

// route to update product
router.put('/updateProd/:pid' , isSignrequired, formidale(), async(req , res)=>{
    try {
        const {pid} = req.params;
        const {name , slug , description ,price ,stock , category, shipping} = req.fields;
        const{image} = req.files;
        if(!name  || !description || !price || !stock || !category || !image){
            return res.status(500).send({message :"please fill all the info correctly" , success : false})
        }
        if(image.size > 1000000){
            return res.status(500).send({message :"image is too big" , success : false})
        }
        const updateProd = await product.findByIdAndUpdate(pid , {...req.fields , slug : slugify(name)} , {new : true});
        if(image.data){
            updateProd.image.data = fs.readFileSync(image.path);
            updateProd.image.contentType = image.type;
        }
        const newprod = await updateProd.save();
        return res.status(200).send({message : "product updated successfully" , newprod , success : true})
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in updating product", error , success : false})
    }
})

//payments routes
//token
router.get("/braintree/token", isSignrequired ,async (req , res)=>{
    try {
        gateway.clientToken.generate({}, function (err , response) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(response);
          }
        });
      } catch (error) {
        console.log(error);
      }
});

//payments
router.post("/braintree/payment", isSignrequired, async (req, res)=>{
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
          total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
          {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: true,
            },
          },
          function (error, result) {
            if (result) {
              const order = new orderModel({
                products: cart,
                payment: result,
                buyer: req.user._id,
              }).save();
              res.json({ ok: true });
            } else {
              res.status(500).send(error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
});

module.exports = router;