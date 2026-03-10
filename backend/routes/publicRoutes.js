import express from "express"
import User from "../models/User.js"
import Block from "../models/Block.js"

const router = express.Router()

router.get("/:username", async (req,res)=>{

 try{

  const user = await User.findOne({
   username:req.params.username
  })

  if(!user){
   return res.status(404).json({message:"Creator not found"})
  }

  const blocks = await Block.find({
   userId:user._id
  }).sort({position:1})

  res.json({
   user,
   blocks
  })

 }catch(err){
  res.status(500).json(err)
 }

})

export default router