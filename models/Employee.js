const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    middleName:{
        type:String,
        // required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    addressLine1:{
        type:String,
        required:true
     },
     addressLine2:{
        type:String,
     },
     landMark:{
        type:String,
        required:true
     },
     city:{
        type:String,
        required:true
     },
     pincode:{
        type:String,
        required:true
     },
    
    date:{
        type:Date,
        default:Date.now
    },
  
    role:{
        type:String,
        default:"Employee"
    }

})

module.exports = mongoose.model('employee',EmployeeSchema);