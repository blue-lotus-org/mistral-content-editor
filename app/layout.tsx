import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Content Editor with Mistral AI",
  description: "A modern content editor with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}




/*
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Content Editor with Mistral AI",
  description: "A modern content editor with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

*/

// import type React from "react"
// import "@/app/globals.css"
// import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Content Editor with Mistral AI",
//   description: "A modern content editor with AI assistance",
//     generator: 'lotuschain.org'
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="light">
//           {children}
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }



// import './globals.css'