"use client"

import BlockList from "./BlockList"
import PreviewPanel from "./PreviewPanel"
import AddBlockMenu from "./AddBlockMenu"

export default function BuilderLayout(){

 return(

  <div className="grid grid-cols-[420px_1fr] gap-6">

   {/* Editor */}
   <div className="bg-white border rounded-xl p-6">
    <AddBlockMenu/>
    <BlockList/>
   </div>

   {/* Preview */}
   <PreviewPanel/>

  </div>

 )

}