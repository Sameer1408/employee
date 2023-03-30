const express = require('express');
const User = require('./models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'ABCDEFGHIGKLMNOPQRSTUWXYZ';
const fetchuser = require('./middleware/fetchUser');
const Employee = require('./models/Employee');

//Create a User using: POST "/api/auth/createUser" ->no authenticaton required
router.post('/createUser', [
  body('name', "Enter a valid name").isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the email exists already  
      console.log(req.body.email,"email");
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({success:true,authtoken })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured")
    }
})
 
router.post('/addEmployee',fetchuser,async(req,res)=>{
  try{
    let userId =req.user.id;
    // console.log(req.body);
     let obj = req.body;
     let employee = await Employee.create({
      userId:userId,
      firstName:obj.firstName,
      middleName:obj.middleName,
      lastName:obj.lastName,
      department:obj.department,
      status:obj.status,
      age:obj.age,
      addressLine1:obj.addressLine1,
      addressLine2:obj.addressLine2,
      landMark:obj.landMark,
      city:obj.city,
      pincode:obj.pincode,
    })
    console.log(employee)
    res.status(200).json({success:true,employee});
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

router.get('/getAllEmployee',fetchuser,async(req,res)=>{
    try{
      let userId =req.user.id;
      let allEmployee = await Employee.find({});
      // console.log(allEmployee);
      res.status(200).json({allEmployee});
    }catch(error)
    {
    console.error(error.message);
    res.status(500).send("Some error occured")
    }
})

router.post('/updateEmployee',fetchuser,async(req,res)=>{
  try{
    
    const obj = req.body;
    let employee =  await Employee.findByIdAndUpdate(obj.id,{
      firstName:obj.firstName,
      middleName:obj.middleName,
      lastName:obj.lastName,
      department:obj.department,
      status:obj.status,
      age:obj.age,
      addressLine1:obj.addressLine1,
      addressLine2:obj.addressLine2,
      landMark:obj.landMark,
      city:obj.city,
      pincode:obj.pincode
    })
    console.log(employee,"employee");
    res.status(200).json(employee);
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

router.post('/removeEmployee',fetchuser,async(req,res)=>{
  try{
    console.log("remove");
    let doc = await Employee.findById(req.body.id).remove();
    console.log(doc,"doc");
    res.status(200).json(doc);
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
})

//Login a User using: POST "/api/auth/login" ->no authenticaton required
router.post('/login',  async (req, res) => {
  //if there are error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    console.log(password);
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Sorry user not found"
      })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Sorry invalid credentials"
      })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({success:true,authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }

})

//Get Logged in user details :POST"api/auth/getuser.Login or authentication required
router.get('/getuser',fetchuser, async (req, res) => {
 try {
    userId =req.user.id
    console.log("userId",userId);
    const user = await User.findById(userId).select("-password");
    res.status(200).json({user});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

module.exports = router;