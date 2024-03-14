const mongoose = require('mongoose')

const connectDB = async function() {
    try {
        mongoose.connect(process.env.MONGODB_URI, {

            

        })
        console.log("connected DB")
        
    } catch (error) {
        console.log(error.message + "DB오류")
        process.exit(1)
    }
} 
module.exports = connectDB