"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return null; 

 
}