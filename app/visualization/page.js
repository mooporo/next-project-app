"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Search, Eye, MessageSquare, Plus, Trash2, ArrowBigDownDash, Clock, PieChart, BarChart3 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth";
import { N8N_TUNNEL_URL } from "../lib/config";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// --- เจมส์ : Mock Data สำหรับ Abstract Visualization (Timeline) ---
// const mockVisualizationData = {
//   Timeline: [
//     { id: 1, title: "กำหนดปัญหาและวัตถุประสงค์", date: "2023-01-15", description: "เริ่มต้นโครงการวิจัย ชี้แจงปัญหาการเน่าเสียของกล้วยไข่" },
//     { id: 2, title: "ออกแบบชุดการทดลองและติดตั้ง", date: "2023-02-01", description: "เตรียมกล้วย, ถ่านไม้, และชุดควบคุมสภาพแวดล้อม" },
//     { id: 3, title: "เริ่มเก็บข้อมูล: ระยะการทดลอง (15 วัน)", date: "2023-02-15", description: "บันทึกข้อมูลการเปลี่ยนแปลงสี, น้ำหนัก, และปริมาณเอทิลีนที่ปล่อยออกมา" },
//     { id: 4, title: "วิเคราะห์ข้อมูลและสรุปผลกระทบ", date: "2023-03-05", description: "เปรียบเทียบผลระหว่างกลุ่มใช้ถ่านกับกลุ่มควบคุม เพื่อยืนยันประสิทธิภาพการชะลอความสุก" },
//     { id: 5, title: "จัดทำรายงานฉบับสมบูรณ์", date: "2023-03-20", description: "สรุปผลการวิจัยและข้อเสนอแนะสำหรับการนำไปใช้ในเชิงพาณิชย์" },
//   ],
//   Pie: [
//     // ข้อมูล Mock สำหรับ Pie Chart (เช่น การแบ่งสัดส่วนทรัพยากร)
//     { label: "แรงงาน", value: 40 },
//     { label: "วัสดุ/สารเคมี", value: 30 },
//     { label: "เวลาวิเคราะห์", value: 30 },
//   ],
//   Bar: [
//     // ข้อมูล Mock สำหรับ Bar Chart (เช่น ผลการวัดค่าความแข็ง)
//     { label: "กลุ่มควบคุม", value: 1.2 },
//     { label: "กลุ่มใช้ถ่าน", value: 3.5 },
//     { label: "กลุ่มใช้สารเคมี", value: 4.8 },
//   ]
// };

// --- Component สำหรับแสดง Timeline ---
const TimelineVisualization = ({ data }) => (
  <div className="relative border-l border-gray-200 ml-4 pl-6">
    {data.map((item, index) => (
      <div key={index} className="mb-8 relative">

        <div className="absolute w-3 h-3 bg-blue-600 rounded-full mt-1.5 -left-4 border border-white"></div>

        <time className="mb-1 text-sm font-normal leading-none text-gray-500">{item.time}</time>
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        <p className="text-base font-normal text-gray-700">{item.description}</p>
      </div>
    ))}
  </div>
);

