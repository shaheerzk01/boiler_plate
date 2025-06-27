"use client"

import DefaultLayout from "@/components/layouts/Defaultlayout"


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <DefaultLayout>{children}</DefaultLayout>
    </>
  )
}