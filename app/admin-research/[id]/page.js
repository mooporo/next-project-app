"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import {
  Download,
  Archive,
  Eye,
  MessageSquare,
  UserCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import DrawerAdmin from "../../components/DrawerAdmin";


const STORAGE_BUCKET = "user_bk";

const StatItem = ({ Icon, count, label }) => (
  <div className="flex flex-col items-center p-3 sm:p-4 text-center">
    <Icon className="w-6 h-6 text-blue-600 mb-1" />
    <div className="font-bold text-gray-800 text-lg">
      {count?.toLocaleString() ?? 0}
    </div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const AuthorBadge = ({ name, role, isPrimary, userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;
      try {
        const { data: userData } = await supabase
          .from("user_tb")
          .select("user_image")
          .eq("user_id", userId)
          .maybeSingle();

        if (userData?.user_image) {
          const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(userData.user_image);
          setAvatarUrl(data.publicUrl);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };
    fetchAvatar();
  }, [userId]);

  return (
    <div className="flex items-center p-4 border-b last:border-b-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-full mr-4 flex-shrink-0 object-cover"
        />
      ) : (
        <UserCircle className="w-10 h-10 text-gray-400 mr-4 flex-shrink-0" />
      )}
      <div className="flex-grow">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-xs text-blue-600 mt-0.5 inline-block px-2 py-0.5 bg-blue-50 rounded-full">
          {role}
        </div>
      </div>
      {isPrimary && (
        <div className="text-sm font-medium text-gray-500 ml-4">ผู้เขียนหลัก</div>
      )}
    </div>
  );
};

const KeywordTag = ({ label }) => (
  <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 transition">
    {label}
  </span>
);

export default function AdminResearchDetailPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [status, setStatus] = useState("รออนุมัติ");
  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ เพิ่ม state drawer

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  useEffect(() => {
    if (!id) return;
    const fetchResearch = async () => {
      const { data } = await supabase
        .from("paper_tb")
        .select("*")
        .eq("paper_id", id)
        .maybeSingle();
      if (data) {
        setResearch(data);
        setStatus(data.paper_status || "รออนุมัติ");
        const { data: userData } = await supabase
          .from("user_tb")
          .select("user_fullname")
          .eq("user_id", data.user_id)
          .maybeSingle();
        if (userData) setAuthorName(userData.user_fullname);
      }
    };
    fetchResearch();
  }, [id]);

  const handleApprove = async (approved) => {
    const newStatus = approved ? "อนุมัติแล้ว" : "ไม่อนุมัติ";
    const { error } = await supabase
      .from("paper_tb")
      .update({ paper_status: newStatus })
      .eq("paper_id", id);
    if (!error) setStatus(newStatus);
  };

  if (!research)
    return (
      <div className="text-center py-20 text-gray-500">กำลังโหลดข้อมูล...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-inter flex">
      {/* ================= DrawerAdmin ================= */}
      <DrawerAdmin onToggle={handleDrawerToggle} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-auto`}
        style={{ marginLeft: drawerOpen ? "18rem" : "0" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {research.paper_title}
            </h1>
            <div className="flex flex-wrap text-sm text-gray-500 space-x-4">
              <span>โดย: {authorName}</span>
              <span>
                วันที่เผยแพร่:{" "}
                {new Date(research.created_at).toLocaleDateString("th-TH")}
              </span>
            </div>

            {/* --- หน้าปกงานวิจัย --- */}
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative mt-4">
              {research.paper_image ? (
                <img
                  src={research.paper_image}
                  alt={research.paper_title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-center px-6"
                  style={{
                    backgroundColor: [
                      "#2563EB",
                      "#9333EA",
                      "#DB2777",
                      "#059669",
                      "#EA580C",
                      "#1E3A8A",
                      "#047857",
                    ][Math.floor(Math.random() * 7)],
                  }}
                >
                  <span className="text-white text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                    {research.paper_title || "ไม่มีชื่อเรื่อง"}
                  </span>
                </div>
              )}
            </div>

            <section className="bg-white p-6 rounded-xl shadow-md border">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">บทคัดย่อ</h2>
              <p className="text-gray-600">{research.paper_abstract}</p>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-md border">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">ไฟล์เอกสาร</h2>
              {research.paper_file ? (
                <iframe
                  src={research.paper_file}
                  className="w-full h-96 rounded-lg border"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-5xl">
                  404
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8 mt-8">
            {/* --- สถานะเอกสาร ปรับใหญ่ขึ้นสมส่วน --- */}
            <div className="inline-flex items-center bg-white px-4 py-3 rounded-xl shadow-lg border space-x-3">
              <span className="font-semibold text-gray-800 text-base">
                สถานะเอกสาร:
              </span>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  status === "อนุมัติแล้ว"
                    ? "bg-green-100 text-green-700"
                    : status === "ไม่อนุมัติ"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ดำเนินการ</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleApprove(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>อนุมัติ</span>
                </button>

                <button
                  onClick={() => handleApprove(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  <XCircle className="w-5 h-5" />
                  <span>ไม่อนุมัติ</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">
                ผู้เขียนหลัก
              </h3>
              <AuthorBadge
                name={authorName}
                role="นักวิจัย"
                isPrimary
                userId={research.user_id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
