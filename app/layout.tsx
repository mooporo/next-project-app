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
    icon: "/icon.png", // ✅ ตั้ง favicon เป็น public/icon.png
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
        {/* ✅ favicon หลายขนาดให้สวยขึ้น */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
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
