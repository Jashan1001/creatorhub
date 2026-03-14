"use client"

import {
 DndContext,
 closestCenter,
 PointerSensor,
 useSensor,
 useSensors,
 DragEndEvent
} from "@dnd-kit/core"

import {
 SortableContext,
 verticalListSortingStrategy,
 arrayMove
} from "@dnd-kit/sortable"

import { useBuilder } from "./BuilderContext"
import BlockCard from "./BlockCard"
import api from "@/lib/api"

type Block = {
 _id: string
 type: string
 content: any
}

export default function BlockList(){

 const { blocks,setBlocks } = useBuilder() as {
  blocks: Block[]
  setBlocks: (b:Block[])=>void
 }

 const sensors = useSensors(
  useSensor(PointerSensor)
 )

 const handleDragEnd = async(event:DragEndEvent)=>{

  const {active,over} = event

  if(!over) return

  if(active.id !== over.id){

   const oldIndex = blocks.findIndex(
    (b)=>b._id === active.id
   )

   const newIndex = blocks.findIndex(
    (b)=>b._id === over.id
   )

   const newBlocks = arrayMove(blocks,oldIndex,newIndex)

   setBlocks(newBlocks)

   try{

    await api.put("/blocks/reorder",
     {
      blocks: newBlocks.map((b,index)=>({
       id:b._id,
       position:index
      }))
     },
     {
      headers:{
       Authorization:`Bearer ${localStorage.getItem("token")}`
      }
     }
    )

   }catch(err){
    console.error(err)
   }

  }

 }

 return(

  <DndContext
   sensors={sensors}
   collisionDetection={closestCenter}
   onDragEnd={handleDragEnd}
  >

   <SortableContext
    items={blocks.map((b)=>b._id)}
    strategy={verticalListSortingStrategy}
   >

    <div className="space-y-3">

     {blocks.map((block)=>(
      <BlockCard
       key={block._id}
       block={block}
      />
     ))}

    </div>

   </SortableContext>

  </DndContext>

 )
}