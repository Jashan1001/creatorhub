"use client"

import { BuilderProvider } from "@/components/builder/BuilderContext"
import BuilderLayout from "@/components/builder/BuilderLayout"

export default function BuilderPage(){

 return(

  <BuilderProvider>
    <BuilderLayout/>
  </BuilderProvider>

 )

}