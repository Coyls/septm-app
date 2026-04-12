import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/layout/QueryProvider"
import { CsrfProvider } from "@/components/layout/CsrfProvider"
import { ToasterProvider } from "@/components/layout/ToasterProvider"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SEPTM — 7 Wonders Score Tracker",
  description: "Suivez vos scores de 7 Wonders, consultez vos statistiques et gérez vos amis.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <CsrfProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
              <ToasterProvider />
            </CsrfProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
