"use client"
import "@/css/style.css"
import React from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <title>Boiler Plate</title>
      <meta name="description" content="BOILER PLATE FOR PROJECT STARTER" />
      <body suppressHydrationWarning={true}>{children}
      </body>
    </html>
  )
}