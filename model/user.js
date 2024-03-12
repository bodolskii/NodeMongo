const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name : {
            type : String

        },
        email : {
            type : String,
            required : true,
            unique : true,
            Math : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

module.exports = mongoose.model('user', userSchema)