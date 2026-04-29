import { CsrfProvider } from "@/components/providers/csrf-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Cinzel, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SEPTM | 7 Wonders Score Tracker",
  description:
    "Suivez vos scores de 7 Wonders, consultez vos statistiques et gérez vos amis.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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
          nonce={nonce}
        >
          <QueryProvider>
            <CsrfProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <ToasterProvider />
            </CsrfProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
