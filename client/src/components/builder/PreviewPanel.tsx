"use client"

import { useBuilder } from "./BuilderContext"

export default function PreviewPanel(){

 const { blocks } = useBuilder()

 return(
  <div className="bg-white border border-stone-200 rounded-xl p-6">
   <h2 className="font-semibold mb-6">
    Live Preview
   </h2>

   <div className="flex flex-col gap-4 max-w-sm mx-auto">

    {blocks.map((block:any)=>{

     if(block.type === "link"){
      return(
       <button
        key={block._id}
        className="bg-black text-white py-3 rounded-lg"
       >
        {block.content?.title || "Link"}
       </button>
      )
     }

     if(block.type === "text"){
      return(
       <p key={block._id} className="text-center">
        {block.content?.text || "Text block"}
       </p>
      )
     }

     if(block.type === "image"){
      return(
       <div key={block._id} className="bg-stone-200 h-32 rounded-lg"/>
      )
     }

     if(block.type === "video"){
      return(
       <div key={block._id} className="rounded-lg overflow-hidden">
        <iframe
         src={block.content?.url?.replace("watch?v=","embed/")}
         className="w-full h-56 rounded-lg"
         allowFullScreen
        />
       </div>
      )
     }

     return null

    })}

   </div>
  </div>
 )
}