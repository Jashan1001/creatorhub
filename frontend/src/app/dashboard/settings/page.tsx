"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function SettingsPage(){

 const [theme,setTheme] = useState("minimal")

 const saveTheme = async()=>{

  await api.put("/users/theme",{ theme })

 }

 return(

  <div className="max-w-lg">

   <h2 className="text-xl font-semibold mb-6">
    Choose Theme
   </h2>

   <select
    value={theme}
    onChange={(e)=>setTheme(e.target.value)}
    className="border rounded p-2"
   >

    <option value="minimal">Minimal</option>
    <option value="dark">Dark</option>
    <option value="gradient">Gradient</option>

   </select>

   <button
    onClick={saveTheme}
    className="ml-4 bg-black text-white px-4 py-2 rounded"
   >
    Save
   </button>

  </div>

 )

}