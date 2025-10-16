import React from 'react';
// โค้ดนี้ถูกปรับปรุงเพื่อให้เป็นไปตาม UI ใหม่ที่มี Navbar และ Hero Section

// ส่วน Navbar (จำลอง)
const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      
      {/* โลโก้/ชื่อโปรเจกต์ */}
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-blue-600">Siam Archive</h1>
        {/* เมนูนำทางหลัก (ซ่อนบนมือถือ) */}
        <nav className="hidden md:flex space-x-8 text-gray-700 text-sm font-medium">
          <a href="#" className="hover:text-blue-600 transition duration-150">Home</a>
          <a href="#" className="hover:text-blue-600 transition duration-150">Search</a>
          <a href="#" className="hover:text-blue-600 transition duration-150">Model</a>
        </nav>
      </div>
      
      {/* ปุ่ม Login/Register */}
      <div className="space-x-3">
        {/* ปุ่ม Login ใช้การนำทางไปยังหน้า /login ที่สร้างไว้ก่อนหน้า */}
        <a 
          href="/login" 
          className="px-4 py-1.5 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition duration-150 shadow-sm"
        >
          Login
        </a>
        <a 
          href="/register" 
          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
        >
          Register
        </a>
      </div>
    </div>
  </header>
);

// ส่วน Hero Section
const HeroSection = () => (
  <section className="relative pt-24 pb-12 overflow-hidden bg-gray-50">
    {/* Background Shape/Effect: จำลองพื้นหลังสีน้ำเงินเข้มที่มีลวดลาย */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#111827]">
      {/* เพิ่ม effect ลวดลายทางเรขาคณิตจางๆ */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0 0h100v100H0z" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23p)"/></svg>')` }}></div>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between z-10">
      
      {/* คอลัมน์ซ้าย: ข้อความและปุ่ม */}
      <div className="md:w-1/2 text-left py-12 md:py-24">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          ยินดีต้อนรับสู่ Siam Archive
        </h2>
        <p className="text-xl text-blue-200 mb-6">
          สถานที่สำหรับการค้นหางานวิจัย
        </p>
        <ul className="text-lg text-blue-100 space-y-2 mb-8 list-none">
          <li className="flex items-center">
            <span className="text-xl mr-2 text-white">‹</span>
            ค้นหา อัปโหลด ศึกษา และสร้างชุมชนงานวิจัย
          </li>
        </ul>
        
        {/* ปุ่ม Get Start */}
        <a
          href="#"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 shadow-xl transition duration-300 transform hover:scale-105"
        >
          Get Start
        </a>
      </div>

      {/* คอลัมน์ขวา: รูปภาพประกอบ (ใช้ Placeholder ที่มีธีม) */}
      <div className="md:w-1/2 flex justify-center p-8">
        <div 
          className="w-[350px] h-[350px] rounded-2xl shadow-2xl bg-white/10 flex items-center justify-center p-4 border border-white/20"
          style={{ backgroundImage: `url(https://placehold.co/400x400/0F2B5B/F0F3FF?text=งานวิจัย+RESEARCH&font=Inter)`, backgroundSize: 'cover' }}
        >
          {/* แทนที่ด้วยไอคอนงานวิจัยถ้ามี */}
          <span className="text-4xl text-white font-bold backdrop-blur-sm p-2 rounded-lg">RESEARCH</span>
        </div>
      </div>
      
    </div>
  </section>
);

// ส่วน Feature/Description (จำลองส่วนข้อความด้านล่าง)
const DescriptionSection = () => (
  <section className="py-16 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        แพลตฟอร์มของเราออกแบบมาเพื่อจัดเก็บและบริหารจัดการงานวิจัยอย่างมีประสิทธิภาพ
        ด้วยระบบที่ใช้งานง่าย คุณสามารถจัดการและเข้าถึงงานวิจัยได้สะดวก
        พร้อมรองรับการแสดงผลที่ตอบสนองต่อทุกอุปกรณ์
      </p>
      
      {/* ปุ่มเริ่มต้น (Start Button) */}
      <a
        href="#"
        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition duration-300 transform hover:scale-105"
      >
        เริ่มต้นไหม?
      </a>
    </div>
  </section>
);


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Description Section */}
      <DescriptionSection />

      {/* ลบ ArchiveIcon และโค้ดเก่าที่ไม่เกี่ยวข้องออก */}

    </div>
  );
};

export default HomePage;
