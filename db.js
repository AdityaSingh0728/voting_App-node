const mongoose = require('mongoose');
require('dotenv').config();
const url = 'mongodb://127.0.0.1:27017/mydata'
// const url = 'mongodb+srv://adityasingh:aditya1234@cluster0.rgfetpl.mongodb.net/'
// const url = process.env.DB_URL;

mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
const db = mongoose.connection;

db.on('connected',()=>{
    console.log("server connected");
    
})
module.exports = db;