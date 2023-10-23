const express = require('express');
const Category = require('../models/category');

const router = express.Router();
const slugify = require('slugify');
const { isAdmin, isSignrequired } = require('../middleware/authMiddleware');

// route to create category
router.post('/create-category' , isSignrequired, async(req , res)=>{
    try {
        const{name} = req.body;
        if(!name){
            return res.status(500).send({message : "name is of category is required" , success :false});
        }
        const existingcatg = await Category.findOne({name});
        if(existingcatg){
            return res.status(500).send({message : "category already existing" ,success :false});
        }
    
        const newcatg = await new Category({name , slug : slugify(name)}).save();
        return res.status(200).send({message : "category created" , newcatg , success :true})
    } catch (error) {
        console.log(error);
        res.send({error : error , message : "error in create category" , success :false})

    }
    
})

// route to update Category
router.put('/update-category/:id' , isSignrequired , async(req , res)=>{
   
    try {
        const {name} = req.body;
        const{id} = req.params;
        if(!name){
            return res.status(500).send({message: 'name is required' , success : false});
        }
        const toUpdateCat = await Category.findByIdAndUpdate(id , {name  , slug : slugify(name)} , {new:true});
        return res.status(200).send({message : "category updated successfuly" , success : true , toUpdateCat})
    } catch (error) {
        res.status(500).send({message : "error in update category" , error , success : false});
        console.log(error);
    }
})

// route to get all categories

router.get('/get-categories' , async(req ,res)=>{
    try {
        const categories = await Category.find({});
        return res.status(200).send({message : "categories list" , categories ,success :true})
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in get category" , error,success :false});
    }
});

// route to get particular category
router.get('/single-category/:slug' , async(req ,res)=>{
    try {
        const {slug} = req.params;
        if(!slug){
            return res.status(500).send({message: 'name is required'});
        }

        const signleCat = await Category.findOne({slug});
        if(signleCat){
            return res.status(200).send({signleCat})
        }else{
            return res.status(200).send({message : "no result found"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in single category" , error});
    }
})
// route to get particular category by ID
router.get('/singleCategory/:id' , async(req ,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(500).send({message: 'id is required'});
        }

        const signleCat = await Category.findById(id);
        if(signleCat){
            return res.status(200).send({signleCat})
        }else{
            return res.status(200).send({message : "no result found"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in single category" , error});
    }
})

// route to delete categories
router.delete('/delete-category/:id' , isSignrequired, async(req , res)=>{
    try {
        const {id } = req.params;
        const delCat = await Category.findByIdAndDelete(id);
        if(delCat){
            return res.status(200).send({delCat , success : true})
        }else{
            return res.status(200).send({message : "no result found to delete" , success : false});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "error in delete category" , error , success : false});
    }
})
module.exports = router;