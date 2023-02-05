const mongoose = require('mongoose')

const start = async(url)=>{
   await mongoose.connect(url,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Connection successful')
    }
   })
}

module.exports = start