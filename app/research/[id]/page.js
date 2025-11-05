"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Download, Archive, Eye, MessageSquare, UserCircle } from "lucide-react";

const STORAGE_BUCKET = "user_bk";

const StatItem = ({ Icon, count, label }) => (
  <div className="flex flex-col items-center p-3 sm:p-4 text-center">
    <Icon className="w-6 h-6 text-blue-600 mb-1" />
    <div className="font-bold text-gray-800 text-lg">{count?.toLocaleString() ?? 0}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

// --- AuthorBadge แสดงรูปผู้ใช้จริง ---
const AuthorBadge = ({ name, role, isPrimary, userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;
      try {
        const { data: userData, error: userError } = await supabase
          .from("user_tb")
          .select("user_image")
          .eq("user_id", userId)
          .maybeSingle();

        if (!userError && userData?.user_image) {
          const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(userData.user_image);
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
        <div className="text-sm font-medium text-gray-500 ml-4">
          ผู้เขียนหลัก
        </div>
      )}
    </div>
  );
};

const KeywordTag = ({ label }) => (
  <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 transition">
    {label}
  </span>
);

// --- Comment แสดงรูปผู้ใช้จริง ---
const Comment = ({ user, text, date, userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;
      try {
        const { data: userData, error: userError } = await supabase
          .from("user_tb")
          .select("user_image")
          .eq("user_id", userId)
          .maybeSingle();

        if (!userError && userData?.user_image) {
          const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(userData.user_image);
          setAvatarUrl(data.publicUrl);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };
    fetchAvatar();
  }, [userId]);

  return (
    <div className="flex space-x-4 py-4 border-b last:border-b-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-cover"
        />
      ) : (
        <UserCircle className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
      )}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-gray-800">{user}</div>
          <div className="text-xs text-gray-400">{date}</div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

// Comment Form Component จุดแสดงความคิดเห็น
const CommentForm = () => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("Submitted comment:", comment);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-sm font-medium text-gray-700 mb-2">แสดงความคิดเห็นของคุณ</div>
      <textarea
        className="w-full p-3 h-20 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none"
        placeholder="กรุณาพิมพ์ข้อความ..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 disabled:opacity-50"
        disabled={!comment.trim()}
      >
        ส่งคอมเมนต์
      </button>
    </form>
  );
};

export default function ResearchDetailPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [comments, setComments] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [authorName, setAuthorName] = useState(""); // ✅ เพิ่ม state สำหรับชื่อผู้เขียน

  useEffect(() => {
    if (!id) return;

    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("paper_id,user_id,paper_title,paper_abstract,paper_file,paper_image,paper_views,created_at")
          .eq("paper_id", id)
          .maybeSingle();

        if (error) throw error;

        setResearch(data || null);
        setErrorMsg(data ? "" : "ไม่พบข้อมูลงานวิจัย");

        // ✅ ดึงชื่อจริงของผู้เขียนจาก user_tb
        if (data?.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("user_tb")
            .select("user_fullname")
            .eq("user_id", data.user_id)
            .maybeSingle();
          if (!userError && userData) {
            setAuthorName(userData.user_fullname);
          }
        }

        if (data) {
          supabase
            .from("paper_tb")
            .update({ paper_views: (data.paper_views || 0) + 1 })
            .eq("paper_id", id)
            .then(({ error }) => error && console.error("Error updating views:", error));
        }
      } catch (err) {
        console.error("Error fetching research:", err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    };

    fetchResearch();

    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_comment_mtb")
          .select(`
            comment_id,
            paper_id,
            user_id,
            comment,
            created_at,
            user_tb(user_fullname)
          `)
          .eq("paper_id", id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = data.map((c) => ({
          comment_id: c.comment_id,
          comment: c.comment,
          created_at: c.created_at,
          user_fullname: c.user_tb?.user_fullname || "ไม่ระบุชื่อ",
          user_id: c.user_id, // ✅ เพิ่ม user_id สำหรับโหลดรูป
        }));

        setComments(formatted);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [id]);

  if (!research)
    return <div className="text-center py-20 text-gray-500">{errorMsg || "กำลังโหลดข้อมูล..."}</div>;

  const primaryBlue = "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {research.paper_title || "ไม่มีชื่อเรื่อง"}
            </h1>
            <div className="text-sm text-gray-500 flex flex-wrap space-x-4 mt-2">
              <span>โดย: {authorName || research.user_id || "ไม่ระบุผู้เขียน"}</span> {/* ✅ แก้ให้แสดงชื่อจริง */}
              <span>
                วันที่เผยแพร่:{" "}
                {research.created_at
                  ? new Date(research.created_at).toLocaleDateString("th-TH")
                  : "-"}
              </span>
            </div>
          </header>

          {/* KLA : รูปภาพปกงานวิจัย */}
          <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative">
            {research.paper_image ? (
              <img
                src={research.paper_image}
                alt={research.paper_title}
                className="object-cover w-full h-full"
              />
            ) : (
              // KLA เพิ่ม ถ้าไม่มีรูปให้สุ่มสีพื้นหลัง พร้อมชื่อเรื่องตรงกลาง
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

          {/* KLA  :  ส่วนแสดงบทคัดย่อ */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">บทคัดย่อ (Abstract)</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {research.paper_abstract || "ไม่มีข้อมูลบทคัดย่อ"}
            </p>
          </section>

          {/* // KLA : ส่วนแสดงไฟล์ PDF */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">ไฟล์เอกสาร (PDF)</h2>
            {research.paper_file ? (
              <iframe
                src={research.paper_file}
                className="w-full h-96 rounded-lg border"
                title="PDF Viewer"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-5xl">
                404
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">คำสำคัญ</h2>
            <div className="flex flex-wrap gap-2">
              <KeywordTag label="Machine Learning" />
              <KeywordTag label="Recommendation System" />
              <KeywordTag label="AI" />
            </div>
          </section>

          {/* Comment */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">คอมเมนต์</h2>
            <CommentForm />
            <div className="space-y-4">
              {comments.map((c) => (
                <Comment
                  key={c.comment_id}
                  user={c.user_fullname}
                  text={c.comment}
                  date={new Date(c.created_at).toLocaleString("th-TH")}
                  userId={c.user_id} // ✅ ส่ง userId เพื่อโหลดรูป
                />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ดำเนินการ</h3>
            <div className="space-y-3">
              {research.paper_file && (
                <a
                  href={research.paper_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-white font-bold rounded-xl transition ${primaryBlue} shadow-lg shadow-blue-200/50`}
                >
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลด (PDF)</span>
                </a>
              )}
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition">
                <Archive className="w-5 h-5" />
                <span>อ้างอิง</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">สถิติ</h3>
            <div className="flex justify-around divide-x divide-gray-200">
              <StatItem Icon={Eye} count={research.paper_views || 0} label="รับชม" />
              <StatItem Icon={MessageSquare} count={comments.length} label="คอมเมนต์" />
              <StatItem Icon={Download} count={research.paper_file ? 1 : 0} label="ดาวน์โหลด" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">ผู้เขียนหลัก</h3>
            <AuthorBadge
              name={authorName || research.user_id || "ไม่ระบุชื่อ"} // ✅ แสดงชื่อจริงในผู้เขียนหลัก
              role="นักวิจัย"
              isPrimary
              userId={research.user_id} // ✅ ส่ง userId เพื่อโหลดรูป
            />
          </div>
        </div>
      </div>
    </div>
  );
}
