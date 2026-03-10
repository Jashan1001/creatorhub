import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req,res) => {
 try {

  const { name, email, password, username } = req.body;

  const existingUser = await User.findOne({ email });

  if(existingUser){
    return res.status(400).json({message:"User already exists"});
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const user = await User.create({
    name,
    email,
    username,
    password: hashedPassword
  });

  res.json(user);

 } catch(error){
  res.status(500).json({error:"Server error"});
 }
};


export const login = async (req,res)=>{
 try {

  const { email, password } = req.body;

  const user = await User.findOne({
  $or: [{ email }, { username: email }]
});

  if(!user){
    return res.status(400).json({message:"Invalid credentials"});
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(400).json({message:"Invalid credentials"});
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user
  });

 } catch(error){
  res.status(500).json({error:"Server error"});
 }
};