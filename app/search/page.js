"use client";

import React, { useState } from 'react';

// Component สำหรับ Header
const Header = () => (
  <header className="bg-blue-800 text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
      <div className="text-2xl font-bold tracking-wider mr-10">Siam Archive</div>
      <nav className="flex space-x-6 text-sm font-medium">
        <a href="#" className="hover:text-gray-300">Home</a>
        <a href="#" className="hover:text-gray-300">Search</a>
        <a href="#" className="hover:text-gray-300">Model</a>
      </nav>
    </div>
  </header>
);

// Component สำหรับปุ่มคีย์เวิร์ด
const KeywordButton = ({ keyword }) => (
  <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-150 shadow-md">
    {keyword}
  </button>
);

// Sidebar
const Sidebar = () => {
  const keywordButtons = ['คีย์เวิร์ด 1', 'คีย์เวิร์ด 2', 'คีย์เวิร์ด 3', 'คีย์เวิร์ด 4', 'คีย์เวิร์ด 5', 'คีย์เวิร์ด 6', 'คีย์เวิร์ด 7', 'คีย์เวิร์ด 8'];

  return (
    <div className="space-y-6 p-4">
      <div className="bg-blue-700 p-4 rounded-2xl shadow-xl text-white text-xl font-bold text-center cursor-pointer hover:bg-blue-800 transition duration-200">
        อัพโหลดงานวิจัย
      </div>

      {/* กรอบครอบส่วนค้นหา */}
      <div className="p-4 rounded-2xl shadow-xl" style={{ backgroundColor: '#252222' }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="searchTitle" className="text-white block mb-2 font-medium">ค้นหาด้วยชื่อ:</label>
            <input 
              id="searchTitle"
              type="text" 
              className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-white text-black placeholder-gray-400"
              placeholder="กรอกชื่อวิจัยที่นี่..."
            />
          </div>

          <div>
            <label htmlFor="searchKeyword" className="text-white block mb-2 font-medium">คีย์เวิร์ด:</label>
            <div className="relative">
              <select 
                id="searchKeyword"
                className="w-full p-3 rounded-xl border-none appearance-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-white text-black pr-10"
              >
                <option value="">เลือกคีย์เวิร์ด...</option>
                <option value="tech">เทคโนโลยี</option>
                <option value="science">วิทยาศาสตร์</option>
                <option value="art">ศิลปะ</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-lg transition duration-150 shadow-lg mt-6">
            ค้นหา
          </button>
        </div>
      </div>

      {/* กรอบครอบคีย์เวิร์ด */}
      <div className="p-4 rounded-2xl shadow-xl" style={{ backgroundColor: '#252222' }}>
        {/* หัวข้อพื้นหลังฟ้า ขยับตรงกลาง */}
        <h3 className="text-xl font-bold text-white mb-4 p-2 rounded-xl text-center" style={{ backgroundColor: '#1E40AF' }}>
          คีย์เวิร์ด
        </h3>
        <div className="grid grid-cols-2 gap-3 p-3">
          {keywordButtons.map((k, index) => (
            <KeywordButton key={index} keyword={k} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Research Card
const ResearchCard = ({ title, views, comments }) => (
  <div className="bg-white rounded-2xl shadow-xl p-4 transition duration-300 hover:shadow-2xl space-y-3 h-full">
    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{title}</h3>
    
    <div className="flex items-center justify-center bg-gray-200 h-32 w-full rounded-xl">
      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4.5-4.5 2.5 2.5 4-4V15z" clipRule="evenodd" />
      </svg>
    </div>
    
    <div className="flex justify-between text-sm text-gray-600 mt-3">
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
        Views: <span className="ml-1 font-semibold">{views}</span>
      </div>
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.893-1.341L2 18l1.341-2.893A8.841 8.841 0 0110 3c4.418 0 8 3.134 8 7zM7 9H5V7h2v2zm4 0H9V7h2v2zm4 0h-2V7h2v2z" clipRule="evenodd" /></svg>
        Comments: <span className="ml-1 font-semibold">{comments}</span>
      </div>
    </div>
  </div>
);

// หน้า SearchPage
const SearchPage = () => {
  const researchResults = [
    { title: 'ชื่องานวิจัย 1', views: '1,234', comments: '56' },
    { title: 'ชื่องานวิจัย 2', views: '987', comments: '12' },
    { title: 'ชื่องานวิจัย 3', views: '550', comments: '8' },
    { title: 'ชื่องานวิจัย 4', views: '3,210', comments: '150' },
    { title: 'ชื่องานวิจัย 5', views: '1,500', comments: '22' },
    { title: 'ชื่องานวิจัย 6', views: '789', comments: '3' },
    { title: 'ชื่องานวิจัย 7', views: '1,111', comments: '45' },
    { title: 'ชื่องานวิจัย 8', views: '2,400', comments: '99' },
  ];

  return (
    <div className="min-h-screen font-inter bg-[url('/background.png')] bg-cover bg-center">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-grow">
            <h2 className="text-3xl font-extrabold text-white mb-6">ผลการค้นหา</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {researchResults.map((item, index) => (
                <ResearchCard 
                  key={index} 
                  title={item.title} 
                  views={item.views} 
                  comments={item.comments} 
                />
              ))}
              <div className="bg-gray-700/50 rounded-2xl shadow-xl h-64 hidden xl:block"></div>
              <div className="bg-gray-700/50 rounded-2xl shadow-xl h-64 hidden xl:block md:block"></div>
              <div className="bg-gray-700/50 rounded-2xl shadow-xl h-64 hidden xl:block"></div>
              <div className="bg-gray-700/50 rounded-2xl shadow-xl h-64 hidden xl:block md:block"></div>
            </div>
          </div>
        </div>
      </main>
      <div className="h-16"></div>
    </div>
  );
};

export default SearchPage;
