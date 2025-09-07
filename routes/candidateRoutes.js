const express = require('express');
const router = express.Router();
const User = require('../models/user')
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const Candidate = require('../models/candidate');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (user.role === "admin") {
            return true;
        }
    }
    catch (err) {
        return false;
    }

}
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(404).json({ message: "user is not an Admin" });
        }
        const userData = req.body
        const newCandidate = new Candidate(userData)
        const response = await newCandidate.save();
        console.log('data Saved');
        res.status(200).json(response)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: 'INTERNAL SERVER ERROR' });
    }
})
router.put('/:candidatesId', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidatesId = req.params.candidatesId;
        const updatedCandidate = req.body;

        const response = await Candidate.findByIdAndUpdate(candidatesId, updatedCandidate, {
            new: true,
            runValidators: true
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})
router.delete('/:candidatesId', jwtAuthMiddleware, async (req, res) => {
    try {
        const id = req.params.candidatesId;

        const response = await Candidate.findByIdAndDelete(id);

        if (!response) {
            res.status(404).json({ error: "CANDIDATE Not found" })
        }
        res.status(200).json({ message: "Candidate deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'candidate not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: 'you have already voted' })
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Admin are not allowed to vote' })
        }
        candidate.votes.push({ user: userId })
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();
        res.status(200).json({message:'vote recorded successfully'});

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }

})

router.get('/vote/count',async(req,res)=>{
    try{
       const candidate= await Candidate.find().sort({voteCount:'desc'})

    const record = candidate.map((data)=>{
        return {
            name: data.party,
            count: data.voteCount
        }
    })
    res.status(200).json(record);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})
module.exports = router;