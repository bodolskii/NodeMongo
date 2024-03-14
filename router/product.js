const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const router = express.Router();
const {
    products_get_all,
    products_get_product,
    products_post_product,
    products_patch_product,
    products_delete_all,
    products_delete_product
    
}= require('../controller/product')

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
router.get('/', products_get_all )

//detail
router.get('/:productId',checkAuth, products_get_product )

//register
router.post('/',checkAuth,upload.single('productImage'), products_post_product)
//update

router.patch('/:productId',checkAuth, products_patch_product)

//total DELETE
router.delete('/',checkAuth, products_delete_all )
//detail delete
router.delete('/:productId',checkAuth, products_delete_product)

module.exports = router