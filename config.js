const { name } = require('ejs');
const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/users');



connect.then(() =>{
    console.log("Database connected Successfully");
})
.catch(() =>{
    console.log("Database cannot be connected" );
})

//Create a Schema

const LoginSchema = ({
    name:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }

});

//Collection part

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;