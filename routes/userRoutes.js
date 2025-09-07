const express = require('express');
const router = express.Router();
const User = require('./../models/user')
const {jwtAuthMiddleware,generateToken} = require('../jwt');
const db = require('../db')


router.post('/signup',async(req,res)=>{
   try{
     const userData = req.body
    const newUser = new User(userData)
    const response = await newUser.save()
    console.log('data Saved');
    const payload = {
        id: newUser.id,
    }

    const token = generateToken(payload);

    res.json({token});
   }
   catch(err){
    console.log(err);
    res.status(401).json({err:'INTERNAL SERVER ERROR'});
   }
})
router.post('/login',async(req,res)=>{
   try{
     const {aadharCardNumber,password}= req.body;
    const user = await User.findOne({aadharCardNumber:aadharCardNumber});
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({error:'invalid UserName and password'})
    }

    const payload = {
        id: user.id
    }

    const token = generateToken(payload);

    res.json({token});
   }
   catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
   }
})
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData = req.user
    const userId = userData.id
    const response = await User.findById(userId)
    res.status(200).json(response)
    }
    catch(err){
        console.log(err);
        res.status(401).json({message:'Internal server error'})
    }
})
router.put('/profile/password',jwtAuthMiddleware, async (req, res) => {
   
    const userData = req.user;
    const userId = userData.id

    const {currentPass,newPass}= req.body;

    const user = await User.findById(userId)
    if(!(await User.comparePassword(currentPass))){
        return res.status(401).json({error:'invalid UserName and password'})
    }
    user.password = newPass
    await user.save();
    console.log('password changed');
    res.status(200).json({msg:'password updated'})
    
})
// router.post('/signup', async (req, res) => {

//     try {
//         const data = req.body;
//         const newPerson = new person(data);
//         const response = await newPerson.save();
//         const payload = {
//             id: response.id,
//             name:response.username
//         }
//         const token = generateToken(payload);
//         console.log("data Saved");
//         res.status(200).json({response:response,token:token});
//     }
//     catch (err) {
// res.status(500).json({message:'internal server error'});
//     }

// })

// router.post('/', async (req, res) => {
//     try {
//         const data = req.body;
//         const newPerson = new person(data);

//         const response = await newPerson.save();
//         console.log("Data Saved");
//         res.status(200).json(response);
//     }
//     catch (err) {
//         console.log(err);
//     }

// })
// router.get('/',jwtAuthMiddleware, async (req, res) => {
//     const data = await person.find();
//     console.log("data fetched")
//     res.json(data);
// })


// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;

//     const response = await person.findByIdAndDelete(id);

//     if (!response) {
//         res.status(404).json({ error: "person Not found" })
//     }
//     res.status(200).json({ message: "person deleted successfully" });
// })
module.exports = router;