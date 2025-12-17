import "./globals.css";
import Navbar from "@/compnents/Navbar";
import Providers from "./provider";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
