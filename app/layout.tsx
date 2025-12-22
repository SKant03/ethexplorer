import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
