const router = require("express").Router();
const User = require("../models/userModel");

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
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;