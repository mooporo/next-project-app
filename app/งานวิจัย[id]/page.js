"use client";

import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Icons
const DownloadIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const EditIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const EyeIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const MessageCircleIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;

// Mock Data
const researchData = {
  title: "การพัฒนาระบบแนะนำร้านอาหารด้วย Machine Learning",
  author: "โดม, สมศักดิ์ จักษ์ไพวัล",
  date: "17 ตุลาคม 2568",
  abstract: "งานวิจัยนี้มุ่งเน้นไปที่การพัฒนาระบบแนะนำร้านอาหารด้วยเทคนิค Machine Learning ...",
  stats: { views: "1,204", comments: "15", downloads: "320" },
  mainAuthor: { name: "สมศักดิ์ จักษ์ไพวัล", initial: "S", role: "หัวหน้างานวิจัย" },
  tags: ["Machine Learning", "Recommendation System", "Collaborative Filtering"],
  comments: [
    { id: 1, author: "วิทยา พัฒนวดี", date: "20 ตุลาคม 2568", text: "เป็นงานวิจัยที่ดีมากครับ", avatarInitial: "ว" },
    { id: 2, author: "อมิตา วิจัย", date: "19 ตุลาคม 2568", text: "ขอบคุณสำหรับงานวิจัยดีๆ ครับ", avatarInitial: "อ" },
  ],
};

// Components
const StatsBlock = ({ stats }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm mb-6">
    <h3 className="font-semibold text-gray-700 mb-3 text-sm">สถิติ</h3>
    <div className="flex justify-between text-center">
      <div className="flex flex-col items-center">
        <EyeIcon className="text-blue-500 w-6 h-6" />
        <span className="text-lg font-bold text-gray-800">{stats.views}</span>
        <span className="text-xs text-gray-500">ครั้งเข้าชม</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageCircleIcon className="text-blue-500 w-6 h-6" />
        <span className="text-lg font-bold text-gray-800">{stats.comments}</span>
        <span className="text-xs text-gray-500">ความคิดเห็น</span>
      </div>
      <div className="flex flex-col items-center">
        <DownloadIcon className="text-blue-500 w-6 h-6" />
        <span className="text-lg font-bold text-gray-800">{stats.downloads}</span>
        <span className="text-xs text-gray-500">ดาวน์โหลด</span>
      </div>
    </div>
  </div>
);

const AuthorBlock = ({ author }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm">
    <h3 className="font-semibold text-gray-700 mb-4 text-sm">ผู้เขียนหลัก</h3>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">{author.initial}</div>
      <div>
        <div className="font-medium text-gray-800">{author.name}</div>
        <div className="text-xs text-gray-500">{author.role}</div>
      </div>
    </div>
  </div>
);

const CommentsSection = ({ comments }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">คอมเมนต์ ({comments.length})</h2>
    <textarea className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" placeholder="เขียนคอมเมนต์ของคุณ..." />
    <div className="mt-3 text-left">
      <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-sm">
        ตอบคอมเมนต์
      </button>
    </div>
    <div className="divide-y divide-gray-200 mt-4">
      {comments.map((c) => (
        <div key={c.id} className="flex space-x-3 py-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">{c.avatarInitial}</div>
          <div>
            <div className="font-medium text-gray-800 text-sm">{c.author}</div>
            <div className="text-xs text-gray-500 mb-1">{c.date}</div>
            <p className="text-sm text-gray-700">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Page() {
  const { title, author, date, abstract, stats, mainAuthor, tags, comments } = researchData;
  const [commentsData, setCommentsData] = React.useState(comments);

  React.useEffect(() => {
    try {
      // Optional Firebase setup
      const firebaseConfig = {
        apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: ""
      };
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      signInAnonymously(auth).catch(console.error);
    } catch (e) { console.warn("Firebase not configured"); }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-[Inter]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <header className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{title}</h1>
              <p className="text-sm text-gray-500"><span className="font-medium">โดย:</span> {author} | <span className="font-medium">เผยแพร่เมื่อ:</span> {date}</p>
            </header>

            <div className="w-full h-56 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-3xl">Research Cover</div>

            <div className="p-6 bg-white rounded-xl shadow-sm space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">บทคัดย่อ (Abstract)</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{abstract}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">คีย์เวิร์ด</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 cursor-pointer">{tag}</span>)}
              </div>
            </div>

            <CommentsSection comments={commentsData} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm">ดำเนินการ</h3>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                <DownloadIcon className="text-white mr-2" /> ดาวน์โหลด PDF
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition duration-150">
                <EditIcon className="text-gray-600 mr-2" /> แก้ไขงานวิจัย
              </button>
            </div>

            <StatsBlock stats={stats} />
            <AuthorBlock author={mainAuthor} />
          </div>
        </div>
      </div>
    </div>
  );
}
