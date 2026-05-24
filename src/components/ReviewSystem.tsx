/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { Review } from "../types";
import { Star, MessageSquareCode, Feather, CheckCircle } from "lucide-react";

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Nguyễn Trần Anh",
    role: "K68S-AE2 · Thành viên Gen 5",
    star: 5,
    text: "ACUET là nơi mình học được rất nhiều thứ ngoài giáo trình — từ cách làm việc nhóm, nghiên cứu kỹ thuật đến tinh thần dám thử dám sai. Văn hoá CLB rất lành mạnh và ấm áp.",
    date: "24/05/2026",
  },
  {
    id: "rev-2",
    name: "Lê Minh Hiếu",
    role: "K69S-AE1 · Thành viên Gen 6",
    star: 5,
    text: "Tham gia ACUET là quyết định đúng đắn nhất thời sinh viên. Được làm việc cùng các anh chị và bạn bè có cùng đam mê hàng không, được đi thi UAV Cup — cực kỳ đáng nhớ!",
    date: "12/04/2026",
  },
  {
    id: "rev-3",
    name: "Phạm Thị Lan",
    role: "K69S-AE2 · Thành viên Gen 6",
    star: 4,
    text: "Các buổi workshop rất chất, thầy cô và anh chị hướng dẫn nhiệt tình. Mình ước có thêm nhiều workshop thực hành hơn nữa, nhưng nhìn chung ACUET là CLB rất đáng để tham gia.",
    date: "15/03/2026",
  },
];

export default function ReviewSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [starPick, setStarPick] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("acuet_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem("acuet_reviews", JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 0 || !parts[0]) return "AC";
    const first = parts[0][0] || "";
    const last = parts[parts.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và chia sẻ trải nghiệm!");
      return;
    }

    const newReview: Review = {
      id: "rev-" + Date.now(),
      name: name.trim(),
      role: role.trim() || "Thành viên ACUET",
      star: starPick,
      text: text.trim(),
      date: new Date().toLocaleDateString("vi-VN"),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("acuet_reviews", JSON.stringify(updatedReviews));

    // Reset fields
    setName("");
    setRole("");
    setText("");
    setStarPick(5);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  // Calculations
  const total = reviews.length;
  const avgScore = total ? reviews.reduce((sum, r) => sum + r.star, 0) / total : 0;

  const countByStar = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.star >= 1 && r.star <= 5) {
      countByStar[r.star - 1]++;
    }
  });

  return (
    <div className="reviews-sec border-t border-[#4fb3f6]/10 py-12 px-6" id="danh-gia">
      <div className="flex items-center gap-2 mb-2 font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase">
        <div className="w-[14px] h-[1px] bg-[#f5a623]"></div>
        <span>Cộng đồng sinh viên</span>
      </div>
      <h2 className="font-exo font-extrabold text-3xl md:text-4xl text-[#daeeff] tracking-tight mb-8">
        ĐÁNH GIÁ TỪ THÀNH VIÊN
      </h2>

      <div className="rev-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Summary and Form */}
        <div className="lg:col-span-5 bg-[#060f1e]/80 border border-[#4fb3f6]/10 rounded-xl p-6 backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-exo font-extrabold text-6xl text-white tracking-tighter">
                {avgScore.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-[#7fa8c9] align-bottom">/ 5</span>
            </div>

            {/* Stars rendering */}
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(avgScore);
                return (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      filled ? "fill-[#f5a624] text-[#f5a624]" : "text-[#1a2d40]"
                    }`}
                  />
                );
              })}
            </div>
            <p className="font-mono text-xs text-[#3a6080]">Dựa trên {total} đánh giá</p>
          </div>

          {/* Bar Breakdowns */}
          <div className="space-y-3 mb-6 bd-t border-t border-[#4fb3f6]/5 pt-4">
            {[5, 4, 3, 2, 1].map((s) => {
              const count = countByStar[s - 1];
              const percentage = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-[#3a6080] w-3 text-right font-bold">{s}</span>
                  <div className="flex-1 h-3 bg-[#1a2d40] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f5a623] to-[#fbbf24] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-[#7fa8c9] w-10 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>

          {/* Review form */}
          <form
            onSubmit={handleReviewSubmit}
            className="border-t border-[#4fb3f6]/10 pt-5 space-y-4"
          >
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#4fb3f6]" />
              <span className="font-mono text-[9px] tracking-widest text-[#3a6080] uppercase block">
                Viết Đánh Giá Của Bạn
              </span>
            </div>

            {/* Clickable star picking */}
            <div>
              <label className="text-xs text-[#7fa8c9] mb-1.5 block font-syne">Chọn số sao:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = hoveredStar !== null ? star <= hoveredStar : star <= starPick;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setStarPick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors duration-150 ${
                          active ? "fill-[#fbbf24] text-[#fbbf24]" : "text-[#1a2d40]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên của bạn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#030b1a]/80 text-[#daeeff] font-syne placeholder-[#3a6080] text-xs border border-[#4fb3f6]/10 focus:border-[#4fb3f6]/45 focus:outline-none rounded-lg p-3 transition-colors"
                required
              />

              <input
                type="text"
                placeholder="Khóa / Ban (VD: K69S-AE1 · Ban Kỹ Thuật)..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#030b1a]/80 text-[#daeeff] font-syne placeholder-[#3a6080] text-xs border border-[#4fb3f6]/10 focus:border-[#4fb3f6]/45 focus:outline-none rounded-lg p-3 transition-colors"
              />

              <textarea
                placeholder="Chia sẻ trải nghiệm hành trình của bạn với ACUET..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full bg-[#030b1a]/80 text-[#daeeff] font-syne placeholder-[#3a6080] text-xs border border-[#4fb3f6]/10 focus:border-[#4fb3f6]/45 focus:outline-none rounded-lg p-3 transition-colors resize-none"
                required
              />
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 text-xs animate-fadeIn">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Cảm ơn phản hồi quý giá của bạn cho gia đình ACUET!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#4fb3f6] hover:bg-[#f5a623] text-[#030b1a] font-bold font-syne tracking-wider text-xs rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4" />
              GỬI ĐÁNH GIÁ CHÍNH THỨC
            </button>
          </form>
        </div>

        {/* Right Side: Reviews Feed */}
        <div className="lg:col-span-7 space-y-4 max-h-[640px] overflow-y-auto pr-1">
          {reviews.length === 0 ? (
            <div className="bg-[#060f1e] text-center py-12 rounded-xl border border-[#4fb3f6]/10">
              <p className="text-[#7fa8c9] font-mono text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#060f1e]/60 border border-[#4fb3f6]/8 rounded-xl p-5 hover:border-[#4fb3f6]/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4fb3f6]/10 border border-[#4fb3f6]/20 flex items-center justify-center text-[#4fb3f6] font-exo font-bold text-xs shadow-md">
                      {getInitials(rev.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#daeeff] leading-none mb-1">
                        {rev.name}
                      </h4>
                      <p className="font-mono text-[9px] text-[#3a6080] tracking-wide">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, stIdx) => (
                      <Star
                        key={stIdx}
                        className={`w-3.5 h-3.5 ${
                          stIdx < rev.star ? "fill-[#f5a623] text-[#f5a623]" : "text-[#1a2d40]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#7fa8c9] leading-relaxed font-syne mb-2 pl-1 whitespace-pre-wrap">
                  {rev.text}
                </p>

                <div className="font-mono text-[9px] text-[#3a6080] tracking-wider text-right uppercase">
                  {rev.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
