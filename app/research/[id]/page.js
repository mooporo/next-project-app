"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Download, Archive, Eye, MessageSquare, UserCircle } from "lucide-react";
import { Edit, Trash2 } from "lucide-react"; // KLA : ไอคอนแก้ไขและลบ
import { useRouter } from "next/navigation";

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

// KLA : KeywordTag และ ReferenceTag Components
const KeywordTag = ({ label }) => (
  <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 transition">
    {label}
  </span>
);

// KLA : ReferenceTag Component พร้อมลิงก์ไปยังหน้ารายละเอียดงานวิจัย
const ReferenceTag = ({ label, paperId }) => {
  const router = useRouter();

  const handleClick = () => {
    if (paperId) {
      router.push(`/research/${paperId}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      className="inline-block cursor-pointer bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 transition"
    >
      {label}
    </span>
  );
};



// KLA  : Comment แสดงรูปผู้ใช้จริง, แก้ไข และ ลบคอมเมนต์
const Comment = ({ user, text, date, userId, currentUser, onUpdate, onDelete, commentId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

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

  // KLA : ฟังก์ชันจัดการการบันทึกการแก้ไขคอมเมนต์
  const handleSave = async () => {
    if (!editedText.trim()) return;
    try {
      const { error } = await supabase
        .from("comment_tb")
        .update({ comment: editedText })
        .eq("comment_id", commentId);
      if (error) throw error;
      setIsEditing(false);
      onUpdate(commentId, editedText);
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // KLA : ฟังก์ชันจัดการการลบคอมเมนต์
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("comment_tb")
        .delete()
        .eq("comment_id", commentId);
      if (error) throw error;
      onDelete(commentId);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };


  // KLA : ส่วนแสดงคอมเมนต์ พร้อมปุ่มแก้ไขและลบ  
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
          {currentUser?.user_id === userId && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 hover:bg-blue-100 rounded-full transition"
                title="แก้ไข"
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-100 rounded-full transition"
                title="ลบ"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* ข้อความคอมเมนต์ */}
        {isEditing ? (
          <div className="flex space-x-2 mb-1">
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // KLA :ป้องกันขึ้นบรรทัดใหม่ เมื่อกด Enter หรือก็กันหลอน
                  handleSave();       // KLA: กด Enter → บันทึก
                }
              }}
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              บันทึก
            </button>
          </div>
        ) : (
          //KLA : แสดงข้อความคอมเมนต์
          <p className="text-gray-600 text-sm leading-relaxed mb-1 break-words whitespace-pre-wrap overflow-wrap break-all">
            {text}
          </p>

        )}


        {currentUser?.user_id === userId && (
          <div className="text-xs text-gray-400 mt-1">{date}</div>
        )}

        {currentUser?.user_id !== userId && (
          <div className="text-xs text-gray-400 mt-1">{date}</div>
        )}
      </div>
    </div>
  );
};

//  KLA : Comment Form Component จุดแสดงความคิดเห็น
const CommentForm = ({ paperId, currentUser, onNewComment }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser?.user_id) return;

    try {
      // Insert คอมเมนต์ใหม่ลง comment_tb
      const { data, error } = await supabase
        .from("comment_tb")
        .insert([
          {
            paper_id: paperId,
            user_id: currentUser.user_id,
            comment: comment.trim(),
          },
        ])
        .select()
        .maybeSingle(); // เลือกแถวที่ insert มา

      if (error) throw error;

      // เรียก callback เพื่ออัปเดต state ที่ parent
      if (onNewComment && data) {
        onNewComment({
          comment_id: data.comment_id,
          comment: data.comment,
          created_at: data.created_at,
          user_fullname: currentUser.user_fullname,
          user_id: currentUser.user_id,
        });
      }

      setComment(""); // เคลียร์ textarea
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    // KLA : ฟอร์มแสดงความคิดเห็น
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-sm font-medium text-gray-700 mb-2">แสดงความคิดเห็นของคุณ</div>
      <textarea
        className="w-full p-3 h-20 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none"
        placeholder="กรุณาพิมพ์ข้อความ..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // KLA :ป้องกันขึ้นบรรทัดใหม่ เมื่อกด Enter หรือก็กันหลอน
            handleSubmit(e);    // KLA: กด Enter → ส่งคอมเมนต์
          }
        }}
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
  const [research, setResearch] = useState(null);// KLA : ตั้งค่าเริ่มต้นเป็น null
  const [comments, setComments] = useState([]); // KLA : เพิ่ม state สำหรับคอมเมนต์
  const [errorMsg, setErrorMsg] = useState("");// KLA : ข้อความแสดงข้อผิดพลาด
  const [authorName, setAuthorName] = useState(""); // ✅ เพิ่ม state สำหรับชื่อผู้เขียน
  const [downloadCount, setDownloadCount] = useState(0); // KLA : เพิ่ม state สำหรับนับดาวน์โหลด
  const [currentUser, setCurrentUser] = useState(null); // KLA : state สำหรับผู้ใช้ปัจจุบัน
  const [keywords, setKeywords] = useState([]); // KLA : state สำหรับคำสำคัญ
  const [references, setReferences] = useState([]); // KLA : state สำหรับรายการอ้างอิง

  // KLA : ฟังก์ชันจัดการการดาวน์โหลดไฟล์ PDF
  const handleDownload = () => {
    if (!research?.paper_file) {
      console.warn("⚠️ ไม่มีไฟล์ PDF ให้ดาวน์โหลด");
      return;
    }

    // KLA : เปิดลิงก์ไฟล์ PDF ในแท็บใหม่
    window.open(research.paper_file, "_blank", "noopener,noreferrer");

    // KLA : อัปเดตตัวนับการดาวน์โหลด
    setDownloadCount((prev) => prev + 1);
  };

  useEffect(() => {

    if (!id) return;

    // KLA : ดึงรายการอ้างอิง
    const fetchReferences = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_citation_mtb")
          .select(`
        paper_ref,
        paper_tb!paper_ref(paper_title)
      `)
          .eq("paper_id", id);

        if (error) throw error;
          
        // KLA : สร้างรายการอ้างอิง
        const referenceList = data.map((r) => ({
          paper_id: r.paper_tb?.paper_id || r.paper_ref, // ใช้ paper_id ของงานวิจัยจริง หรือเก็บ ref
          title: r.paper_tb?.paper_title || r.paper_ref
        }));
        setReferences(referenceList);
      } catch (err) {
        console.error("Error fetching references:", err);
      }
    };
    fetchReferences();

    const fetchKeywords = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_keyword_mtb")
          .select("keyword_tb(keyword_name)")
          .eq("paper_id", id);

        if (error) throw error;

        const keywordList = data.map((k) => k.keyword_tb.keyword_name);
        setKeywords(keywordList);
      } catch (err) {
        console.error("Error fetching keywords:", err);
      }
    };

    fetchKeywords();




    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("paper_id,user_id,paper_title,paper_abstract,paper_file,paper_image,paper_views,created_at")
          .eq("paper_id", id)
          .maybeSingle();

        if (error) throw error;

        // KLA:  ถ้า paper_file ไม่ใช่ URL เต็ม ให้แปลงเป็น public URL ของ Supabase Storage
        if (data?.paper_file && !data.paper_file.startsWith("http")) {
          const { data: fileUrl } = supabase.storage.from("paper_bk").getPublicUrl(data.paper_file);
          data.paper_file = fileUrl.publicUrl;
        }
        // KLA:  ถ้า paper_image ไม่ใช่ URL เต็ม ให้แปลงเป็น public URL ของ Supabase Storage
        if (data.paper_image && !data.paper_image.startsWith("http")) {
          const { data: imgData } = supabase.storage.from("paper_bk").getPublicUrl(data.paper_image);
          data.paper_image = imgData.publicUrl;
        }


        setResearch(data || null); // KLA : ตั้งค่า research เป็น null ถ้าไม่มีข้อมูล
        setErrorMsg(data ? "" : "ไม่พบข้อมูลงานวิจัย"); // KLA : ข้อความถ้าไม่พบข้อมูล



        //  ดึงชื่อจริงของผู้เขียนจาก user_tb
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

    // KLA : ดึงข้อมูลผู้ใช้ปัจจุบัน
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          const { data: profile } = await supabase
            .from("user_tb")
            .select("user_fullname")
            .eq("user_id", user.id)
            .maybeSingle();
          setCurrentUser({
            user_id: user.id,
            user_fullname: profile?.user_fullname || "ไม่ระบุชื่อ",
          });
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();





    // KLA : ดึงคอมเมนต์ที่เกี่ยวข้องกับงานวิจัยนี้
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comment_tb")
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
          user_id: c.user_id, // KLA : เพิ่ม user_id
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
              <span>โดย: {authorName || research.user_id || "ไม่ระบุผู้เขียน"}</span>
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
                    "#2563EB", // blue-600
                    "#9333EA", // purple-600
                    "#DB2777", // pink-600
                    "#059669", // green-600
                    "#EA580C", // orange-600
                    "#1E3A8A", // indigo-900
                    "#047857", // emerald-700
                    "#DC2626", // red-600
                    "#0EA5E9", // sky-500
                    "#D97706", // amber-600
                    "#7C3AED", // violet-600
                    "#15803D", // green-700
                    "#BE185D", // rose-700
                    "#14B8A6", // teal-500
                    "#3B82F6", // blue-500
                    "#4F46E5", // indigo-600
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
                className="w-full h-[700px] rounded-lg border"
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
              {keywords.length > 0 ? (
                keywords.map((k, i) => <KeywordTag key={i} label={k} />)
              ) : (
                <span className="text-gray-400">ไม่มีคำสำคัญ</span>
              )}
            </div>
          </section>
          {/* KLA : ส่วนแสดงอ้างอิง */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">อ้างอิง</h2>
            <div className="flex flex-wrap gap-2">
              {references.length > 0 ? (
                references.map((ref, i) => (

                  <ReferenceTag
                    key={i}
                    label={ref.title || ref}
                    paperId={ref.paper_id || ref} // ใช้ id สำหรับ navigate
                  />
                ))
              ) : (
                <span className="text-gray-400">ไม่มีอ้างอิง</span>
              )}
            </div>
          </section>

          {/* KLA : ส่วนแสดงComment ปรับใหม่ */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">คอมเมนต์</h2>
            <CommentForm
              paperId={id}
              currentUser={currentUser} // KLA: ส่งข้อมูลผู้ใช้ปัจจุบัน
              onNewComment={(newComment) =>
                setComments((prev) => [newComment, ...prev])
              }
            />
            <div className="space-y-4">
              {comments.map((c) => (
                <Comment
                  key={c.comment_id}
                  commentId={c.comment_id}
                  user={c.user_fullname}
                  text={c.comment}
                  date={new Date(c.created_at).toLocaleString("th-TH")}
                  userId={c.user_id}
                  currentUser={currentUser}
                  onUpdate={(id, newText) =>
                    setComments((prev) =>
                      prev.map((cm) => (cm.comment_id === id ? { ...cm, comment: newText } : cm))
                    )
                  }
                  onDelete={(id) =>
                    setComments((prev) => prev.filter((cm) => cm.comment_id !== id))
                  }
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
                <button
                  onClick={handleDownload} // KLA : เพิ่มฟังก์ชันดาวน์โหลด
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-white font-bold rounded-xl transition ${primaryBlue} shadow-lg shadow-blue-200/50`}
                >
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลด (PDF)</span>
                </button>
              )}

            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">สถิติ</h3>
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <StatItem Icon={Eye} count={research.paper_views || 0} label="รับชม" />
              <StatItem Icon={MessageSquare} count={comments.length} label="คอมเมนต์" />
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