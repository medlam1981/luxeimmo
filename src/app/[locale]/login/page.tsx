"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function AdminLogin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">تسجيل دخول المسؤول</h1>
        <button onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
          <FcGoogle className="text-2xl" />
          المواصلة باستخدام جوجل
        </button>
      </div>
    </div>
  );
}
