"use client";

import React, { useState, useEffect } from 'react';
import { Mail, BookOpen, Globe, Users, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; // เพิ่ม useRouter

const ProfileCard = ({ data }) => {
  const router = useRouter(); // ใช้สำหรับ navigation

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-50 border-4 border-blue-100">
          {data.avatar_url
            ? <img src={data.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover" />
            : <span className="text-xl font-semibold text-blue-500">Profile</span>
          }
        </div>
        <h2 className="text-xl font-bold mt-4 text-gray-800">{data.name}</h2>
        <p className="text-sm text-gray-600">{data.title}</p>
        <p className="text-sm text-gray-400">{data.institution}</p>
      </div>

      <button
        onClick={() => router.push('/edit-profile')} // เพิ่ม navigation ไปหน้าแก้ไข
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-150 shadow-md mb-8 flex items-center justify-center space-x-2"
      >
        <Users size={18} /> 
        <span>แก้ไขโปรไฟล์</span>
      </button>

      <div className="mb-8 border-t pt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2">เกี่ยวกับ</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{data.about}</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2">ช่องทางติดต่อ</h3>
        <div className="space-y-3">
          {data.contacts.map((contact, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm text-gray-700 hover:text-blue-600 transition duration-150">
              <contact.icon size={18} className="text-gray-500 flex-shrink-0" />
              <span className="truncate">{contact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResearchItem = ({ item }) => (
  <div className="flex justify-between items-center py-4 border-b hover:bg-gray-50 transition duration-150 px-2 -mx-2 rounded-lg">
    <div className="flex flex-col">
      <p className="text-base font-medium text-gray-800">{item.title}</p>
      <p className="text-sm text-gray-500">{item.date}</p>
    </div>
    <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
      {item.status}
    </span>
  </div>
);

const ResearchList = ({ items }) => (
  <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <h3 className="text-xl font-bold text-gray-800">ผลงานวิจัยล่าสุด</h3>
      <button className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-700 transition duration-150">
        ดูทั้งหมด
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
    <div className="space-y-1">
      {items.map(item => (
        <ResearchItem key={item.paper_id} item={item} />
      ))}
    </div>
    <div className="pt-4"></div>
  </div>
);

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Guest",
    title: "",
    institution: "",
    about: "",
    avatar_url: "",
    contacts: [
      { type: 'email', value: '', icon: Mail },
      { type: 'scholar', value: '', icon: BookOpen },
      { type: 'orcid', value: '', icon: Globe },
    ],
  });

  const [researchWorks, setResearchWorks] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // ดึงข้อมูล user_tb
        const { data: userInfo, error: profileErr } = await supabase
          .from("user_tb")
          .select("user_fullname, username, user_email, user_birthdate, user_image, user_org_id, user_type_id")
          .eq("user_id", user.id)
          .single();

        if (profileErr) {
          console.error("Error fetching profile:", profileErr);
        } else if (userInfo) {
          let avatarUrl = "";
          if (userInfo.user_image) {
            const { data: publicData } = supabase
              .storage
              .from("user_bk")
              .getPublicUrl(userInfo.user_image);
            avatarUrl = publicData?.publicUrl || "";
          }

          setProfileData({
            name: userInfo.username || "Anonymous",
            title: "",
            institution: "",
            about: "",
            avatar_url: avatarUrl,
            contacts: [
              { type: 'email', value: userInfo.user_email || "", icon: Mail },
              { type: 'scholar', value: "", icon: BookOpen },
              { type: 'orcid', value: "", icon: Globe },
            ],
          });
        }

        // ดึงผลงานวิจัยจาก paper_tb
        const { data: works, error: worksErr } = await supabase
          .from("paper_tb")
          .select("paper_id, paper_title, created_at, paper_status")
          .eq("user_id", user.id);

        if (worksErr) {
          console.error("Error fetching papers:", worksErr);
        } else if (works) {
          setResearchWorks(
            works.map(w => ({
              paper_id: w.paper_id,
              title: w.paper_title,
              date: new Date(w.created_at).toLocaleDateString(),
              status: w.paper_status?.toString() || "N/A",
            }))
          );
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCard data={profileData} />
        </div>
        <div className="lg:col-span-2">
          <ResearchList items={researchWorks} />
        </div>
      </div>
    </div>
  );
}
