/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { useAuth } from "./auth";


// --- Type ของ user ตามตาราง user_tb 
interface User {
  user_id: number;
  user_fullname?: string;
}


// --- type ของ useAuth ---
interface UseAuthReturn {
  user?: User | null;
}

// --- Feature Card ---
type Feature = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
};

const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white text-center p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-blue-100/80 fade-in">
    <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5 text-blue-600 rounded-full bg-blue-50 shadow-inner hover:rotate-6 transition-transform duration-300">
      <Icon size={30} strokeWidth={2} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// --- KLA: Research Card ---
interface ResearchItem {
  paper_id: number;
  paper_title: string;
  paper_image?: string;
  paper_views?: number;
  user_fullname?: string;
  comment_count?: number;
  created_at?: string;
  
}

//
interface ResearchCardProps {
  item: ResearchItem;
  onClick: (item: ResearchItem) => void;

  paperId: number;

}


// --- KLA: Research Card Component  (สุ่มสีพื้นหลังยืมมาจากหน้า Search)  ---
const ResearchCard: React.FC<{ item: ResearchItem; onClick: (item: ResearchItem) => void }> = ({ item, onClick }) => {
  const [bgColor] = useState(() => {
    const colors = ["#2563EB", // blue-600
      "#1E40AF", // blue-800
      "#9333EA", // purple-600
      "#7E22CE", // purple-700
      "#DB2777", // pink-600
      "#BE185D", // pink-700
      "#059669", // green-600
      "#047857", // emerald-700
      "#16A34A", // green-600 
      "#EA580C", // orange-600
      "#C2410C", // orange-700  
      "#1E3A8A", // indigo-900
      "#0F766E", // teal-700
      "#DC2626", // red-600
      ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  const handleCardClick = () => onClick(item);

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer relative overflow-hidden border border-gray-100 hover:-translate-y-1 transform hover:scale-102"
      onClick={handleCardClick}
    >
      {/* KLA :วันที่ */}
      <div className="absolute top-2 right-2 text-xs text-gray-400 italic bg-white/80 px-2 py-1 rounded-md shadow-sm">
        {item.created_at ? new Date(item.created_at).toLocaleDateString("th-TH") : "-"}
      </div>

      {/* KLA: ภาพหรือพื้นหลังสีถ้าไม่มีภาพ */}
      <div className="h-40 flex items-center justify-center overflow-hidden">
        {item.paper_image ? (
          <img src={item.paper_image} alt={item.paper_title} className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center px-6" style={{ backgroundColor: bgColor }}>
            <span className="text-white text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
              {item.paper_title || "ไม่มีชื่อเรื่อง"}
            </span>
          </div>
        )}
      </div>


      {/* KLA: ชื่อเรื่อง */}
      <div className="p-4 space-y-2">
        <h3 className="text-gray-900 font-bold text-lg leading-snug truncate hover:text-blue-600 transition-colors duration-300">{item.paper_title}</h3>
        <p className="text-sm text-gray-500 truncate">โดย: {item.user_fullname || "ไม่ระบุชื่อ"}</p>

        {/* KLA: จํานวนยอดวิว */}
        <div className="pt-2 border-t border-gray-200 flex justify-start items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="font-medium">{item.paper_views?.toLocaleString() || 0}</span>
          </div>

          {/* KLA: จํานวนคอมเมนต์ */}
          <div className="flex items-center space-x-1 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-medium">{item.comment_count || 0} คอมเมนต์</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Home Page ---
export default function Page() {
  const router = useRouter();
  const { user } = useAuth() as UseAuthReturn; // <-- แก้ตรงนี้เพื่อกำหนด type ให้ user
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());

  const features: Feature[] = [
    { icon: Search, title: "ค้นหาง่าย", subtitle: "ค้นหาและเข้าถึงงานวิจัยได้ง่ายขึ้น" },
    { icon: Upload, title: "อัปโหลดเอกสาร", subtitle: "แชร์ผลงานของคุณพร้อมอัปเดตข้อมูลได้ตลอด" },
    { icon: Users, title: "สร้างชุมชน", subtitle: "เชื่อมต่อและร่วมมือกับผู้เชี่ยวชาญ และเพื่อนร่วมงาน" },
  ];

  const fetchPinnedData = async (): Promise<Set<number>> => {
    if (!user?.user_id) return new Set();
    const { data, error } = await supabase.from('paper_pin_mtb').select('paper_id').eq('user_id', user?.user_id);
    if (error) return new Set();
    return new Set(data.map((item: any) => item.paper_id));
  }

  const fetchResearchData = async () => {
    setLoading(true);
    const fetchedPinnedIds = await fetchPinnedData();
    setPinnedIds(fetchedPinnedIds);

    const { data: papers } = await supabase.from("paper_tb").select(`
      paper_id,
      user_id,
      paper_title,
      paper_image,
      paper_views,
      created_at,
      user_tb:user_id ( user_fullname ),
      paper_status
    `).eq("paper_status", 2).order("created_at", { ascending: false });

    const { data: commentsData } = await supabase.from("comment_tb").select("paper_id, comment_id");

    const commentCountMap: Record<string, number> = {};
    (commentsData || []).forEach((c: any) => {
      const pid = String(c.paper_id).trim();
      commentCountMap[pid] = (commentCountMap[pid] || 0) + 1;
    });

    const combinedData: ResearchItem[] = (papers || []).map((paper: any) => {
      const paperIdAsString = String(paper.paper_id).trim();
      const is_pinned = fetchedPinnedIds.has(paper.paper_id);
      return {
        ...paper,
        is_pinned,
        user_fullname: paper.user_tb?.user_fullname || "ไม่ระบุชื่อ",
        comment_count: commentCountMap[paperIdAsString] || 0,
      };
    });

    setResearchItems(combinedData);
    setLoading(false);
  }

  useEffect(() => { if (user?.user_id) fetchResearchData(); }, [user?.user_id]);

  const handleView = async (item: ResearchItem) => {
    const newViews = (item.paper_views || 0) + 1;
    await supabase.from("paper_tb").update({ paper_views: newViews }).eq("paper_id", item.paper_id);
    setResearchItems(prev => prev.map(r => r.paper_id === item.paper_id ? { ...r, paper_views: newViews } : r));
    router.push(`/research/${item.paper_id}`);
  }


  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif]">
      <main>
        {/* Hero Section */}
        <section className="relative h-[550px] overflow-hidden bg-cover bg-center bg-fixed fade-in" style={{ backgroundImage: "url('/backgroud2.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#2563EB]/80 to-[#60A5FA]/70 opacity-40"></div>
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white z-[1]">
            <div className="w-full md:w-3/5 space-y-6 pt-10 md:pt-0">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                ยินดีต้อนรับสู่ <span className="block">Siam Archive</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-md text-blue-100">
                สถานที่ที่เปิดโอกาสในการเข้าถึงแหล่งข้อมูล ศึกษา และสร้างคุณค่าทางปัญญาของคุณ
              </p>
              <Link href="/search" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05] hover:shadow-blue-200/50 hover:scale-110 transition-transform duration-300">
                เริ่มต้นใช้งาน
              </Link>
            </div>
            <div className="w-full md:w-2/5 flex justify-center md:justify-end pt-12 md:pt-0">
              <div className="bg-white p-2 rounded-2xl shadow-2xl w-[320px] h-[320px] flex items-center justify-center hover:shadow-blue-400/40 transition duration-500 overflow-hidden fade-in">
                <div className="relative w-full h-full">
                  <Image src="/siam_archive.png" alt="Siam Archive" fill unoptimized priority className="object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">แพลตฟอร์มที่ออกแบบมาเพื่อคุณ</h2>
            <p className="text-center text-gray-500 mb-16 max-w-3xl mx-auto">เราออกแบบมาเพื่อเป็นเครื่องมือและบริการจัดการงานวิจัยให้คุณเข้าถึงง่ายและมีประสิทธิภาพ ด้วยระบบที่ใช้งานง่าย</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const linkHref = feature.title === "ค้นหาง่าย" ? "/search" : feature.title === "อัปโหลดเอกสาร" ? "/upload" : "#";
                return <Link key={index} href={linkHref}><FeatureCard {...feature} /></Link>;
              })}
            </div>
          </div>
        </section>

        {/* KLA : Section for latest research */}
        <section className="py-20 bg-gray-50 fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">งานวิจัยล่าสุด</h2>
              <Link href="/search" className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition duration-150 flex items-center space-x-1">
                <span className="text-gray-500 text-sm font-normal">ดูทั้งหมด</span>
                <span>→</span>
              </Link>
            </div>
            {/* KLA : แสดงรายการงานวิจัยโดยใช้ ResearchCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? <p className="text-gray-500 col-span-full text-center py-20">กำลังโหลด...</p>
                : researchItems.length === 0 ? <p className="text-gray-500 col-span-full text-center py-20">ไม่พบงานวิจัย</p> 
                  : researchItems.map(item => <ResearchCard key={item.paper_id} item={item} onClick={handleView}  />)}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 py-16 fade-in">
          <div className="max-w-5xl mx-auto px-6 text-center text-white space-y-4">
            <h2 className="text-3xl font-bold">เริ่มต้นแบ่งปันผลงานของคุณ</h2>
            <p className="text-lg font-light max-w-xl mx-auto">สำหรับทุกงานวิจัยที่คุณจะทำ และค้นคว้าแหล่งงานวิจัยของทุกคน</p>
            <Link href="/register" className="bg-white text-blue-600 font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-gray-100 transition duration-300 mt-4 transform hover:scale-[1.05] hover:shadow-blue-300/50 hover:-translate-y-1 transition-transform duration-300">สมัครสมาชิกเลย</Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-4 fade-in">
        <div className="text-center text-gray-400 text-xs hover:text-gray-200 transition-colors duration-200">© 2025 Siam Archive. สงวนลิขสิทธิ์.</div>
      </footer>
    </div>
  );
}