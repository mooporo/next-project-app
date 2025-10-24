"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import axios from 'axios';
import { useAuth } from "../../auth";

const ChatPage = () => {
  const [message, setMessage] = useState('');
  // สถานะสำหรับเก็บประวัติการสนทนา
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  //เจมส์ : เก็บ param(uuidv4) ที่ส่งจาก action ของปุ่ม "แชทใหม่" ที่อยู่บน Drawer
  const { session_id } = useParams();

  //เจมส์ : เรียกข้อมูล user
  const { user } = useAuth();

  // console.log(messages.length);
  //  console.log(session_id);

  //เจมส์ : เพิ่มโหลดประวัติการสนทนาเมื่อเข้าหน้าจอใหม่
  useEffect(() => {
    // โหลดประวัติการสนทนาเมื่อเปิดหน้าจอ
    const getChatHistoryBySessionId = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_history_tb')
          .select('*')
          .eq('session_id', session_id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat history:', error);
        } else {
          console.log(data);
          setMessages(data);
        }

      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }

    getChatHistoryBySessionId();
  }, [session_id]);

  // เลื่อนเมื่อ messages เปลี่ยน
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // เลื่อนแชทไปด้านล่างสุดเมื่อมีข้อความใหม่
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Component สำหรับแสดง Bubble ข้อความ (🌟 แก้ไขตรงนี้ 🌟)
  const MessageBubble = ({ message }) => {
    // ❌ เดิม: const isUser = message.sender === 'user';
    // ✅ แก้ไข: ใช้ role แทน sender
    const isUser = message.role === 'user';

    // กำหนดรูปแบบตามผู้ส่ง
    const containerClasses = isUser
      ? "flex justify-end mb-4 pr-4 md:pr-8" // จัดชิดขวา
      : "flex justify-start mb-4 pl-4 md:pl-8"; // จัดชิดซ้าย

    const bubbleClasses = isUser
      ? "bg-gray-200 text-gray-800 rounded-xl rounded-tr-none max-w-xs md:max-w-md lg:max-w-xl p-3 shadow-sm" // สีเทาอ่อน, มุมขวาบนเหลี่ยม
      : "bg-white text-gray-800 rounded-xl rounded-tl-none max-w-xs md:max-w-md lg:max-w-xl p-3 shadow-lg border border-gray-100"; // สีขาว, มุมซ้ายบนเหลี่ยม

    return (
      <div className={containerClasses}>
        <div className={bubbleClasses}>
          {/* ❌ เดิม: <p className="...">{message.text}</p> */}
          {/* ✅ แก้ไข: ใช้ content แทน text */}
          <p className="text-base md:text-lg whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  };

  // จัดการการส่งข้อความ
  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('⚠️ กรุณากรอกข้อความ');
      return;
    }

    const currentMessage = message; // เก็บข้อความที่ผู้ใช้ส่งในขณะนั้น

    const userMessage = {
      content: currentMessage,
      role: 'user',
    };

    //เจมส์ : ตรวจสอบว่า messages มี ความยาวมากกว่า 0 หรือไม่ ถ้าใช่ จะสร้าง session ใหม่
    if (Array.isArray(messages) && messages.length === 0) {
      try {
        const { data, error } = await supabase
          .from('chat_session_tb')
          .insert([
            {
              session_id: session_id,
              user_id: user?.user_id,
              session_name: currentMessage
            }
          ]);

        if (error) {
          console.error('Error create new session:', error);
        }else{
          console.log(data);
        }

      } catch (error) {
        console.error('Error create new session:', error);
      }
    }

    // 1. เพิ่มข้อความ User ทันที
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 2. ล้าง input
    setMessage('');

    const formData = new FormData();
    formData.append('session_id', session_id);
    formData.append('role', 'user');
    formData.append('content', currentMessage); // ใช้ currentMessage ที่เก็บไว้

    try {
      const res = await axios.post('http://localhost:5678/webhook/chat', formData);
      console.log(res.data);

      // เพิ่มข้อความที่ตอบกลับมาจาก server
      setMessages((prevMessages) => [...prevMessages, {
        content: res.data,
        role: 'ai'
      }]);
    } catch (error) {
      console.error('Error insert chat history:', error);
      // **เพิ่มข้อความตอบกลับปลอมเมื่อเกิดข้อผิดพลาด** (แนะนำ)
      setMessages((prevMessages) => [...prevMessages, {
        content: "⚠️ ขออภัยครับ ระบบ API เกิดข้อผิดพลาดชั่วคราว โปรดถามอีกครั้ง หรือลองใหม่ในภายหลัง",
        role: 'ai'
      }]);
    }
  };

  // ตรวจสอบว่ามีการสนทนาเกิดขึ้นหรือยัง
  const hasMessages = messages.length > 0;

  // จัดการเมื่อกด Enter ใน textarea (เพื่อส่งข้อความ)
  const handleKeyDown = (e) => {
    // ส่งเมื่อกด Enter โดยที่ไม่มี Shift (คือไม่ต้องการขึ้นบรรทัดใหม่)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
      handleSendMessage();
    }
  };


  // กำหนด layout ของ main content
  const mainContentClasses = hasMessages
    ? "flex-1 flex flex-col justify-between p-0 overflow-y-auto relative"
    : "flex-1 flex flex-col items-center justify-center text-center p-4 overflow-y-auto";

  // กำหนด layout ของ Input Area
  // เมื่อมีข้อความ: ใช้ FIXED BOTTOM เพื่อให้อยู่ด้านล่างเสมอ
  const inputAreaClasses = hasMessages
    ? "w-full px-4 bottom-0 left-0 right-0 flex justify-center z-10 py-4 bg-gray-50 border-t border-gray-200"
    : "w-full max-w-lg lg:max-w-2xl px-4";

  // กำหนดความกว้างของ Input box ภายในคอนเทนเนอร์
  // เมื่อมีข้อความ: ให้กว้างเต็มพื้นที่ตาม max-w-4xl ที่ใช้ใน Chat History
  const inputContainerWidth = hasMessages
    ? "w-full max-w-4xl" // เมื่อมีข้อความ: กว้างเต็มพื้นที่หลัก (max-w-4xl)
    : "w-full max-w-lg lg:max-w-2xl"; // เมื่อไม่มีข้อความ: กว้างตามเดิม

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">


      {/* Main Content Container */}
      <div className="flex-1 flex flex-col">

        {/* Header (ถูกคงไว้) */}
        <header className="p-6 md:p-8 w-full bg-white shadow-md z-20">
          <h1 className="text-xl font-bold text-gray-800 ml-16 md:ml-20">
            Siam Archive
          </h1>
        </header>

        {/* Chat Content / Welcome Screen */}
        <main className={mainContentClasses}>

          {/* ส่วนแสดงข้อความต้อนรับ หรือ ประวัติการสนทนา */}
          {!hasMessages ? (
            // **กรณีไม่มีการสนทนา**
            <div className="flex flex-col items-center justify-center flex-1 w-full p-4">
              {/* ข้อความต้อนรับ */}
              <div className="space-y-3 mb-10 md:mb-16">
                <p className="text-2xl md:text-3xl font-light text-gray-700">
                  ผมคือ AI ผู้ช่วยของ Siam Archive
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
                  คุณต้องการให้ผมช่วยเรื่องใด...?
                </h2>
              </div>

              {/* Input Area เมื่อไม่มีการสนทนา: อยู่ตรงกลาง */}
              <div className={inputAreaClasses}>
                <div className={`relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl ${inputContainerWidth}`}>

                  {/* Input ถูกเปลี่ยนเป็น TEXTAREA */}
                  <textarea
                    rows={1} // เริ่มต้น 1 บรรทัด
                    placeholder="พิมพ์ข้อความที่ต้องการ..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full py-3 pl-6 pr-16 text-lg text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none resize-none overflow-y-hidden min-h-[56px]" // 56px คือความสูงของ input เดิม (py-4 คือ 32px + padding)
                    onKeyDown={handleKeyDown}
                  />

                  {/* Submit Button */}
                  <button
                    aria-label="Send message"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                    onClick={handleSendMessage}
                    disabled={message.trim() === ''}
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
            </div>

          ) : (
            // **กรณีมีการสนทนา**
            <>
              {/* Chat History: มี padding-bottom เพื่อไม่ให้ข้อความสุดท้ายถูก Input Area บัง */}
              <div className="flex-1 w-full max-w-4xl mx-auto pt-4 pb-20 overflow-y-auto">
                {messages.map((msg, index) => (
                  <MessageBubble key={index} message={msg} />
                ))}
                <div ref={chatEndRef} className="h-4" /> {/* ตัวอ้างอิงสำหรับ Scroll */}
              </div>

              {/* Input Area เมื่อมีการสนทนา: FIXED ที่ด้านล่าง */}
              <div className={inputAreaClasses}>
                <div className={`relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl ${inputContainerWidth}`}>

                  {/* Input ถูกเปลี่ยนเป็น TEXTAREA */}
                  <textarea
                    rows={1}
                    placeholder="พิมพ์ข้อความที่ต้องการ..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full py-3 pl-6 pr-16 text-lg text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none resize-none overflow-y-hidden min-h-[56px]"
                    onKeyDown={handleKeyDown}
                  />

                  {/* Submit Button */}
                  {/* ปรับให้ปุ่มอยู่ตรงกลางแนวตั้งเสมอ ไม่ว่า textarea จะขยายขนาดเท่าใด */}
                  <button
                    aria-label="Send message"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                    onClick={handleSendMessage}
                    disabled={message.trim() === ''}
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
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default ChatPage;