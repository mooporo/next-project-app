import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Wrapper from "./components/Wrapper";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Siam Archive",
  description: "Search and Upload Research Works",
  icons: {
    //
  },
  authors: [
    {
      //
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${prompt.className} flex`}
      >
          <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}