const express = require('express'); //express to create server 
const dotenv = require('dotenv'); // to hide confidential data
const dbConnect = require('./config/dbConnect');
const morgan = require('morgan');
const authroutes = require('./router/authRout');
const categoryRoute = require('./router/categoryRoute');
const productRoute = require('./router/productRoute')
const path = require('path')//this is for deployment
const cors = require('cors')

dotenv.config();
// database connection
dbConnect();

const app = express();

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())
app.use(express.static(path.join(__dirname , './client/build')))
//routes 
app.use('/api/v1/auth' , authroutes);
app.use('/api/v1/category' , categoryRoute );
app.use('/api/v1/products' , productRoute );


// rest api
app.use('*', function(req , res){
    res.sendFile(path.join(__dirname , './client/build/index.html'));
})

app.get('/', (req , res)=>{
    res.send({"message" : "hello mansi saxena"});
})

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>{
    console.log(`app is running on port ${PORT}`);
})