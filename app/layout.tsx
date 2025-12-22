import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Lexend } from "next/font/google";
import { Metadata } from "next";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata:Metadata ={
  title:{
    default:"ETH Explorer",
    template:"%s | ETH Explorer",
  },
  description:"ETH sapolia explorer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <ThemeProvider>
          <Providers>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
