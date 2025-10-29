"use client";

import React from "react";
import Image from "next/image";
import { Search, Upload, Users } from "lucide-react";
import Link from "next/link";

// --- Type Definitions ---
type Feature = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
};

type ResearchItem = {
  id: string;
  color: string;
  title: string;
  author: string;
  date: string;
  views: string;
  comments: string;
};

// --- Feature Card ---
const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, subtitle }) => (
  <div className="group relative bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 hover:shadow-[0_10px_40px_rgb(59,130,246,0.3)] hover:-translate-y-2">
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition duration-700"></div>
    <div className="relative z-10">
      <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5 text-blue-600 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
        <Icon size={30} strokeWidth={2.2} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

// --- Research Card ---
const ResearchCard: React.FC<ResearchItem> = ({
  id,
  color,
  title,
  author,
  date,
  views,
  comments,
}) => (
  <Link href={`/งานวิจัย/${id}`}>
    <div className="group bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgb(59,130,246,0.25)]">
      <div
        className={`${color} h-32 p-4 flex items-center justify-center text-center bg-gradient-to-br from-blue-700 to-blue-500`}
      >
        <span className="text-white text-lg font-bold tracking-wide drop-shadow-md">
          Research Cover
        </span>
      </div>
      <div className="p-5 space-y-3">
        <h4 className="text-gray-800 text-base font-semibold line-clamp-2 leading-snug">
          {title}
        </h4>
        <div className="text-xs text-gray-500">{author}</div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{views}</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{comments}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default function Page() {
  const features: Feature[] = [
    {
      icon: Search,
      title: "ค้นหาง่าย",
      subtitle: "ค้นหาและเข้าถึงงานวิจัยได้ง่ายขึ้น",
    },
    {
      icon: Upload,
      title: "อัปโหลดเอกสาร",
      subtitle: "แชร์ผลงานของคุณพร้อมอัปเดตข้อมูลได้ตลอด",
    },
    {
      icon: Users,
      title: "สร้างชุมชน",
      subtitle: "เชื่อมต่อและร่วมมือกับผู้เชี่ยวชาญ และเพื่อนร่วมงาน",
    },
  ];

  const researchItems: ResearchItem[] = [
    {
      id: "1",
      color: "bg-blue-600",
      title: "การพัฒนาเวชระเบียนแบบนำทางสำหรับการประเมิน...",
      author: "รศ.ดร.ชินวัตร",
      date: "17 ก.ค. 2566",
      views: "1,200",
      comments: "15",
    },
    {
      id: "2",
      color: "bg-green-500",
      title: "ผลกระทบของ Climate Change ต่อการเกษตรและ...",
      author: "อ.ดร.ปิติ",
      date: "20 พ.ค. 2566",
      views: "980",
      comments: "8",
    },
    {
      id: "3",
      color: "bg-purple-600",
      title: "แนวคิด Blockchain กับระบบ Supply Chain...",
      author: "วิทยา ดอนหาด",
      date: "1 ก.ค. 2566",
      views: "786",
      comments: "22",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 font-['Poppins',_sans-serif]">
      <main>
        {/* Hero Section */}
        <section className="relative h-[550px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] opacity-95"></div>
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-start text-white z-[1]">
            <div className="w-full md:w-3/5 space-y-6 pt-10 md:pt-0 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
                ยินดีต้อนรับสู่{" "}
                <span className="block text-blue-100">Siam Archive</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-md text-blue-50 leading-relaxed">
                สถานที่ที่เปิดโอกาสในการเข้าถึงแหล่งข้อมูล ศึกษา และสร้างคุณค่าทางปัญญาของคุณ
              </p>
              <Link
                href="/search"
                className="inline-block bg-white text-blue-700 font-semibold py-3 px-10 rounded-2xl shadow-lg hover:bg-blue-50 hover:-translate-y-1 hover:shadow-blue-300/50 transition-all duration-300"
              >
                เริ่มต้นใช้งาน
              </Link>
            </div>
            <div className="w-full md:w-2/5 flex justify-center md:justify-start pt-12 md:pt-0 md:pl-16 animate-fade-in-up delay-200">
              <div className="bg-white text-gray-800 p-10 w-full max-w-sm h-[320px] flex items-center justify-center rounded-3xl shadow-2xl hover:shadow-blue-400/40 transition-all duration-500 hover:-translate-y-1 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 tracking-wide">
                  Academic Research
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-3">
              แพลตฟอร์มที่ออกแบบมาเพื่อคุณ
            </h2>
            <p className="text-center text-gray-500 mb-16 max-w-3xl mx-auto leading-relaxed">
              เราออกแบบมาเพื่อเป็นเครื่องมือและบริการจัดการงานวิจัยให้คุณเข้าถึงง่ายและมีประสิทธิภาพ ด้วยระบบที่ใช้งานง่าย
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, index) => {
                const linkHref =
                  feature.title === "ค้นหาง่าย"
                    ? "/search"
                    : feature.title === "อัปโหลดเอกสาร"
                    ? "/upload"
                    : "#";
                return (
                  <Link key={index} href={linkHref}>
                    <FeatureCard {...feature} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Research */}
        <section className="py-24 bg-gray-50/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">
                งานวิจัยล่าสุด
              </h2>
              <Link
                href="/search"
                className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition duration-150 flex items-center space-x-1"
              >
                <span className="text-gray-500 text-sm font-normal">
                  ดูทั้งหมด
                </span>
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {researchItems.map((item, index) => (
                <ResearchCard key={index} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 py-24">
          <div className="max-w-5xl mx-auto px-6 text-center text-white space-y-5">
            <h2 className="text-4xl font-bold tracking-tight drop-shadow">
              เริ่มต้นแบ่งปันผลงานของคุณ
            </h2>
            <p className="text-lg font-light max-w-xl mx-auto text-blue-100 leading-relaxed">
              สำหรับทุกงานวิจัยที่คุณจะทำ และค้นคว้าแหล่งงานวิจัยของทุกคน
            </p>
            <Link
              href="/register"
              className="bg-white text-blue-600 font-bold py-3 px-10 rounded-2xl shadow-lg hover:bg-blue-50 hover:-translate-y-1 hover:shadow-blue-300/50 transition-all duration-300"
            >
              สมัครสมาชิกเลย
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-black py-6 border-t border-gray-800">
        <div className="text-center text-gray-400 text-xs tracking-wide">
          © 2025 Siam Archive. สงวนลิขสิทธิ์.
        </div>
      </footer>
    </div>
  );
}
