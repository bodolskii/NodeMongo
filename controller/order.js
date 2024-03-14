const orderModel = require('../model/order');

exports.orders_get_all =  (res,req) => {
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
}

exports.orders_get_order = (req,res) => {
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
}

exports.orders_post_order = (req, res) => {
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
}

exports.orders_patch_order = (req,res) => {
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
}

exports.orders_delete_all = (req,res) => {
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
}

exports.orders_delete_order = (req,res) => {
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
}