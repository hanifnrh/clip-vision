import { ThemeProvider } from "@/components/theme-provider";
import Dock from "@/components/ui/dock";
import Navbar from "@/components/ui/navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clipvision",
  description: "Best online video platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='antialiased raleway-medium'
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Dock />
          {children}
        </ThemeProvider>
      </body>
    </html >
  );
}
