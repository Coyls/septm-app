import type { Metadata } from "next"
import { Inter, Cinzel } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/layout/QueryProvider"
import { CsrfProvider } from "@/components/layout/CsrfProvider"
import { ToasterProvider } from "@/components/layout/ToasterProvider"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
