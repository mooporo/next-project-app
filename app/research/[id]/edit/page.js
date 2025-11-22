"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Edit, Plus, UserCircle } from "lucide-react";
const STORAGE_BUCKET = "paper_bk";
const USER_BUCKET = "user_bk";

// KLA : AuthorBadge แสดงรูปผู้ใช้และชื่อ
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
          // ดึง public URL จาก storage
          const { data: { publicUrl } } = supabase.storage
            .from(USER_BUCKET)
            .getPublicUrl(userData.user_image);

          setAvatarUrl(publicUrl); // ใช้ publicUrl
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
  const [popup, setPopup] = useState({ show: false, message: "", success: true }); // KLA : popup state 
  const [references, setReferences] = useState([]); // แสดงรายการ references ปัจจุบัน
  const [allPapers, setAllPapers] = useState([]); // สำหรับ dropdown
  const [selectedRef, setSelectedRef] = useState(""); // paper_id ที่เลือก
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");



  // KLA : ฟังก์ชันแสดง popup
  const showPopup = (message, success = true) => {
    setPopup({ show: true, message, success });

    setTimeout(() => {
      setPopup({ show: false, message: "", success: true });
    }, 2000);
  };


  // KLA : ดึงข้อมูลงานวิจัย
  useEffect(() => {
    if (!id) return;

    // KLA : ดึงรูป avatar ผู้เขียนหลัก
    const fetchAvatar = async () => {
      if (!userId) return;
      try {
        const { data: userData, error } = await supabase
          .from("user_tb")
          .select("user_image")
          .eq("user_id", userId)
          .maybeSingle();

        if (!error && userData?.user_image) {
          const fileUrl = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(userData.user_image);
          setAvatarUrl(fileUrl.publicUrl);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };
    fetchAvatar();

    // KLA : ดึงงานวิจัยทั้งหมด สำหรับเลือกอ้างอิง
    const fetchAllPapers = async () => {
      try {
        const { data: allP, error: allErr } = await supabase
          .from("paper_tb")
          .select("paper_id, paper_title")
          .neq("paper_id", id);
        if (allErr) throw allErr;
        setAllPapers(allP || []);

        const { data: refsData, error: refsErr } = await supabase
          .from("paper_citation_mtb")
          .select("paper_ref")
          .eq("paper_id", id);
        if (refsErr) throw refsErr;

        const refs = refsData.map(item => {
          const paper = allP.find(p => p.paper_id === item.paper_ref);
          return {
            paper_id: id,
            paper_ref: item.paper_ref,
            paper_title: paper ? paper.paper_title : "ไม่ทราบชื่อ",
          };
        });

        setReferences(refs);

      } catch (err) {
        console.error(err);
      }
    };

    fetchAllPapers();

    // KLA : ดึง references ปัจจุบัน
    const fetchReferences = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_citation_mtb")
          .select("paper_ref"); // แค่ paper_ref ก็พอ

        if (error) throw error;

        // map ไปหา title จาก allPapers
        const refs = data.map((item) => {
          const paper = allPapers.find((p) => p.paper_id === item.paper_ref); // allPapers ยังไม่โหลด!
          return {
            paper_id: id,
            paper_ref: item.paper_ref,
            paper_title: paper ? paper.paper_title : "ไม่ทราบชื่อ",
          };
        });

        setReferences(refs);
      } catch (err) {
        console.error("Error fetching references:", err);
      }
    };
    fetchReferences();
    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("*")
          .eq("paper_id", id)
          .maybeSingle();
        if (error) throw error;
        if (!data) return;

        setResearch(data);
        setEditedAbstract(data.paper_abstract || "");
        setEditedTitle(data.paper_title || "");

        // KLA : ดึง keywords ผ่าน paper_keyword_mtb
        const { data: kwData, error: kwError } = await supabase
          .from("paper_keyword_mtb")
          .select("keyword_tb(*)")
          .eq("paper_id", id);

        if (!kwError && kwData) {
          const kwList = kwData.map((item) => item.keyword_tb);
          setKeywords(kwList);
        }

        // KLA : ดึงชื่อผู้เขียนหลัก
        if (data.user_id) {
          const { data: userData, error: userError } = await supabase
            .from("user_tb")
            .select("user_fullname")
            .eq("user_id", data.user_id)
            .maybeSingle();
          if (!userError && userData) setAuthorName(userData.user_fullname);
        }

        // KLA: แปลง URL ของไฟล์/รูป เป็น public URL
        if (data.paper_file && !data.paper_file.startsWith("http")) {
          const { data: fileUrl } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.paper_file);
          data.paper_file = fileUrl.publicUrl;
        }
        if (data.paper_image && !data.paper_image.startsWith("http")) {
          const { data: imgUrl } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.paper_image);
          data.paper_image = `${imgUrl.publicUrl}?t=${new Date().getTime()}`;
        }

      } catch (err) {
        console.error("Error fetching research:", err);
      }
    };

    fetchResearch();
  }, [id]);

  // KLA : อัปเดต abstract
  const handleSaveAbstract = async () => {
    if (!research) return;
    const { error } = await supabase
      .from("paper_tb")
      .update({ paper_abstract: editedAbstract, updated_at: new Date().toISOString() })
      .eq("paper_id", research.paper_id);
    if (error) return console.error(error);
    setResearch({ ...research, paper_abstract: editedAbstract });
    setIsEditingAbstract(false);
  };

  // KLA : เพิ่ม keyword
  // เพิ่ม keyword
  const handleAddKeyword = async () => {
    const trimmedKeyword = newKeyword.trim();
    if (!trimmedKeyword) {
      showPopup("กรุณากรอกคีย์เวิร์ด", false);
      return;
    }

    try {
      // ตรวจสอบว่า keyword ซ้ำหรือยัง
      const { data: existing, error: checkError } = await supabase
        .from("keyword_tb")
        .select("*")
        .eq("keyword_name", trimmedKeyword)
        .maybeSingle();

      if (checkError) throw checkError;

      let keywordId;
      let keywordObj;

      if (existing) {
        keywordId = existing.keyword_id;
        keywordObj = existing;
      } else {
        const { data: newKeywordData, error: insertError } = await supabase
          .from("keyword_tb")
          .insert([{ keyword_name: trimmedKeyword }])
          .select()
          .single();

        if (insertError) throw insertError;
        keywordId = newKeywordData.keyword_id;
        keywordObj = newKeywordData;
      }

      // สร้าง mapping paper_keyword_mtb
      const { error: mappingError } = await supabase
        .from("paper_keyword_mtb")
        .insert([{ paper_id: id, keyword_id: keywordId }]);
      if (mappingError) throw mappingError;

      // อัปเดต state
      setKeywords((prev) => [...prev, keywordObj]);
      setNewKeyword("");
      showPopup("เพิ่มคีย์เวิร์ดสำเร็จ!", true);

    } catch (err) {
      console.error("Error adding keyword:", err);
      showPopup("เกิดข้อผิดพลาดในการเพิ่มคีย์เวิร์ด", false);
    }
  };

  // KLA : ลบ keyword
  const handleDeleteKeyword = async (keywordId) => {
    try {
      // ลบ mapping ก่อน
      const { error: mappingError } = await supabase
        .from("paper_keyword_mtb")
        .delete()
        .eq("paper_id", id)
        .eq("keyword_id", keywordId);
      if (mappingError) throw mappingError;

      // อัปเดต state
      setKeywords(keywords.filter((k) => k.keyword_id !== keywordId));
      showPopup("ลบคีย์เวิร์ดสำเร็จ", true);
    } catch (err) {
      console.error("Error deleting keyword:", err);
      showPopup("ลบไม่สำเร็จ", false);
    }
  };

  // KLA : บันทึกการเปลี่ยนแปลงไฟล์ PDF
  const handleSaveFile = async () => {
    if (!research) return;
    setSavingFile(true);
    try {
      const fileExtension = file.name.split(".").pop();
      const filePath = `pdfs/File_${Date.now()}.${fileExtension}`;

      // KLA : อัปเดต database (ตัวอย่าง: เซ็ต paper_file เป็นค่าเดิม หรือ null)
      const { error: dbError } = await supabase
        .from("paper_tb")
        .update({ paper_file: research.paper_file || null, updated_at: new Date().toISOString() })
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

  // KLA : เพิ่มอ้างอิงงานวิจัย
  const handleAddReference = async () => {
    if (!selectedRef) {
      showPopup("กรุณาเลือกงานวิจัย", false);
      return;
    }

    if (references.some((r) => r.paper_ref === selectedRef)) {
      showPopup("งานวิจัยนี้ถูกอ้างอิงแล้ว", false);
      return;
    }

    try {
      // ตรวจสอบว่า paper_ref มีอยู่จริง
      const refPaper = allPapers.find((p) => p.paper_id === selectedRef);
      if (!refPaper) throw new Error("ไม่พบงานวิจัยที่เลือก");

      const { data, error } = await supabase
        .from("paper_citation_mtb")
        .insert([{ paper_id: research.paper_id, paper_ref: selectedRef }])
        .select(); // ดึงข้อมูลหลัง insert

      if (error) throw error;

      setReferences(prev => [
        ...prev,
        {
          paper_id: research.paper_id,
          paper_ref: selectedRef,
          paper_title: refPaper.paper_title
        }
      ]);

      setSelectedRef("");
      showPopup("เพิ่มอ้างอิงสำเร็จ", true);
    } catch (err) {
      console.error("Error adding reference:", err);
      showPopup("เพิ่มอ้างอิงไม่สำเร็จ", false);
    }
  };
  // KLA : ลบอ้างอิงงานวิจัย
  const handleDeleteReference = async (refId) => {
    try {
      await supabase
        .from("paper_citation_mtb")
        .delete()
        .eq("paper_id", research.paper_id)
        .eq("paper_ref", refId);

      setReferences(references.filter((r) => r.paper_ref !== refId));
      showPopup("ลบอ้างอิงสำเร็จ", true);
    } catch (err) {
      console.error("Error deleting reference:", err);
      showPopup("ลบอ้างอิงไม่สำเร็จ", false);
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
              <span className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold text-center px-4">
                {research.paper_title}
              </span>
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
                      //  อัปโหลดไปยัง storage
                      const { error: uploadError } = await supabase.storage
                        .from(STORAGE_BUCKET)
                        .upload(filePath, file, { upsert: true });

                      if (uploadError) throw uploadError;

                      // อัปเดต database
                      const { error: dbError } = await supabase
                        .from("paper_tb")
                        .update({ paper_image: filePath, updated_at: new Date().toISOString() })
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
                        .update({ paper_image: null, updated_at: new Date().toISOString() })
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
          <div className="mb-6 flex items-center gap-2">
            {isEditingTitle ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from("paper_tb")
                        .update({ paper_title: editedTitle, updated_at: new Date().toISOString() })
                        .eq("paper_id", research.paper_id);
                      if (error) throw error;
                      setResearch({ ...research, paper_title: editedTitle });
                      setIsEditingTitle(false);
                    } catch (err) {
                      console.error("Error updating title:", err);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  บันทึก
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{research.paper_title}</h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
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

          <section className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-xl font-bold text-gray-800 mb-3">คีย์เวิร์ด</h2>

            {/* KLA : เพิ่มคีย์เวิร์ด */}
            <div className="flex gap-2 mb-4">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="เพิ่มคำสำคัญ"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg active:scale-95"
              >
                เพิ่ม
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <div
                  key={kw.keyword_id}
                  className="flex items-center px-3 py-1 bg-gray-200 rounded-full gap-2"
                >
                  <span>{kw.keyword_name}</span>
                  <button
                    onClick={() => handleDeleteKeyword(kw.keyword_id)}
                    className="text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md border mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">อ้างอิงงานวิจัย</h2>

            {/* Dropdown + Add */}
            <div className="flex gap-2 mb-4 items-center">
              {/* ห่อ select ด้วย div เพื่อควบคุม layout */}
              <div className="flex-1">
                <select
                  value={selectedRef}
                  onChange={(e) => setSelectedRef(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg truncate"
                  title={allPapers.find(p => p.paper_id === selectedRef)?.paper_title || ""}
                >
                  <option value="">เลือกงานวิจัย...</option>
                  {allPapers.map((p) => (
                    <option key={p.paper_id} value={p.paper_id}>
                      {p.paper_title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddReference}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex-shrink-0 active:scale-95"
              >
                เพิ่ม
              </button>
            </div>

            {/* แสดง references */}
            <div className="flex flex-wrap gap-2">
              {references.map((ref) => (
                <div key={ref.paper_ref} className="flex items-center px-3 py-1 bg-gray-200 rounded-full gap-2">
                  <span>{ref.paper_title}</span>
                  <button
                    onClick={() => handleDeleteReference(ref.paper_ref)}
                    className="text-red-600"
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
            {/* Updated At */}
            {research.updated_at && (
              <p className="text-sm text-gray-400 mb-2">
                แก้ไขล่าสุด: {new Date(research.updated_at).toLocaleString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ผู้เขียนหลัก</h3>
            <AuthorBadge
              name={authorName || "ไม่ระบุชื่อ"}
              role="นักวิจัย"
              userId={research.user_id}
            />
          </div>
        </div>
      </div>
      {popup.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white text-sm font-medium
          ${popup.success ? "bg-green-600" : "bg-red-600"}`}
        >
          {popup.message}
        </div>
      )}

    </div>
  );
}