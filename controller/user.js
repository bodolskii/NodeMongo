const userModel = require('../model/user');
const jwt = require('jsonwebtoken');

exports.users_get_all = (req,res) => {
    userModel
        .find()
        .then(users => {
            res.json({
                msg : "get users",
                count : users.length,
                usersInfo : users.map(user => {
                    return{
                        id : user._id,
                        name : user.name,
                        emaili : user.email,
                        password : user.password,
                        profileImage : user.profileImage,
                        rule : user.rule
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

exports.users_signup_user = async(req,res) =>{
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
}

exports.users_login_user =  async(req,res) => {

    const {email, password} = req.body;

    console.log("email : " + {email} + "// ps : " +{password})

    try {
        const user = await userModel.findOne({email})

        console.log("find " + {email})

        if(!user) {
            console.log("!user")
            return res.status(401).json({
                msg : 'user eamil, please other email'
            })
        }else {
            console.log("password =!?")

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
}

exports.users_delete_all = (req,res)=>{
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
}