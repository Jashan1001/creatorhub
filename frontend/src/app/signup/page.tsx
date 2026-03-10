"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {

 const router = useRouter();

 const [form,setForm] = useState({
  name:"",
  username:"",
  email:"",
  password:""
 });

 const handleChange = (e:any)=>{
  setForm({...form,[e.target.name]:e.target.value});
 };

 const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();

  try{

   await api.post("/auth/signup",form);

   router.push("/login");

  }catch(err){
   console.log(err);
  }

 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-stone-50">
  <form className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">

    <h2 className="text-2xl font-semibold text-center">
      Create Account
    </h2>

    <input
      className="w-full border p-2 rounded-md"
      name="name"
      placeholder="Name"
      onChange={handleChange}
    />

    <input
      className="w-full border p-2 rounded-md"
      name="username"
      placeholder="Username"
      onChange={handleChange}
    />

    <input
      className="w-full border p-2 rounded-md"
      name="email"
      placeholder="Email"
      onChange={handleChange}
    />

    <input
      className="w-full border p-2 rounded-md"
      name="password"
      type="password"
      placeholder="Password"
      onChange={handleChange}
    />

    <button
      className="w-full bg-black text-white py-2 rounded-md"
      type="submit"
    >
      Sign Up
    </button>

  </form>
</div>
 );
}