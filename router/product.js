const express = require('express');
const productModel = require('../model/product')
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const product = require('../model/product');
const router = express.Router();

const storage = multer.diskStorage(
    {
        destination : function (req, file, callback) {
            callback(null,'./uploads')
        },
        filename : function (req, file, cb) {
            cb(null, file.originalname)
        }
    }
)

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const upload = multer(
    {
        storage : storage,
        limits : {
            fileSize : 1024*1024*5
        },
        fileFilter : fileFilter

    }
)

//total
router.get('/', (req, res) => {
    productModel
        .find()
        .then(product => {
            res.json({
                msg : "get products!",
                count : products.lenght,
                productInfo : products.map(product => {
                    return{
                        id : product._id,
                        name : product.name,
                        price : product.price,
                        productImage : product.productImage,
                        date : product.createdAt
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

//detail
router.get('/:productId',checkAuth, (req, res) => {
    const id = req.params.productId

    productModel
        .findById(id)
        .then(product => {
            if(!product) {
                return res.status(400).json({
                    msg : 'non product id'
                })
            }
            res.json({
                msg : 'get product',
                productInfo : {
                        id : product._id,
                        name : product.name,
                        price : product.price,
                        productImage : product.productImage,
                        date : product.createdAt
                }
            })
        })
})

//register
router.post('/',checkAuth,upload.single('productImage'),(req, res => {

    const {name,price} = req.body

    const newProduct = new productModel({
        name,
        price,
        productImage : res.file.path
    })

    newProduct
        .save()
        .then(product => {
            res.json({
                msg : 'register product!',
                productInfo : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    productImage : product.productImage,
                    date : product.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json( {
                msg : err.message
            })
        })
}))
//update

router.patch('/:productId',checkAuth,(req,res) => {
    const id = req.params.productId

    const updateOps = {}

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    productModel
        .findByIdAndUpdate(id, {$set : updateOps})
        .then(product => {
            if(!product){
                return res.status(400).json({
                    msg : 'no product Id'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

//total DELETE
router.delete('/',checkAuth, (req,res) => {
    productModel
        .remove()
        .then(() => {
            res.json({
                msg : 'delete product'
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})
//detail delete
router.delete('/:productId',checkAuth,(req,res) => {
    const id = req.productId

    productModel
        .findByIdAndRemove(id)
        .then( product => {
            if(!product){
                return res.status(400).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "delete product By " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router