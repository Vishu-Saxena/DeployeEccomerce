
const express = require('express');
const controlers = require('../controllers/authControler');
const loginControler = controlers.loginControler
const registerControler = controlers.registerControler
const testControler = controlers.testControler
const adminRegister = controlers.adminRegisterControler
const AdminLogin = controlers.adminloginControler
const updateProdfile = controlers.updateProfile;
const orderProfile = controlers.orderProfile;

const middleware = require('../middleware/authMiddleware');
const {isSignrequired, isAdmin} = middleware;


const router = express.Router();

router.post('/register', registerControler);
router.post('/register-admin', adminRegister);
router.post('/login' , loginControler);
router.post('/login-admin' , AdminLogin);
router.get('/test' , isSignrequired, isAdmin,  testControler);
router.get('/user-dashboard' , isSignrequired , (req , res)=> res.status(200).send({ok : true}));
router.get('/admin-dashboard' , isSignrequired , isAdmin, (req , res)=> res.status(200).send({ok : true}));
router.put('/update-profile' , isSignrequired , updateProdfile );
router.get('/oderProfile' , isSignrequired , orderProfile);

module.exports = router;