// --- Component สำหรับแสดง Table ---
const TableVisualization = ({ tableData }) => (
  <div className="mt-8 overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold bg-gray-50 p-4 border-b">{tableData.table_title}</h3>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {tableData.headers.map((header, index) => (
            <th
              key={index}
              className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r last:border-r-0"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tableData.rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 border-r last:border-r-0"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Component สำหรับแสดง Pie Chart
const PieChartVisualization = ({ data, chartTitle }) => {

  const chartLabels = data.labels;
  const chartValues = data.values;

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'สัดส่วน (%)',
        data: chartValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: chartTitle || 'สัดส่วนองค์ประกอบที่วิเคราะห์',
        font: { size: 16 }
      },
      tooltip: {
        // เพิ่มการแสดงผลเปอร์เซ็นต์ใน Tooltip (ถ้าต้องการ)
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(1);
              label += `${value} (${percentage}%)`;
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="w-full md:w-3/4 mx-auto p-4">
      <Pie data={chartData} options={options} />
    </div>
  );
};

// --- Component สำหรับแสดง Bar Chart ---
const BarChartVisualization = ({ data, chartTitle }) => {

  const chartLabels = data.labels;
  const chartValues = data.values;

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'ผลลัพธ์เชิงปริมาณที่วัดได้',
        data: chartValues,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartTitle || 'การเปรียบเทียบผลลัพธ์เชิงปริมาณ',
        font: { size: 16 }
      }
    },
    // การตั้งค่าแกน (Scales) เป็นสิ่งสำคัญสำหรับ Bar Chart
    scales: {
      y: {
        beginAtZero: true, // กำหนดให้แกน Y เริ่มจาก 0 เสมอ
        title: {
          display: true,
          text: 'ค่าที่วัดได้ (หน่วย)', // แสดงชื่อแกน Y
        },
      },
      x: {
        // กำหนดให้แกน X แสดงชื่อ Label
        grid: {
          display: false // ซ่อน Grid lines บนแกน X
        }
      }
    },
  };

  return (
    <div className="w-full mx-auto p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

// --- Component หลักสำหรับการแสดงแผนภาพ ---
const VisualizationComponent = ({ type, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 p-6">ไม่มีข้อมูลสำหรับการแสดงผล</p>;
  }

  const chartData = data.chart_data;
  const timelineData = data.timeline_data;

  switch (type) {
    case 'Timeline':
      return <TimelineVisualization data={timelineData} />;
    case 'Pie':
      return <PieChartVisualization data={chartData} chartTitle={chartData.chart_title} />;
    case 'Bar':
      return <BarChartVisualization data={chartData} chartTitle={chartData.chart_title} />;
    default:
      return <p className="text-center text-gray-500 p-6">กรุณาเลือกประเภทแผนภาพที่ต้องการวิเคราะห์</p>;
  }
};

//เจมส์ : popup สำหรับ search
const ShowSearchPopup = ({ Plus, onSearchChange, currentSearchQuery, onSelectResearch, papers, onPinnedEnabledClick }) => {

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }
    setIsOpen(!isOpen);
    if (isOpen && onSearchChange) {
      onSearchChange("");
    }
  };

  const filteredResults = useMemo(() => {
    if (!papers || !Array.isArray(papers)) {
      return [];
    }

    if (!currentSearchQuery) {
      return papers;
    }

    const query = currentSearchQuery.toLowerCase();
    return papers.filter(paper =>
      paper.paper_title.toLowerCase().includes(query) ||
      (paper.created_at && String(paper.created_at).toLowerCase().includes(query))
    );
  }, [currentSearchQuery, papers]);

  return (
    <div
      className={`
                bg-white border border-gray-300 rounded-2xl w-full mb-4 relative
                shadow-md transition-shadow duration-200 overflow-hidden 
                ${!isOpen ? 'hover:shadow-lg cursor-pointer' : 'shadow-xl'}
            `}
    >

      {/* ส่วนหัว: ใช้คลิกเพื่อ Toggle */}
      <div
        className={`
                    flex flex-row justify-center items-center p-3
                    text-center cursor-pointer 
                    ${isOpen ? 'border-b border-gray-200 hover:bg-gray-50' : 'hover:bg-gray-100/70'}
                `}
        onClick={handleToggle}
      >
        <p className={`text-lg font-medium text-gray-700 mr-2 select-none ${isOpen ? 'text-red-500' : ''}`}>
          {isOpen ? 'ปิดช่องค้นหา' : 'ค้นหาเอกสาร'}
        </p>

      </div>

      {/* ส่วนเนื้อหา: จัดการแอนิเมชัน */}
      <div
        className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${isOpen ? 'max-h-[500px] p-6 pt-4' : 'max-h-0'}
                `}
      >
        {/* 1. Input Search */}
        <div className="flex flex-row items-center justify-center mb-4">
          <input
            type="text"
            placeholder="พิมพ์ชื่อเอกสาร..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={currentSearchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <div className="flex items-center space-x-2 whitespace-nowrap ml-4">

            <span className="text-sm text-gray-700">เอกสารปักหมุด:</span>

            {/* ห่อทุกอย่างด้วย Label เดียว */}
            <label htmlFor="pin-toggle" className="flex items-center space-x-2 cursor-pointer">

              {/* กลไกสวิตช์: ใช้ Checkbox ที่ซ่อนไว้ */}
              <input
                type="checkbox"
                id="pin-toggle"
                className="sr-only peer"
                onClick={onPinnedEnabledClick}
              />

              {/* Visual Switch (ตัวสไลด์) - ส่วนที่คุณคลิกแล้วไม่ทำงาน */}
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

            </label>
          </div>
        </div>

        {/* 2. List ผลลัพธ์ */}
        <div className="max-h-100 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredResults.length > 0 ? (
            filteredResults.map((paper) => (
              <div
                key={paper.paper_id}
                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => {
                  if (onSelectResearch) {
                    onSelectResearch(paper);
                    setIsOpen(false); // ปิด popup หลังจากเลือก
                  }
                }}
              >
                <p className="font-semibold text-gray-800 line-clamp-1">{paper.paper_title}</p>
                <p className="text-sm text-gray-500">ชื่อผู้อัปโหลด: {paper.users.user_fullname}</p>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">
              ไม่พบผลลัพธ์ที่ตรงกับ &quot;{currentSearchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {

  // ... (State เดิม)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isPinnedEnabled, setIsPinnedEnabled] = useState(false);

  //เจมส์ : ค่าของเอกสารสำหรับแสดงให้ผู้ใช้เห็น
  const [papers, setPapers] = useState(null);
  //เจมส์ : เก็บเอกสารที่ถูกปักหมุด
  const [pinPaper, setPinPaper] = useState([]);
  //เจมส์ : เก็บเอกสารที่ไม่ถูกปักหมุด
  const [unpinPaper, setUnpinPaper] = useState([]);

  //เจมส์ : เก็บค่าสำหรับแสดงแผนภาพ
  const [visualizeResult, setVisualizeResult] = useState(null);
  //เจมส์ : เก็บประเภทแผนภาพที่เลือก
  const [selectedChartType, setSelectedChartType] = useState('Timeline');

  const { user } = useAuth();

  const getAllPapers = async () => {
    const { data, error } = await supabase
      .from('paper_tb')
      .select(`
                        *,
                        users:user_id ( 
                            user_fullname,
                            user_email 
                        )
                    `)
      .in('paper_status', [2, 4])
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPinPaper(data);

      if (!papers) {
        setPapers(data);
      }
    }
  }

  const getAllPinnedPapers = async () => {

    if(user?.user_id === null) return;

    const { data, error } = await supabase
      .from('paper_pin_mtb')
      .select(`
                        paper_tb:paper_id ( 
                            *,
                            users:user_id ( 
                                user_fullname,
                                user_email 
                            )
                        )
                    `)
      .eq('user_id', user?.user_id)
      .filter('paper_tb.paper_status', 'in', '(2,4)')
      .order('created_at', { referencedTable: 'paper_tb', ascending: false });

    if (error) {
      console.error("", error);
    } else {
      const cleanData = data.filter(item => item.paper_tb)
        .map(item => ({
          ...item.paper_tb,
        })) || [];

      setUnpinPaper(cleanData);
    }
  }

  //โหลดข้อมูล paper จาก supabase เพื่อส่งเป็น props ไปให้ ShowSearchPopup
  useEffect(() => {
    getAllPapers();
    getAllPinnedPapers();
  }, [user?.user_id]);

  // ... (handlePinnedEnabledClick และ handleSelectResearchClick เดิม)
  const handlePinnedEnabledClick = () => {
    setIsPinnedEnabled(!isPinnedEnabled);

    if (isPinnedEnabled === true) {
      setPapers(pinPaper);
    }
    if (isPinnedEnabled === false) {
      setPapers(unpinPaper);
    }
  };

  const handleSelectResearchClick = (paper) => {
    setSelectedPaper(paper);
    setIsPinnedEnabled(false);
    // Clear previous analysis result when a new paper is selected
    setVisualizeResult(null);
  };

  const handleVisualizeClick = async () => {

    try {
      const res = await axios.get(`${N8N_TUNNEL_URL}/webhook/8c1db8bc-42a9-4a9c-8a68-82546d1c3254/visualize/${selectedPaper.paper_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      console.log(res.data.output);
      setVisualizeResult(res.data.output);

      // ใช้ Mock Data สำหรับ Timeline ไปก่อน
      // setVisualizeResult(mockVisualizationData);

    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการสร้างแผนภาพ" + error);
    }

  };

  const handleChartTypeChange = (type) => {
    setSelectedChartType(type);
  }

  return (
    // หน้าวิเคราะห์บทคัดย่อ
    <div className="flex flex-col items-center">
      <div className="container min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 mt-20">
          สร้างแผนภาพ
        </h1>
        <p className="mb-5 text-gray-600">
          เลือกเอกสารที่คุณสนใจเพื่อวิเคราะห์แล้วนำมาสร้างแผนภาพออกมาในรูปแบบต่างๆ
        </p>

        {selectedPaper === null ? (
          <div className="bg-white border rounded-2xl w-full md:w-[800px] p-6 flex flex-col justify-center items-center text-center shadow-sm">

            <ShowSearchPopup
              Plus={Plus}
              papers={papers}
              currentSearchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectResearch={handleSelectResearchClick}
              onPinnedEnabledClick={handlePinnedEnabledClick}
            />

            <p className="text-gray-700 font-medium mb-2">
              เลือกเอกสารเพื่อวิเคราะห์
            </p>
            <p className="text-sm text-gray-500 mb-4">
              คลิกเพื่อค้นหาและเพิ่มเอกสารที่ต้องการวิเคราะห์
            </p>
          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-md w-full md:w-[800px] p-6 relative border border-gray-100 flex flex-col">
            {/* ปุ่มปิด (Close Button) - ตำแหน่ง Absolute */}
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 z-10"
              aria-label="ปิดรายละเอียดเอกสาร"
            >
              <Trash2 className="h-6 w-6" />
            </button>

            {/* ปก */}
            <div className="bg-blue-500 text-white h-60 rounded-xl flex items-center justify-center text-xl font-semibold mb-4 overflow-hidden">
              {selectedPaper.paper_image ? (
                <img
                  src={selectedPaper.paper_image}
                  alt={selectedPaper.paper_title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <p>{selectedPaper.paper_title}</p>
              )}
            </div>

            {/* ชื่อเรื่อง */}
            <h2 className="text-lg font-semibold leading-snug">
              <a
                href={`/research/${selectedPaper.paper_id}`}
                target="_blank"
                className="text-gray-900 hover:text-blue-600 hover:underline cursor-pointer inline"
              >
                {selectedPaper.paper_title}
              </a>
            </h2>

            {/* ผู้เขียน */}
            <p className="text-sm text-gray-600 mt-1">
              ผู้แต่ง: {selectedPaper.paper_authors}
            </p>

            {/* ผู้อัปโหลด */}
            <p className="text-sm text-gray-600 mt-1 mb-3">
              ผู้อัปโหลด: {selectedPaper.users.user_fullname}
            </p>

            {/* บทคัดย่อ */}
            <div className="border-t border-gray-200 pt-3 mb-3 flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">บทคัดย่อ</h3>
              <p className="text-sm text-gray-600 leading-loose line-clamp-5">
                {selectedPaper.paper_abstract}
              </p>
            </div>

            {/* ปุ่มวิเคราะห์ */}
            <div className="border-t border-gray-200 pt-3 flex-1">
              <button
                onClick={handleVisualizeClick}
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 cursor-pointer transition mt-auto">
                เริ่มสร้างแผนภาพ 🔬
              </button>
            </div>
          </div>

        )}

        <div className="flex flex-col gap-2 mt-5 mb-5">
          <ArrowBigDownDash className="text-gray-500" />
          <ArrowBigDownDash className="text-gray-500" />
          <ArrowBigDownDash className="text-gray-500" />
        </div>

        {/* --- ส่วนแสดงผลการวิเคราะห์ --- */}
        {visualizeResult === null ? (
          <div className="bg-white border-2 border-dashed border-gray-500 rounded-2xl w-full md:w-[800px] p-6 flex flex-col justify-center items-center text-center shadow-sm mb-20">
            <h1 className="text-gray-500 text-xl mb-2">รอการวิเคราะห์</h1>
            <p className="text-gray-500">แผนภาพการวิเคราะห์จะแสดงเมื่อประมวลผลเสร็จสิ้น...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md w-full md:w-[800px] p-6 relative border border-gray-100 flex flex-col mb-20">

            {/* ✅ แสดงหัวข้อสรุปจาก summary_title */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              {visualizeResult.summary_title}
            </h2>

            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              ผลการวิเคราะห์โครงสร้างบทคัดย่อ
            </h3>

            {/* 1. ปุ่มเลือกประเภทแผนภาพ */}
            <div className="flex space-x-4 mb-6 justify-center border-b border-gray-100 pb-4">
              <button
                onClick={() => handleChartTypeChange('Timeline')}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-colors 
                            ${selectedChartType === 'Timeline' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Clock size={20} /> Timeline
              </button>
              <button
                onClick={() => handleChartTypeChange('Pie')}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-colors 
                            ${selectedChartType === 'Pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <PieChart size={20} /> Pie Chart
              </button>
              <button
                onClick={() => handleChartTypeChange('Bar')}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-colors 
                            ${selectedChartType === 'Bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart3 size={20} /> Bar Chart
              </button>
            </div>

            {/* 2. แสดงผลแผนภาพตามที่เลือก */}
            <VisualizationComponent
              type={selectedChartType}
              data={visualizeResult}
            />

            {/* 3. ✅ แสดงตารางข้อมูล */}
            {visualizeResult.table_data && <TableVisualization tableData={visualizeResult.table_data} />}

          </div>
        )}

      </div>
    </div >
  );
}