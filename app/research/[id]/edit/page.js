"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Edit, Plus, UserCircle } from "lucide-react";

const STORAGE_BUCKET = "paper_bk";

// --- AuthorBadge ---
const AuthorBadge = ({ name, role, userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;
      try {
        const { data: userData, error } = await supabase
          .from("user_tb")
          .select("user_image")
          .eq("user_id", userId)
          .maybeSingle();
        if (!error && userData?.user_image) {
          const fileUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(userData.user_image);
          setAvatarUrl(fileUrl.publicUrl);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };
    fetchAvatar();
  }, [userId]);

  return (
    <div className="flex items-center gap-4">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <UserCircle className="w-20 h-20 text-gray-400" />
      )}
      <div>
        <p className="font-extrabold text-2xl text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default function ResearchEditPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [isEditingAbstract, setIsEditingAbstract] = useState(false);
  const [editedAbstract, setEditedAbstract] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [savingFile, setSavingFile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Fetch research ---
  useEffect(() => {
    if (!id) return;

    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("*")
          .eq("paper_id", id)
          .maybeSingle();
        if (error) throw error;
        if (!data) return;

        // แปลง paper_file เป็น public URL
        if (data.paper_file && !data.paper_file.startsWith("http")) {
          const { data: fileUrl } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.paper_file);
          data.paper_file = fileUrl.publicUrl;
        }

        // แปลง paper_image เป็น public URL
        if (data.paper_image && !data.paper_image.startsWith("http")) {
          const { data: imgUrl } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.paper_image);
          data.paper_image = `${imgUrl.publicUrl}?t=${new Date().getTime()}`; // ป้องกัน cache
        }

        setResearch(data);
        setEditedAbstract(data.paper_abstract || "");
        setKeywords(data.keywords ? data.keywords.split(",") : []);

        // ดึงชื่อผู้เขียน
        if (data.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("user_tb")
            .select("user_fullname")
            .eq("user_id", data.user_id)
            .maybeSingle();
          if (!userError && userData) setAuthorName(userData.user_fullname);
        }
      } catch (err) {
        console.error("Error fetching research:", err);
      }
    };

    fetchResearch();
  }, [id]);
  // --- Update abstract ---
  const handleSaveAbstract = async () => {
    if (!research) return;
    const { error } = await supabase
      .from("paper_tb")
      .update({ paper_abstract: editedAbstract })
      .eq("paper_id", research.paper_id);
    if (error) return console.error(error);
    setResearch({ ...research, paper_abstract: editedAbstract });
    setIsEditingAbstract(false);
  };

  // --- Add keyword ---
  const handleAddKeyword = async () => {
    if (!newKeyword.trim() || !research) return;
    const updatedKeywords = [...keywords, newKeyword.trim()];
    const { error } = await supabase
      .from("paper_tb")
      .update({ keywords: updatedKeywords.join(",") })
      .eq("paper_id", research.paper_id);
    if (error) return console.error(error);
    setKeywords(updatedKeywords);
    setNewKeyword("");
  };

  // --- Delete keyword ---
  const handleDeleteKeyword = async (kw) => {
    if (!research) return;
    const updatedKeywords = keywords.filter((k) => k !== kw);
    const { error } = await supabase
      .from("paper_tb")
      .update({ keywords: updatedKeywords.join(",") })
      .eq("paper_id", research.paper_id);
    if (error) return console.error(error);
    setKeywords(updatedKeywords);
  };

  // --- Save PDF changes ---
  const handleSaveFile = async () => {
    if (!research) return;
    setSavingFile(true);
    try {
      const filePath = `papers/${research.paper_id}.pdf`;

      // อัปเดต database (ตัวอย่าง: เซ็ต paper_file เป็นค่าเดิม หรือ null)
      const { error: dbError } = await supabase
        .from("paper_tb")
        .update({ paper_file: research.paper_file || null })
        .eq("paper_id", research.paper_id);
      if (dbError) throw dbError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving file:", err);
    } finally {
      setSavingFile(false);
    }
  };

  if (!research) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ซ้าย: รูปและ abstract */}
        <div className="lg:col-span-2 space-y-8">
          {/* รูปปก */}
          <div className="w-full h-72 rounded-xl overflow-hidden flex items-center justify-center mb-6 relative"
            style={{ backgroundColor: "#2563EB" }}>

            {research.paper_image ? (
              <img
                src={research.paper_image}
                alt={research.paper_title}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-white text-3xl font-bold">{research.paper_title}</span>
            )}

            {/* ปุ่มอัปโหลดและลบรูปปก */}
            <div className="absolute top-3 right-3 flex gap-2">
              {/* อัปโหลดรูปปกใหม่ */}
              <label className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer flex items-center space-x-1 text-sm">
                <Plus className="w-4 h-4" />
                <span>อัปโหลดรูปปก</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.[0] || !research) return;
                    const file = e.target.files[0];
                    const fileExt = file.name.split('.').pop();
                    const filePath = `papers/${research.paper_id}_cover.${fileExt}`;

                    try {
                      // อัปโหลดไป storage
                      const { error: uploadError } = await supabase.storage
                        .from(STORAGE_BUCKET)
                        .upload(filePath, file, { upsert: true });
                      if (uploadError) throw uploadError;

                      // อัปเดต database
                      const { error: dbError } = await supabase
                        .from("paper_tb")
                        .update({ paper_image: filePath })
                        .eq("paper_id", research.paper_id);
                      if (dbError) throw dbError;

                      // ดึง public URL และอัปเดต state
                      const { data: fileUrl } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
                      const publicUrl = `${fileUrl.publicUrl}?t=${new Date().getTime()}`;
                      setResearch({ ...research, paper_image: publicUrl });

                    } catch (err) {
                      console.error("Error uploading cover:", err);
                    }
                  }}
                />
              </label>

              {/* ลบรูปปก */}
              {research.paper_image && (
                <button
                  onClick={async () => {
                    if (!research) return;
                    try {
                      // อัปเดต database
                      const { error } = await supabase
                        .from("paper_tb")
                        .update({ paper_image: null })
                        .eq("paper_id", research.paper_id);
                      if (error) throw error;

                      // รีเซ็ต state
                      setResearch({ ...research, paper_image: null });
                    } catch (err) {
                      console.error("Error deleting cover:", err);
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                >
                  ลบรูปปก
                </button>
              )}
            </div>
          </div>
          {/* Abstract */}
          <section className="bg-white p-6 rounded-xl shadow-md border mb-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-800">บทคัดย่อ</h2>
              <button
                onClick={() => setIsEditingAbstract(!isEditingAbstract)}
                className="p-1 hover:bg-blue-100 rounded-full transition"
              >
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            {isEditingAbstract ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg h-64 resize-y"
                  value={editedAbstract}
                  onChange={(e) => setEditedAbstract(e.target.value)}
                />
                <button
                  onClick={handleSaveAbstract}
                  className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
                >
                  บันทึก
                </button>
              </div>
            ) : (
              <p className="text-gray-600">{research.paper_abstract || "ไม่มีบทคัดย่อ"}</p>
            )}
          </section>

          {/* PDF */}
          <section className="bg-white p-6 rounded-xl shadow-md border mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">ไฟล์ PDF</h2>
              <div className="flex gap-2">
                {/* อัปโหลดไฟล์ใหม่ */}
                <label className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>อัปโหลดไฟล์ใหม่</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      if (!e.target.files?.[0] || !research) return;
                      const file = e.target.files[0];
                      const filePath = `papers/${research.paper_id}.pdf`;

                      try {
                        const { error: uploadError } = await supabase.storage
                          .from(STORAGE_BUCKET)
                          .upload(filePath, file, { upsert: true });
                        if (uploadError) throw uploadError;

                        const { data: fileUrl } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
                        const publicUrl = `${fileUrl.publicUrl}?t=${new Date().getTime()}`;

                        setResearch({ ...research, paper_file: publicUrl });
                      } catch (err) {
                        console.error("Error uploading file:", err);
                      }
                    }}
                  />
                </label>

                {/* ปุ่มบันทึกไฟล์ */}
                {research.paper_file && (
                  <button
                    onClick={handleSaveFile}
                    className={`px-3 py-1 rounded flex items-center space-x-1 transition
                      ${savingFile ? "bg-gray-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}
                      text-white`}
                    disabled={savingFile}
                  >
                    <span>
                      {savingFile
                        ? "กำลังบันทึก..."
                        : saveSuccess
                          ? "แก้ไขสำเร็จ"
                          : "บันทึก"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {research.paper_file ? (
              <iframe
                key={research.paper_file}
                src={research.paper_file}
                className="w-full h-[800px] rounded-lg border"
                title="PDF Viewer"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                ไม่มีไฟล์
              </div>
            )}
          </section>

          {/* Keywords */}
          <section className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">คีย์เวิร์ด</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="เพิ่มคำสำคัญ"
                  className="p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่ม</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <div key={kw} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <span>{kw}</span>
                  <button
                    onClick={() => handleDeleteKeyword(kw)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ขวา: ผู้เขียนหลัก */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ผู้เขียนหลัก</h3>
            <AuthorBadge
              name={authorName || "ไม่ระบุชื่อ"}
              role="นักวิจัย"
              userId={research.user_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
