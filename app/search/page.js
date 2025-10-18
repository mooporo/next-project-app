"use client"; // ✅ ต้องมีบรรทัดนี้บนสุด

import React, { useState } from 'react';
import { Search, Home, Upload, Image, Eye, MessageSquare } from 'lucide-react';
import Drawer from '../components/Drawer'; // ✅ import Drawer ของคุณ

// ตัวอย่างข้อมูลการ์ดผลงานวิจัย
const mockResearchData = [
  { id: 1, title: 'ชื่องานวิจัย 1', views: 125, comments: 4 },
  { id: 2, title: 'ชื่องานวิจัย 2', views: 89, comments: 12 },
  { id: 3, title: 'ชื่องานวิจัย 3', views: 201, comments: 7 },
  { id: 4, title: 'ชื่องานวิจัย 4', views: 45, comments: 0 },
  { id: 5, title: 'ชื่องานวิจัย 5', views: 300, comments: 20 },
  { id: 6, title: 'ชื่องานวิจัย 6', views: 52, comments: 3 },
];

// ตัวอย่างคีย์เวิร์ด
const mockKeywords = [
  'ปัญญาประดิษฐ์',
  'การเงินดิจิทัล',
  'เทคโนโลยีชีวภาพ',
  'พลังงานสะอาด',
  'การเกษตรสมัยใหม่',
  'รัฐศาสตร์',
  'ประวัติศาสตร์',
  'การแพทย์',
];

// Component: Research Result Card
const ResearchCard = ({ title, views, comments }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:scale-[1.02] cursor-pointer min-h-[250px] border border-gray-200">
    <h2 className="text-lg font-bold text-gray-800 mb-3 truncate">{title}</h2>
    <div className="flex-grow flex items-center justify-center bg-gray-100 rounded-lg p-4">
      <Image size={64} className="text-gray-400" />
    </div>
    <div className="mt-4 flex justify-between text-sm font-medium text-gray-600">
      <div className="flex items-center space-x-1">
        <Eye size={16} className="text-blue-500" />
        <span>Views: <span className="text-gray-900">{views}</span></span>
      </div>
      <div className="flex items-center space-x-1">
        <MessageSquare size={16} className="text-blue-500" />
        <span>Comments: <span className="text-gray-900">{comments}</span></span>
      </div>
    </div>
  </div>
);

// Component: Keywords Sidebar Block
const KeywordsBlock = () => (
  <div className="bg-blue-600 p-6 rounded-xl shadow-lg border-2 border-blue-700">
    <h3 className="text-xl font-semibold text-white mb-4">คีย์เวิร์ด</h3>
    <div className="grid grid-cols-2 gap-3">
      {mockKeywords.map((keyword, index) => (
        <button
          key={index}
          className="bg-blue-800 text-white text-sm font-medium py-2 px-3 rounded-full hover:bg-blue-700 transition duration-150 shadow-md transform active:scale-95"
          onClick={() => console.log(`Searching for: ${keyword}`)}
        >
          {keyword}
        </button>
      ))}
    </div>
  </div>
);

// Component: Search Filter Sidebar Block
const SearchFilterBlock = ({ searchState, setSearchState, handleSearch }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-gray-700 mb-4">ค้นหาด้วยชื่อ :</h3>
      <input
        type="text"
        name="nameQuery"
        value={searchState.nameQuery}
        onChange={handleInputChange}
        placeholder="กรอกชื่องานวิจัย..."
        className="w-full p-3 mb-5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150 text-gray-800"
      />

      <h3 className="text-md font-semibold text-gray-700 mb-2">คีย์เวิร์ด :</h3>
      <select
        name="keyword"
        value={searchState.keyword}
        onChange={handleInputChange}
        className="w-full p-3 mb-6 border-2 border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:border-blue-500 transition duration-150 cursor-pointer text-gray-800"
      >
        <option value="">-- เลือกคีย์เวิร์ด --</option>
        {mockKeywords.map((k, i) => (
          <option key={i} value={k}>{k}</option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="w-full bg-blue-700 text-white text-lg font-bold py-3 rounded-xl hover:bg-blue-800 transition duration-150 shadow-xl transform active:scale-[0.98]"
      >
        ค้นหา
      </button>
    </div>
  );
};

// Component: Upload Button Block
const UploadButtonBlock = () => (
  <div className="bg-blue-700 p-5 rounded-xl shadow-xl hover:bg-blue-800 transition duration-300 cursor-pointer">
    <div className="flex items-center justify-center">
      <Upload size={24} className="text-white mr-3" />
      <h3 className="text-xl font-bold text-white">อัพโหลดงานวิจัย</h3>
    </div>
  </div>
);

// Component: Navigation Header
const Header = () => (
  <header className="bg-blue-900 text-white shadow-2xl sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold tracking-wider">Siam Archive</h1>
      <nav className="space-x-8">
        <a href="#" className="hover:text-blue-300 transition-colors font-medium">Home</a>
        <a href="#" className="hover:text-blue-300 transition-colors font-medium">Search</a>
        <a href="#" className="hover:text-blue-300 transition-colors font-medium">About</a>
      </nav>
    </div>
  </header>
);

// Main App Component
export default function SearchPage() {
  const [searchState, setSearchState] = useState({
    nameQuery: '',
    keyword: '',
  });

  const handleSearch = () => {
    console.log('Performing Search with:', searchState);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      {/* ใส่ Drawer ไว้ตรงนี้ */}
      <Drawer />

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            <UploadButtonBlock />
            <SearchFilterBlock
              searchState={searchState}
              setSearchState={setSearchState}
              handleSearch={handleSearch}
            />
            <KeywordsBlock />
          </aside>

          {/* Right Column: Search Results Grid */}
          <section className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">ผลลัพธ์การค้นหา</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockResearchData.map((data) => (
                <ResearchCard
                  key={data.id}
                  title={data.title}
                  views={data.views}
                  comments={data.comments}
                />
              ))}

              {/* Placeholders */}
              <div className="bg-gray-200 rounded-xl min-h-[250px] shadow-lg"></div>
              <div className="bg-gray-200 rounded-xl min-h-[250px] shadow-lg hidden sm:block"></div>
              <div className="bg-gray-200 rounded-xl min-h-[250px] shadow-lg"></div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
