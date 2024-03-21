const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const gravatar = require('gravatar')
const path = require("path");
var normalize = path.normalize

const userSchema = mongoose.Schema(
    {
        name : {
            type : String

        },
        email : {
            type : String,
            required : true,
            unique : true,
            match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        },
        password : {
            type : String,
            required : true

        },
        profileImage : {
            type : String

        },
        rule : {
            type : String,
            default : 'user'

        }


    },
    {
        timestamps : true

    }
)
userSchema.pre('save', async function (next) {
    try {
        const avatar = normalize(
            gravatar.url(this.email, {
                s : "200",
                r : "pg",
                d : "mm"

            }),
            {forceHttps : true}
        )
        this.profileImage = avatar

        const salt = await bcryptjs.genSalt(10)
        const passwordHash = await bcryptjs.hash(this.password, salt)

        this.password = passwordHash

        next()
        
    } catch (error) {
        next(error)
    }
})
userSchema.methods.comparePassword = async function(isInputPassword, cb) {
    bcryptjs.compare(isInputPassword, this.password,(err, isMatch) => {
        if(err) return cb(err)
        
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('user', userSchema)