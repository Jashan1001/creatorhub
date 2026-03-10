"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();   // prevents URL exposure

    try {

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      router.push("/dashboard");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4"
      >

        <h1 className="text-2xl font-semibold text-center">
          Login
        </h1>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Username or Email</label>
          <input
            name="email"
            // type="email"
            placeholder="example@email.com"
            className="border p-2 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            className="border p-2 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-md hover:opacity-90"
        >
          Login
        </button>

      </form>

    </div>
  );
}