"use client";

import React, { useState } from 'react';
import Drawer from '../components/Drawer'; // ✅ ตัวใหญ่ตรงกับชื่อไฟล์

const ChatPage = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    console.log('Sending message:', message);
    setMessage(''); // ล้างข้อความหลังส่ง
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar Drawer */}
      <Drawer />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="p-6 md:p-8 w-full bg-white shadow-md">
          <h1 className="text-xl font-bold text-gray-800 ml-16 md:ml-20">
            Siam Archive
          </h1>
        </header>

        {/* Chat Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4 overflow-y-auto">
          
          {/* ข้อความต้อนรับ */}
          <div className="space-y-3 mb-10 md:mb-16">
            <p className="text-2xl md:text-3xl font-light text-gray-700">
              ผมคือ AI ผู้ช่วยของ Siam Archive
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
              คุณต้องการให้ผมช่วยเรื่องใด...?
            </h2>
          </div>

          {/* Input Area */}
          <div className="w-full max-w-lg lg:max-w-2xl px-4">
            <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl">
              
              {/* Input */}
              <input
                type="text"
                placeholder="พิมพ์ข้อความที่ต้องการ..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full py-4 pl-6 pr-16 text-lg text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              
              {/* Submit Button */}
              <button
                aria-label="Send message"
                className="absolute right-3 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleSendMessage}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  className="w-5 h-5 -rotate-45"
                >
                  <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-16"></footer>
      </div>
    </div>
  );
};

export default ChatPage;
