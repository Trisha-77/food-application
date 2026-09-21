import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

//login user
const loginUser = async (req,res) =>{
    const {email, password} = req.body;
    try {
        if (!email || !password || !validator.isEmail(email)) {
            return res.status(400).json({success:false, message:'Please provide a valid email and password.'})
        }
        const user = await userModel.findOne({email: email.toLowerCase().trim()});

        if(!user){
           return res.status(401).json({success:false, message:'Invalid email or password.'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({success:false, message:'Invalid email or password.'})
        }

        const token = createToken(user);
        res.json({success:true, token, user: safeUser(user)})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Unable to sign in. Please try again.'})
    }
}

const createToken = (user) =>{
    return jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET, {expiresIn:'5h'})
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password || !validator.isEmail(email)) {
            return res.status(400).json({ success:false, message:'Please provide a valid email and password.' });
        }
        const user = await userModel.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success:false, message:'Invalid email or password.' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ success:false, message:'This account does not have administrator access.' });
        }
        res.json({ success:true, token:createToken(user), user:safeUser(user) });
    } catch (error) {
        console.error('Admin login failed:', error.message);
        res.status(500).json({ success:false, message:'Unable to sign in. Please try again.' });
    }
}

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role })

//register user
const registerUser = async (req, res) =>{
    const {name,password,email} = req.body;
    try {
        if (!name?.trim() || name.trim().length < 2) {
            return res.status(400).json({success:false, message:'Please enter your full name.'})
        }
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({success:false, message:'Please enter a valid email address.'})
        }
        if (!password || password.length < 8) {
            return res.status(400).json({success:false, message:'Password must be at least 8 characters.'})
        }
        const normalizedEmail = email.toLowerCase().trim();

        // checking is user already exists
        const exists = await userModel.findOne({email: normalizedEmail});
        if(exists){
            return res.status(409).json({success:false, message:'An account with this email already exists.'})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name.trim(),
            email:normalizedEmail,
            password:hashedPassword,
            role:'user'
        })

      const user =  await newUser.save()
      const token = createToken(user)
      res.status(201).json({success:true, token, user: safeUser(user)})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Unable to create your account. Please try again.'})
    }
}

export {loginUser, loginAdmin, registerUser}
