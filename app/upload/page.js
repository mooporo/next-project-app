"use client";

import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // KLA : import supabase client
import { useRouter } from "next/navigation"; // KLA : import useRouter ด้านบน
import axios from "axios";
import { Switch } from "@mui/material";
import { N8N_TUNNEL_URL } from '@/app/lib/config';

// --- Reusable Form Field Component ---
const FormField = ({ label, required, children, helperText }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

// KLA : Component for File Upload Drop Zone 
const FileUploadDropZone = ({ icon: Icon, title, description, buttonText, acceptedFormat, onChange }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:border-blue-500 transition duration-300 cursor-pointer">
    <div className="flex justify-center text-blue-500 mb-3">
      <Icon size={36} className="text-gray-400" />
    </div>
    <p className="text-lg text-gray-600 mb-3 font-medium">{title}</p>
    {description && <p className="text-lg text-gray-600 mb-4">{description}</p>}
    <input
      type="file"
      accept="application/pdf"
      onChange={onChange}
      className="hidden"
      id="paperFileInput"
    />
    <label
      htmlFor="paperFileInput"
      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mt-1 cursor-pointer"
    >
      {buttonText}
    </label>
    <p className="mt-3 text-xs text-gray-500">{acceptedFormat}</p>
  </div>
);


const UploadPage = () => {

  const router = useRouter(); // KLA : สร้าง instance router


  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    researchType: "",
    coAuthors: "",
  });
  const [userId, setUserId] = useState(null); // KLA :  User ID state
  const [paperFile, setPaperFile] = useState(null); // KLA :  PDF file state
  const [coverImg, setCoverImg] = useState(null); // KLA : Cover image state
  const [loading, setLoading] = useState(false); // KLA : Loading state

  //เจมส์ : เพิ่ม state เก็บค่า switch
  const [isAutoGenEnabled, setIsAutoGenEnabled] = useState(false);

  const handleSwitchChange = () => {
    console.log(!isAutoGenEnabled);
    setIsAutoGenEnabled(prev => !prev);
  };

  const handleAutoGenClick = async () => {
    if (!paperFile) {
      alert("กรุณาอัปโหลดไฟล์เอกสารก่อน");
      return;
    }

    const formData = new FormData();
    formData.append("paperFile", paperFile);

    try {
      const res = await axios.post(`${N8N_TUNNEL_URL}/webhook/auto-gen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      })

      console.log(res.data);
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          // อัปเดต title, abstract, keywords, authors ทั้งหมด
          title: res.data.title || prev.title,
          abstract: res.data.abstract || prev.abstract,
          keywords: res.data.keywords || prev.keywords,
          coAuthors: res.data.authors || prev.coAuthors,
        }));
      }
      setIsAutoGenEnabled(prev => !prev);

    } catch (error) {
      console.log(error);
    }
  };

  // KLA : ดึง userId เมื่อ component โหลด
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setUserId(session.user.id);
    });
  }, []);

  // KLA: เพิ่มฟังก์ชันสำหรับบันทึกเป็นฉบับร่าง
  const handleSaveDraft = async () => {
    if (!formData.title || !formData.abstract) {
      alert("กรุณากรอกชื่อเรื่องและบทคัดย่อก่อนบันทึกฉบับร่าง");
      return;
    }

    if (!userId) {
      alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบก่อนบันทึก");
      return;
    }

    try {
      setLoading(true);
      let paperFileUrl = "";
      let coverImgUrl = "";

      // KLA: ถ้ามีไฟล์ PDF ให้บันทึก
      if (paperFile) {
        const { data, error } = await supabase.storage
          .from("paper_bk")
          .upload(`draft_pdfs/${Date.now()}_${paperFile.name}`, paperFile);

        if (error) {
          console.error("Error uploading draft PDF:", error);
          alert("เกิดข้อผิดพลาดตอนอัปโหลด PDF (ฉบับร่าง)");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("paper_bk")
          .getPublicUrl(data.path);
        paperFileUrl = urlData?.publicUrl || "";
      }

      // KLA: ถ้ามีรูปปก
      if (coverImg) {
        const { data, error } = await supabase.storage
          .from("paper_bk")
          .upload(`draft_covers/${Date.now()}_${coverImg.name}`, coverImg);

        if (error) {
          console.error("Error uploading draft cover:", error);
          alert("เกิดข้อผิดพลาดตอนอัปโหลดรูป (ฉบับร่าง)");
          return;
        }

        const { data: coverUrlData } = supabase.storage
          .from("paper_bk")
          .getPublicUrl(data.path);
        coverImgUrl = coverUrlData?.publicUrl || "";
      }

      // KLA บันทึกลงตาราง paper_tb
      const { error } = await supabase.from("paper_tb").insert([
        {
          user_id: userId,
          paper_title: formData.title,
          paper_abstract: formData.abstract,
          paper_file: paperFileUrl,
          paper_image: coverImgUrl,
          paper_type_id: formData.researchType === "journal" ? 1 : 2,
          paper_category_id: 1,
          paper_status: 0, // 0 = draft
          paper_views: 0,
        },
      ]);

      if (error) {
        console.error("เกิดข้อผิดพลาดตอนบันทึกฉบับร่าง:", error);
        alert("เกิดข้อผิดพลาดตอนบันทึกฉบับร่าง: " + error.message);
        return;
      }

      alert("บันทึกฉบับร่างสำเร็จ!");
      setFormData({ title: "", abstract: "", keywords: "", researchType: "", coAuthors: "" });
      setPaperFile(null);
      setCoverImg(null);

    } finally {
      setLoading(false);
    }
  };


  // KLA : เมือจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // KLA : เข้าถึงการเปลี่ยนแปลงไฟล์ PDF
  const handlePaperFileChange = (e) => {
    setPaperFile(e.target.files?.[0] || null);
  };

  // KLA : เข้าถึงการเปลี่ยนแปลงรูปปก
  const handleCoverImgChange = (e) => {
    setCoverImg(e.target.files?.[0] || null);
  };

  // KLA : ฟังก์ชันส่งข้อมูล
  const handleSubmit = async () => {
    // KLA : ตรวจสอบฟิลด์หลัก
    if (!formData.title || !formData.abstract || !paperFile) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและเลือกไฟล์งานวิจัย");
      return;
    }

    // KLA : ตรวจสอบ userId
    if (!userId) {
      alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบก่อนอัปโหลด");
      return;
    }

    try {
      setLoading(true);

      // KLA : อัปโหลดไฟล์ PDF ไปยัง Supabase Storage
      let paperFileUrl = "";
      if (paperFile) {

        // KLA : อัปโหลดรูปปกถ้ามี
        let coverImgUrl = "";
        if (coverImg) {
          try {
            const { data, error } = await supabase.storage
              .from("paper_bk")
              .upload(`covers/${Date.now()}_${coverImg.name}`, coverImg);

            if (error || !data) {
              console.error("เกิดข้อผิดพลาดตอนอัปโหลดรูป:", error);
              alert("เกิดข้อผิดพลาดตอนอัปโหลดรูปภาพ");
              return;
            }

            const { data: coverUrlData } = supabase.storage.from("paper_bk").getPublicUrl(data.path);
            coverImgUrl = coverUrlData?.publicUrl || "";

          } catch (imgErr) {
            console.error("เกิดข้อผิดพลาดตอนอัปโหลดรูป:", imgErr);
            alert("เกิดข้อผิดพลาดตอนอัปโหลดรูปภาพ");
          }
        }

        try {
          console.log("เริ่มอัปโหลด PDF:", paperFile.name, paperFile.size, paperFile.type);

          const { data, error } = await supabase.storage
            .from("paper_bk")      // KLA : ส่งไฟล์ไปยัง bucket paper_bk
            .upload(`pdfs/${Date.now()}_${paperFile.name}`, paperFile);

          if (error || !data) {
            console.error("เกิดข้อผิดพลาดตอนอัปโหลด PDF:", error);
            alert("เกิดข้อผิดพลาดตอนอัปโหลด PDF: " + (error?.message || "Unknown error"));
            return;
          }

          console.log("อัปโหลด PDF สำเร็จ:", data);

          // KLA : แปลง path เป็น public URL
          const { data: urlData } = supabase.storage.from("paper_bk").getPublicUrl(data.path);

          if (!urlData?.publicUrl) {
            alert("ไม่สามารถสร้าง URL สำหรับไฟล์ PDF ได้");
            return;
          }

          paperFileUrl = urlData.publicUrl; // KLA : กำหนด public URL ให้ตัวแปร

        } catch (uploadErr) {
          console.error("Exception ขณะอัปโหลด PDF:", uploadErr);
          alert("เกิดข้อผิดพลาดขณะอัปโหลด PDF");
          return;
        }

        //เจมส์ : เพิ่ม webhook ส่งให้ n8n แปลงเอกสารเก็บเข้า vectordb
        try {
          const vectorForm = new FormData();
          vectorForm.append("user_id", userId);
          vectorForm.append("paper_title", formData.title);
          vectorForm.append("paper_abstract", formData.abstract);
          vectorForm.append("paper_keywords", formData.keywords);
          vectorForm.append("paper_file", paperFileUrl);
          vectorForm.append("paper_image", coverImgUrl);
          vectorForm.append("paper_type_id", formData.researchType);
          vectorForm.append("paper_category_id", 1); //mock
          vectorForm.append("paper_status", 1); //mock
          vectorForm.append("paper_views", 30); //mock
          vectorForm.append("paper_score", 3.14); //mock
          vectorForm.append("paper_authors", formData.coAuthors);
          vectorForm.append("paperFile", paperFile);

          const res = await axios.post(`${N8N_TUNNEL_URL}/webhook-test/postpaper`, vectorForm, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'
            }
          })
          console.log(res)

          if (res.status === 200) {
            console.log('เก็บข้อมูลเข้า vectordb สำเร็จ');
          } else {
            console.log('เก็บข้อมูลเข้า vectordb ไม่สำเร็จ');
            return;
          }

        } catch (error) {
          console.log('เก็บข้อมูลเข้า vectordb ไม่สำเร็จจากเหตุไม่คาดฝัน');
          return;
        }
      }

      // KLA : บันทึกข้อมูลลงฐานข้อมูล
      // const { error } = await supabase.from("paper_tb").insert([
      //   {
      //     user_id: userId, //ต้องไม่ null
      //     paper_title: formData.title,
      //     paper_abstract: formData.abstract,
      //     paper_file: paperFileUrl, //ต้องไม่ null
      //     paper_image: coverImgUrl,   // optional ถ้าไม่มีจะเป็น ""
      //     paper_type_id: formData.researchType === "journal" ? 1 : 2,
      //     paper_category_id: 1,
      //     paper_status: 0,  //KLA : draft เป็น 0
      //     paper_views: 0,
      //   },
      // ]);

      // KLA : ตรวจสอบข้อผิดพลาดจากการบันทึกข้อมูล
      if (error) {
        console.error("เกิดข้อผิดพลาดตอน insert DB:", error);
        alert("เกิดข้อผิดพลาดตอนบันทึกลง database: " + error.message);
        return;
      }

      alert("อัปโหลดสำเร็จ!");
      setFormData({ title: "", abstract: "", keywords: "", researchType: "", coAuthors: "" });
      setPaperFile(null);
      setCoverImg(null);

      // KLA : เพิ่ม logic หลังอัปโหลดเสร็จ เช่น ไปที่หน้ารายการงานวิจัย
      router.push("/search");

    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-12 flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10">
        {/*เจมส์ : เพิ่มปุ่ม switch สําหรับ auto-gen ข้อมูลเอกสาร*/}
        <div className="flex flex-row items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200">
            อัปโหลดงานวิจัย
          </h1>
          <p className="ml-auto">เปิดโหมดสร้างข้อมูลเอกสารอัตโนมัติ</p>
          <Switch
            checked={isAutoGenEnabled}
            onClick={handleSwitchChange}
          />
        </div>

        {/* KLA : Section สำหรับอัพโหลดไฟล์งานวิจัย */}
        <section className="mb-10">
          <div className="flex flex-row items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-700">ไฟล์งานวิจัย</h2>
            <button
              onClick={handleAutoGenClick}
              disabled={!isAutoGenEnabled}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-base font-medium rounded-full shadow-lg text-white ${!isAutoGenEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ml-auto`}
            >
              Auto-Generate
            </button>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition duration-300 cursor-pointer
      ${paperFile ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-blue-500", "bg-blue-50"); }}
            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-blue-500", "bg-blue-50"); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
              const file = e.dataTransfer.files?.[0];
              if (file) handlePaperFileChange({ target: { files: [file] } });
            }}
          >
            {/* KLA : PDF preview สมารถโชว์ไฟล์ PDF ให้เห็นได้ */}
            {paperFile && (
              <div className="absolute inset-0 z-10 p-4">
                <embed
                  src={URL.createObjectURL(paperFile)}
                  type="application/pdf"
                  className="w-full h-full rounded-xl"
                />
              </div>
            )}

            {/* KLA : Overlay ปุ่มเลือกไฟล์ */}
            <div
              className={`flex flex-col justify-center items-center z-20 relative ${paperFile ? "opacity-0 hover:opacity-100 transition-opacity duration-300" : ""
                }`}
            >
              <div className="flex justify-center text-blue-500 mb-3">
                <Upload size={36} className="text-black-400" />
              </div>
              <p className="text-lg text-black-600 mb-3 font-medium">ลากไฟล์ PDF ของคุณมาวางที่นี่</p>
              <p className="text-lg text-black-600 mb-4">หรือ</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePaperFileChange}
                className="hidden"
                id="paperFileInput"
              />
              <label
                htmlFor="paperFileInput"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
              >
                เลือกไฟล์
              </label>
              {paperFile && (
                <p className="mt-2 text-sm text-gray-700">{paperFile.name}</p>
              )}
            </div>

            <p className="mt-3 text-xs text-black-500 relative z-20">รองรับไฟล์ PDF เท่านั้น, ขนาดสูงสุด 50MB</p>
          </div>
        </section>

        {/* Main Information Section */}
        <section className="mb-10 p-5 border border-gray-100 rounded-xl bg-white">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">ข้อมูลหลัก</h2>

          <FormField label="ชื่อ​งานวิจัย (Title)" required>
            <input
              type="text"
              name="title"
              value={formData.title}
              disabled={isAutoGenEnabled}
              onChange={handleChange}
              placeholder="ระบุชื่อ​งานวิจัย​ของ​คุณ..."
              className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none shadow-sm ${isAutoGenEnabled ? "border-red-500 border-dashed" : "border-gray-300"}`}
            />
          </FormField>

          <FormField label="บทคัดย่อ (Abstract)" required>
            <textarea
              rows={10}
              name="abstract"
              value={formData.abstract}
              disabled={isAutoGenEnabled}
              onChange={handleChange}
              placeholder="ใส่บทคัดย่อหรือคำอธิบายสั้นๆ เกี่ยวกับงานวิจัย..."
              className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none shadow-sm ${isAutoGenEnabled ? "border-red-500 border-dashed" : "border-gray-300"}`}
            />
          </FormField>

          <FormField label="คีย์เวิร์ด (Keywords)" required helperText="คั่นแต่ละคีย์เวิร์ดด้วยเครื่องหมายจุลภาค (comma)">
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              disabled={isAutoGenEnabled}
              onChange={handleChange}
              placeholder="เช่น AI, Machine Learning, Data Science"
              className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none shadow-sm ${isAutoGenEnabled ? "border-red-500 border-dashed" : "border-gray-300"}`}
            />
          </FormField>
        </section>

        {/* Additional Information Section */}
        <section className="mb-10 p-5 border border-gray-100 rounded-xl bg-white">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">
            ข้อมูลเพิ่มเติม <span className="text-red-500 ml-1">*</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormField label="ประเภทงานวิจัย">
                <select
                  name="researchType"
                  value={formData.researchType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base appearance-none shadow-sm cursor-pointer"
                >
                  <option value="" disabled>-- เลือกประเภท --</option>
                  <option value="journal">บทความวารสาร</option>
                  <option value="conference">การประชุมวิชาการ</option>
                </select>
              </FormField>
            </div>

            <div className="flex-1">
              <FormField label="ผู้เขียนร่วม (Co-authors)">
                <input
                  type="text"
                  name="coAuthors"
                  value={formData.coAuthors}
                  disabled={isAutoGenEnabled}
                  onChange={handleChange}
                  placeholder="เช่น อลิสา ไอดี, วิทยา พัฒนาดี"
                  className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none shadow-sm ${isAutoGenEnabled ? "border-red-500 border-dashed" : "border-gray-300"}`}
                />
              </FormField>
            </div>
          </div>

          <FormField label="รูปปก (Cover Image)">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-green-500 transition duration-300 cursor-pointer">
              {/* KLA : แสดงรูปปก */}
              {coverImg && (
                <img
                  src={URL.createObjectURL(coverImg)}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              )}

              <div className={`flex flex-col justify-center items-center ${coverImg ? 'opacity-0 hover:opacity-100 transition-opacity duration-300' : ''} z-10 relative`}>
                <div className="flex justify-center text-black-400 mb-3">
                  <ImageIcon size={30} />
                </div>
                <p className="text-lg text-black-600 mb-3">อัปโหลดรูปปก (ไม่บังคับ)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImgChange}
                  className="hidden"
                  id="coverImgInput"
                />
                <label
                  htmlFor="coverImgInput"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                >
                  เลือกไฟล์รูปภาพ
                </label>
                <p className="mt-3 text-xs text-black-800">รองรับ JPG, PNG (อัตราส่วน 16:9 แนะนำ)</p>
              </div>
            </div>
          </FormField>
        </section>

        {/* KLA : ปุ่มบันทึกการเปลี่ยนแปลง */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveDraft} // KLA: เพิ่ม event handler
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
          >
            บันทึกเป็นฉบับร่าง
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <Upload size={18} className="mr-2 -ml-1" />
            {loading ? "กำลังอัปโหลด..." : "อัปโหลดและส่งตรวจสอบ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
