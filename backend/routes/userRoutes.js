import express from "express"
import User from "../models/User.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// update theme

router.put("/theme", authMiddleware, async (req, res) => {

 try {

  const { theme } = req.body

  const user = await User.findByIdAndUpdate(
   req.user.id,
   { theme },
   { new: true }
  )

  res.json(user)

 } catch (err) {

  res.status(500).json(err)

 }

})

export default router