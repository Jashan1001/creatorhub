"use client"

import { createContext, useContext, useState } from "react"

const BuilderContext = createContext<any>(null)

export function BuilderProvider({ children }: any) {

  const [blocks,setBlocks] = useState([])

  return (
    <BuilderContext.Provider value={{ blocks, setBlocks }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder(){
  return useContext(BuilderContext)
}