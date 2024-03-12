require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express()



const product = require('./router/product');
const order = require('./router/order');
const user = require('./router/user');



// middle
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))


app.use(morgan('dev'))
app.use(cors())

const connectDB = require('./config/database')
connectDB()

console.log("server.js DB!")

app.use('/uploads', express.static('uploads'))

app.use('/user', user);
app.use('/order', order);
app.use('/product', product);

 
const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log("connect server!"));