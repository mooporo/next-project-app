import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Wrapper from "./components/Wrapper";
//เจมส์ : เพิ่ม file ตรวจสอบการ login
import { AuthProvider } from "./auth"


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

  // KLA : ตั้งค่าโหมดมืด-สว่าง อัตโนมัติ ตามค่าที่บันทึกไว้ใน localStorage
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <html lang="en">
      <head>

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${prompt.className} flex`}
      >
        {/* //เจมส์ : เพิ่มตรวจสอบการ login */}
        <AuthProvider>
          <Wrapper>{children}</Wrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
