"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const DownloadIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const EyeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function ResearchDetailPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select("paper_id,user_id,paper_abstract,paper_file,paper_image,paper_views,created_at")
          .eq("paper_id", id)
          .maybeSingle();
        if (error) throw error;
        setResearch(data || null);
        setErrorMsg(data ? "" : "ไม่พบข้อมูลงานวิจัย");
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
        setResearch(null);
      }
    };
    fetchResearch();
  }, [id]);

  if (!research) return <div className="text-center py-20 text-gray-500">{errorMsg}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-[Inter]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
              {/* Header / Title */}
              <header className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {research.paper_abstract || "ไม่มีชื่อเรื่อง"}
                </h1>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">User ID:</span> {research.user_id} |{" "}
                  <span className="font-medium">Created:</span>{" "}
                  {research.created_at ? new Date(research.created_at).toLocaleDateString("th-TH") : "-"}
                </p>
              </header>

              {/* Cover */}
              <div className="w-full h-96 bg-gray-200 rounded-xl shadow-inner flex items-center justify-center">
                {research.paper_image ? (
                  <img
                    src={research.paper_image}
                    alt={research.paper_abstract}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <span className="text-gray-500 font-semibold">Research Cover</span>
                )}
              </div>

              {/* Abstract */}
              {research.paper_abstract && (
                <div className="text-gray-700">
                  <h3 className="font-semibold mb-2 text-sm">บทคัดย่อ (Abstract)</h3>
                  <p>{research.paper_abstract}</p>
                </div>
              )}

              {/* PDF Viewer */}
              {research.paper_file && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">ไฟล์เอกสาร (PDF)</h3>
                  <iframe
                    src={research.paper_file}
                    className="w-full h-96 border rounded"
                    title="PDF Viewer"
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
              {research.paper_file && (
                <a
                  href={research.paper_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                >
                  <DownloadIcon className="text-white mr-2" /> ดาวน์โหลด PDF
                </a>
              )}
            </div>

            {/* Statistics */}
            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3 text-center">
              <h3 className="font-semibold text-gray-700 text-sm mb-3">สถิติ</h3>
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <EyeIcon className="text-blue-500 w-6 h-6" />
                  <span className="text-lg font-bold">{research.paper_views || 0}</span>
                  <span className="text-xs text-gray-500">ครั้งเข้าชม</span>
                </div>
                <div className="flex flex-col items-center">
                  <DownloadIcon className="text-blue-500 w-6 h-6" />
                  <span className="text-lg font-bold">{research.paper_file ? 1 : 0}</span>
                  <span className="text-xs text-gray-500">ดาวน์โหลด</span>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm">ผู้เขียน</h3>
              <p className="text-gray-700">{research.user_id}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
