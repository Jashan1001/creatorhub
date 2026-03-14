"use client"

import api from "@/lib/api"
import { useBuilder } from "./BuilderContext"
import { Link2, ImageIcon, Type, Video } from "lucide-react"

export default function AddBlockMenu(){

 const { blocks,setBlocks } = useBuilder()

 const createBlock = async(type:string)=>{

  const res = await api.post("/blocks",
   {
    type,
    content:{},
    position:blocks.length
   },
   {
    headers:{
     Authorization:`Bearer ${localStorage.getItem("token")}`
    }
   }
  )

  setBlocks([...blocks,res.data])

 }

 return(

  <div className="grid grid-cols-2 gap-3 mb-6">

   <button
    onClick={()=>createBlock("link")}
    className="flex items-center gap-2 border rounded-lg p-3 hover:bg-stone-100"
   >
    <Link2 size={18}/>
    Link
   </button>

   <button
    onClick={()=>createBlock("text")}
    className="flex items-center gap-2 border rounded-lg p-3 hover:bg-stone-100"
   >
    <Type size={18}/>
    Text
   </button>

   <button
    onClick={()=>createBlock("image")}
    className="flex items-center gap-2 border rounded-lg p-3 hover:bg-stone-100"
   >
    <ImageIcon size={18}/>
    Image
   </button>

   <button
    onClick={()=>createBlock("video")}
    className="flex items-center gap-2 border rounded-lg p-3 hover:bg-stone-100"
   >
    <Video size={18}/>
    Video
   </button>

  </div>

 )
}