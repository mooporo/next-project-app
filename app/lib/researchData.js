// app/lib/researchData.js
import { supabase } from "./supabaseClient";

/**
 * fetchResearchData(limit)
 * - ดึงข้อมูลจาก paper_tb (เฉพาะ paper_status = 2)
 * - join ชื่อผู้ใช้จาก user_tb (user_fullname)
 * - ดึงข้อมูลคอมเมนต์ทั้งหมดเพื่อคำนวณจำนวนคอมเมนต์ต่อ paper_id
 * - แม็ปให้เป็น array ของ object: { id, color, title, author, date, views, comments }
 *
 * ปรับชื่อฟิลด์หากฐานข้อมูลของคุณใช้ชื่ออื่น (แต่ตามที่คุณให้มาคือ paper_tb, user_tb, paper_comment_mtb)
 */
export async function fetchResearchData(limit = 3) {
  try {
    // 1) ดึง papers พร้อม user (user_fullname)
    const { data: papers, error: papersError } = await supabase
      .from("paper_tb")
      .select(`
        paper_id,
        user_id,
        paper_title,
        paper_image,
        paper_views,
        created_at,
        user_tb:user_id ( user_fullname ),
        paper_status
      `)
      .eq("paper_status", 2) // เฉพาะที่อนุมัติแล้ว
      .order("created_at", { ascending: false })
      .limit(limit);

    if (papersError) {
      console.error("fetchResearchData - papers error:", papersError);
      return [];
    }

    // 2) ดึงคอมเมนต์ทั้งหมด (เพื่อคำนวณ count per paper_id)
    const { data: commentsData, error: commentsError } = await supabase
      .from("paper_comment_mtb")
      .select("paper_id, comment_id");

    if (commentsError) {
      console.error("fetchResearchData - comments error:", commentsError);
    }

    // สร้าง map ของจำนวนคอมเมนต์ต่อ paper_id (ใช้ string key)
    const commentCountMap = {};
    (commentsData || []).forEach((c) => {
      const pid = String(c.paper_id).trim();
      commentCountMap[pid] = (commentCountMap[pid] || 0) + 1;
    });

    // 3) แม็ปข้อมูลให้เข้ากับ ResearchItem
    const result = (papers || []).map((paper, index) => {
      const paperIdStr = String(paper.paper_id).trim();
      const createdAt = paper.created_at ? new Date(paper.created_at) : null;
      const dateLabel = createdAt
        ? createdAt.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })
        : "-";

      // กำหนดสีแบบวน (เหมือนใน UI ของคุณ)
      const colors = ["bg-blue-600", "bg-green-500", "bg-purple-600", "bg-indigo-600", "bg-teal-600"];
      const color = colors[index % colors.length];

      return {
        id: paperIdStr,
        color,
        title: paper.paper_title || "ไม่มีชื่อเรื่อง",
        author: paper.user_tb?.user_fullname || "ไม่ระบุชื่อ",
        date: dateLabel,
        views: Number(paper.paper_views || 0).toLocaleString("th-TH"),
        comments: String(commentCountMap[paperIdStr] || 0),
      };
    });

    return result;
  } catch (err) {
    console.error("fetchResearchData caught:", err);
    return [];
  }
}
