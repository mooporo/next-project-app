"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const STORAGE_BUCKET = "user_bk"; 

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    user_fullname: "",
    user_email: "",
    user_birthdate: "",
    user_org_id: null,
    user_type_id: null,
    current_password: "",
    new_password: "",
    confirm_new_password: "",
    user_image: "",
  });

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data: userData, error: getUserErr } = await supabase.auth.getUser();
        if (getUserErr || !userData?.user) {
          console.error("No authenticated user or error:", getUserErr);
          setLoading(false);
          return;
        }
        const user = userData.user;

        const { data: profileData, error: profileErr } = await supabase
          .from("user_tb")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileErr) {
          console.error("Error fetching user_tb:", profileErr);
          setLoading(false);
          return;
        }

        setForm((prev) => ({
          ...prev,
          user_fullname: profileData.user_fullname || "",
          user_email: profileData.user_email || (user.email || ""),
          user_birthdate: profileData.user_birthdate || "",
          user_org_id: profileData.user_org_id || null,
          user_type_id: profileData.user_type_id || null,
          user_image: profileData.user_image || "",
        }));

        if (profileData.user_image) {
          try {
            const { data: publicData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(profileData.user_image);
            setAvatarUrl(publicData?.publicUrl || null);
          } catch (err) {
            console.warn("Could not get public URL for avatar:", err);
          }
        } else {
          setAvatarUrl(null);
        }
      } catch (err) {
        console.error("Unexpected error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarUrl(url);

    setForm((p) => ({ ...p, __newAvatarFile: file }));
  };

  const onClickUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onClickRemove = () => {
    setAvatarUrl(null);
    setForm((p) => ({ ...p, __removeAvatar: true, __newAvatarFile: null, user_image: "" }));
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSaving(true);

    try {
      const { data: userData, error: getUserErr } = await supabase.auth.getUser();
      if (getUserErr || !userData?.user) {
        alert("ไม่พบผู้ใช้ที่เข้าสู่ระบบ");
        setSaving(false);
        return;
      }
      const user = userData.user;

      if (form.new_password || form.confirm_new_password) {
        if (form.new_password !== form.confirm_new_password) {
          alert("รหัสผ่านใหม่ไม่ตรงกัน");
          setSaving(false);
          return;
        }
        const { data: updateData, error: updateErr } = await supabase.auth.updateUser({
          password: form.new_password,
        });
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: " + updateErr.message);
          setSaving(false);
          return;
        }
      }

      let finalImagePath = form.user_image || "";

      if (form.__newAvatarFile) {
        const file = form.__newAvatarFile;
        const filename = `${user.id}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filename, file, { cacheControl: "3600", upsert: true });

        if (uploadErr) {
          console.error("Upload error:", uploadErr);
          alert("เกิดข้อผิดพลาดในการอัปโหลดรูป: " + uploadErr.message);
          setSaving(false);
          return;
        }

        finalImagePath = uploadData?.path || filename;
      }

      if (form.__removeAvatar && form.user_image) {
        try {
          await supabase.storage.from(STORAGE_BUCKET).remove([form.user_image]);
        } catch (err) {
          console.warn("Could not remove old avatar:", err);
        }
        finalImagePath = "";
      }

      const updates = {
        user_fullname: form.user_fullname,
        user_birthdate: form.user_birthdate || null,
        user_image: finalImagePath || null,
      };

      const { data: updated, error: updateDbErr } = await supabase
        .from("user_tb")
        .update(updates)
        .eq("user_id", user.id);

      if (updateDbErr) {
        console.error("Error updating user_tb:", updateDbErr);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + updateDbErr.message);
        setSaving(false);
        return;
      }

      if (finalImagePath) {
        const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(finalImagePath);
        setAvatarUrl(publicData?.publicUrl || null);
      } else {
        setAvatarUrl(null);
      }

      setForm((p) => ({ ...p, __newAvatarFile: null, __removeAvatar: false, user_image: finalImagePath }));

      alert("บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Unexpected error saving profile:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-3xl flex flex-col items-start">
        {/* Header ยังคงอยู่นอกกรอบ และชิดซ้าย */}
        <div className="w-full mb-6 text-left">
          <h1 className="text-3xl font-bold text-gray-800">แก้ไขโปรไฟล์</h1>
          <p className="text-sm text-gray-500 mt-1">
            อัปเดตข้อมูลส่วนตัวและการจัดการบัญชีของคุณ
          </p>
        </div>

        {/* Card */}
        <div className="w-full profile-card bg-white p-6 md:p-8 lg:p-10 shadow-lg rounded-xl">
          {/* Profile Picture Section */}
          <section className="pb-8 mb-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">เปลี่ยนรูปโปรไฟล์</h2>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-500 border border-gray-300 shadow-sm">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>Profile</span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  รองรับไฟล์ .jpg, .jpeg, .png ขนาดไม่เกิน 5MB
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClickUpload}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition duration-150"
                  >
                    อัปโหลดรูปใหม่
                  </button>
                  <button
                    type="button"
                    onClick={onClickRemove}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition duration-150"
                  >
                    ลบรูป
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="mb-10">
            <h2 className="text-lg font-medium text-gray-700 mb-4">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ชื่อ-นามสกุล */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  name="user_fullname"
                  value={form.user_fullname}
                  onChange={handleInputChange}
                  className="input-focus w-full border border-gray-300 p-2.5 rounded-md focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">อีเมล</label>
                <input
                  type="email"
                  value={form.user_email}
                  disabled
                  className="w-full border border-gray-300 p-2.5 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">ไม่สามารถแก้ไขอีเมลได้</p>
              </div>

              {/* วันเกิด */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">วันเกิด</label>
                <input
                  type="date"
                  name="user_birthdate"
                  value={form.user_birthdate || ""}
                  onChange={handleInputChange}
                  className="input-focus w-full border border-gray-300 p-2.5 rounded-md focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="pt-8 mb-10 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">เปลี่ยนรหัสผ่าน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  name="current_password"
                  value={form.current_password}
                  onChange={handleInputChange}
                  className="input-focus w-full border border-gray-300 p-2.5 rounded-md focus:outline-none"
                />
              </div>

              {/* New password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleInputChange}
                  className="input-focus w-full border border-gray-300 p-2.5 rounded-md focus:outline-none"
                />
              </div>

              {/* Confirm new password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={form.confirm_new_password}
                  onChange={handleInputChange}
                  className="input-focus w-full border border-gray-300 p-2.5 rounded-md focus:outline-none"
                />
              </div>

              <div className="hidden md:block"></div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => history.back()}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-150"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition duration-150"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
