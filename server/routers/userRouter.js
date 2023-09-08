const router = require("express").Router();
const User = require("../models/userModel");
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// register
router.post("/", async (req,res) =>{
    try {
        const {email,password,passwordVerify} =req.body;

        //validation

        if (!email || !password || !passwordVerify ) {
            return res
            .status(400)
            .json({errorMessage:"Tüm gerekli alanları giriniz"});
        }
        if (password.length < 6) {
            return res
            .status(400)
            .json({errorMessage:"Şifre alanı en az 6 karakter olmalı"});
        }
        if (password !== passwordVerify ) {
            return res
            .status(400)
            .json({errorMessage:"Şifre doğrulaması geçersiz" 
            });
        }

        const existingUser = await User.findOne({ email});
        console.log(existingUser);

        if (existingUser) {
            return res
            .status(400)
            .json({errorMessage:"bu email adresi zaten var " 
            });
        }

        //hash the pass
        
        const salt = await bcyrpt.genSalt();
        const passwordHash = await bcyrpt.hash(password,salt);

        // save a new user account to db
        const newUser =new User({
            email, passwordHash
        });
        const savedUser = await newUser.save();

        // sign the token
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET
        );
        

        //send the token in a HTTP-onlycookie


        res.cookie("token",token,{
            httpOnly: true,

        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// login 
router.post("/login", async (req,res)=>
{

    try {
        const {email,password } =req.body;

        //validation

        if (!email || !password ) {
            return res
            .status(400)
            .json({errorMessage:"Tüm gerekli alanları giriniz"});
        }

        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res
            .status(401)
            .json({errorMessage:"Wrong email or Pass!" 
            });
        }

        //hash the pass
        
        const passwordCorrect = await bcyrpt.compare(password,existingUser.passwordHash);
        
        if (!passwordCorrect) 
            return res.status(401).json({errorMessage:"Wrong email or Pass!"});

        // sign the token
        const token = jwt.sign({
            user: existingUser._id
        }, process.env.JWT_SECRET
        );
        

        //send the token in a HTTP-onlycookie


        res.cookie("token",token,{
            httpOnly: true,

        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


//logout
router.get("/logout",(req,res)=>
{
    res
    .cookie("token","",{
        httpOnly:true,
        expires: new Date(0)
    }).send();
});

module.exports = router;