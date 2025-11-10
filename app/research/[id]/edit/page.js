"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

const STORAGE_BUCKET = "user_bk";

export default function ResearchEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [research, setResearch] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [paperFile, setPaperFile] = useState(null);
  const [paperImage, setPaperImage] = useState(null);

  // ดึงข้อมูลงานวิจัย
  useEffect(() => {
    if (!id) return;

    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("paper_id,user_id,paper_title,paper_abstract,paper_file,paper_image")
          .eq("paper_id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setErrorMsg("ไม่พบข้อมูลงานวิจัย");
          return;
        }

        setResearch(data);
        setTitle(data.paper_title || "");
        setAbstract(data.paper_abstract || "");
        setPaperFile(data.paper_file || null);
        setPaperImage(data.paper_image || null);

        // ดึงชื่อผู้เขียน
        if (data.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("user_tb")
            .select("user_fullname")
            .eq("user_id", data.user_id)
            .maybeSingle();

          if (!userError && userData) {
            setAuthorName(userData.user_fullname);
          }
        }
      } catch (err) {
        console.error("Error fetching research:", err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, [id]);

  // อัปเดตข้อมูลงานวิจัย
  const handleSave = async () => {
    try {
      const updates = {
        paper_title: title,
        paper_abstract: abstract,
      };

      // อัปโหลดไฟล์ PDF ถ้ามีการเปลี่ยน
      if (paperFile instanceof File) {
        const filePath = `papers/${Date.now()}_${paperFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, paperFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: fileData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
        updates.paper_file = fileData.publicUrl;
      }

      // อัปโหลดรูปภาพถ้ามีการเปลี่ยน
      if (paperImage instanceof File) {
        const imgPath = `images/${Date.now()}_${paperImage.name}`;
        const { error: imgError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(imgPath, paperImage, { upsert: true });

        if (imgError) throw imgError;

        const { data: imgData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imgPath);
        updates.paper_image = imgData.publicUrl;
      }

      const { error } = await supabase
        .from("paper_tb")
        .update(updates)
        .eq("paper_id", id);

      if (error) throw error;

      alert("อัปเดตงานวิจัยเรียบร้อยแล้ว!");
      router.push(`/research/${id}`);
    } catch (err) {
      console.error("Error updating research:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">กำลังโหลดข้อมูล...</div>;
  if (errorMsg) return <div className="text-center py-20 text-red-500">{errorMsg}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">แก้ไขงานวิจัย</h1>
        <p className="text-sm text-gray-500">โดย: {authorName}</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเรื่อง</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">บทคัดย่อ</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-40 resize-none focus:ring-blue-500 focus:border-blue-500"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ไฟล์ PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPaperFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700"
          />
          {research.paper_file && !paperFile && (
            <p className="text-xs text-gray-500 mt-1">ไฟล์ปัจจุบัน: {research.paper_file}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รูปภาพปก</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaperImage(e.target.files[0])}
            className="block w-full text-sm text-gray-700"
          />
          {research.paper_image && !paperImage && (
            <img
              src={research.paper_image}
              alt="ปัจจุบัน"
              className="mt-2 w-48 h-48 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
}
