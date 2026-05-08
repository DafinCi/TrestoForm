import { Inter, Righteous } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/components/providers/web3-provider"; // <-- Import Provider baru
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${righteous.variable} antialiased`}>
        {/* Bungkus seluruh aplikasi dengan Web3Provider */}
        <Web3Provider>
          <TooltipProvider>{children}</TooltipProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
