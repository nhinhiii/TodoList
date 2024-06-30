import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChakraProvider } from '@chakra-ui/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List",
  description: "Generated an to-do-list website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {children} 
        </ChakraProvider>
        
      </body>
    </html>
  );
}
