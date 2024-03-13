const express = require('express')
const userModel = require('../model/user');
const user = require('../model/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const e = require('express');

//get userInfo
router.get('/',(req,res) => {
    userModel
        .find()
        .then(users => {
            res.json({
                msg : "get users",
                count : users.lenght,
                usersInfo : users.map(user => {
                    return{
                        id : user._id,
                        name : user.name,
                        emaili : user.email,
                        password : user.password,
                        profileImage : user.profileImage,
                        role : user.role
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

//sign up
router.post('/signup', async(req,res) =>{
    const {name , email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(user) {
            return res.status(401).json({
                msg : "user email, please other email!"
            })
        }else {
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.json({user})
        }
        
        
    } catch (error) {
        res.status(500).json({
            msg : error.message
        })
    }
})

// login
router.post('/login', async(req,res) => {

    const {email, password} = req.body
    try {
        await userModel.findOne({email})
        if(!user) {
            return res.status(401).json({
                msg : 'user eamil, please other email'
            })
        }else {
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch) {
                    return res.status(402).json({
                        msg : "not match password"
                    })
                }else {
                    const payload = {
                        id : user._id,
                        email : user.email
                    }
                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn : '1h'}
                    )

                    res.json({token})

                }
            })
        }
    } catch (error) {
        res.status(500).json({
            msg : error.message
        })
    }
})

//delete userInfo
router.delete('/',(req,res)=>{
    userModel
        .remove()
        .then(()=> {
            res.json({
                msg : "delete users"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router