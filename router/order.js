const express = require('express');
const orderModel = require('../model/order');
const checkAuth = require('../middleware/check-auth')
const order = require('../model/order');
const router = express.Router();

//total get order
router.get('/',checkAuth, (res,req) => {
    orderModel
        .find()
        .populate('product',['name','price'])
        .then(order => {
            res.json( {
                msg : 'get orders',
                count : order.lenght,
                orderInfo : orders.map(order => {
                    return {
                        id : order._id,
                        product : order.product,
                        quantity : order.quantity,
                        date : order.createdAt
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

//detail get order
router.get('/:orderId',checkAuth,(req,res) => {
    const orderId = req.params.orderId

    orderModel
        .findById(orderId)
        .populate('product',['name','price'])
        .then(order => {
            if(!order) {
                return res.status(400).json({
                    msg : 'no order Id!'
                })
            }
            res.json({
                msg : "get detail order",
                orderInfo : {
                    orderId : order._orderId,
                    product : order.product,
                    quantity : order.quantity,
                    date : order.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

//register order
router.post('/', checkAuth,(req, res) => {
    const {product, quantity} = req.body

    const newOrder = new orderModel({
        product,
        quantity
    })

    newOrder
        .save()
        .then(order => {
            res.json({
                msg : "register order",
                orderInfo : {
                    id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    date : order.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

//update order
router.patch('/:orderId',checkAuth,(req,res) => {
    const id = req.params.orderId

    const upadetOps = {}

    for(const ops of req.body) {
        upadetOps[ops.propName] = ops.value
    }
    orderModel
        .findByIdAndUpdate(id,{$set : upadetOps})
        .then(order => {
            if(!order) {
                return res.status(400).json({
                    msg : 'no oderId'
                })
            }
            res.json({
                msg : 'update By ' + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

//total delete order
router.delete('/',checkAuth,(req,res) => {
    orderModel
        .remove()
        .then(() => {
            res.json({
                msg : 'delete orders'
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})


//detail delete order
router.delete('/:orderId',checkAuth,(req,res) => {
    const id = req.params.orderId
    orderModel
        .findByIdAndRemove(id)
        .then(order => {
            if(!order) {
                return res.status(400).json({
                    msg : 'no orderId'
                })
            }
            res.json({
                msg : 'remove By ' + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router