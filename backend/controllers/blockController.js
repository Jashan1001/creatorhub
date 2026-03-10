import Block from "../models/Block.js";

export const createBlock = async (req,res)=>{
 try{

  const { type, content, position } = req.body;

  const block = await Block.create({
   userId: req.user.id,
   type,
   content,
   position
  });

  res.json(block);

 }catch(err){
  res.status(500).json(err);
 }
};


export const getBlocks = async (req,res)=>{
 try{

  const blocks = await Block.find({
   userId: req.user.id
  }).sort({ position: 1 });

  res.json(blocks);

 }catch(err){
  res.status(500).json(err);
 }
};


export const updateBlock = async (req,res)=>{
 try{

  const block = await Block.findByIdAndUpdate(
   req.params.id,
   req.body,
   { new:true }
  );

  res.json(block);

 }catch(err){
  res.status(500).json(err);
 }
};


export const deleteBlock = async (req,res)=>{
 try{

  await Block.findByIdAndDelete(req.params.id);

  res.json({message:"Block deleted"});

 }catch(err){
  res.status(500).json(err);
 }
};
export const reorderBlocks = async (req, res) => {
  try {

    const { blocks } = req.body;

    for (const block of blocks) {
      await Block.findByIdAndUpdate(
        block.id,
        { position: block.position }
      );
    }

    res.json({ message: "Order updated" });

  } catch (err) {
    res.status(500).json(err);
  }
};