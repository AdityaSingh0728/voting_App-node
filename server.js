const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
const {jwtAuthMiddleware,generateToken} = require('./jwt');
const PORT =process.env.PORT || 4000;

const userRoutes = require('./routes/userRoutes');
app.use('/user',userRoutes);
const adminRoutes = require('./routes/candidateRoutes');
app.use('/candidates',adminRoutes);

app.listen(PORT,()=>{
    console.log("LISTENING ON PORT 4000");
    
});