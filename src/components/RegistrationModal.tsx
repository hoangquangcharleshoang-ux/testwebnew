/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState } from "react";
import { X, Send, Rocket, CheckCircle, Orbit } from "lucide-react";

interface RegistrationModalProps {
  onClose: () => void;
}

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [field, setField] = useState("UAV & Drone Systems");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim() || !email.trim()) {
      alert("Vui lòng điện đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#030b1a]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#060f1e] border border-[#f5a623]/35 rounded-xl w-full max-w-lg p-6 relative shadow-2xl overflow-hidden">
        {/* Animated Background Ring */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-[#f5a623]/5 flex items-center justify-center animate-spin">
          <div className="w-24 h-24 rounded-full border border-dashed border-[#f5a623]/10" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7fa8c9] hover:text-white transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>
            <h3 className="font-exo font-extrabold text-2xl text-white mb-2">ĐĂNG KÝ THÀNH CÔNG!</h3>
            <p className="text-sm text-[#7fa8c9] max-w-sm mx-auto leading-relaxed">
              Hồ sơ đăng ký gia nhập hàng ngũ <span className="text-[#4fb3f6] font-bold">GEN 7 [2026]</span> của bạn đã được gửi thành công. Ban Chủ Nhiệm sẽ liên hệ sớm nhất qua địa chỉ email: <strong className="text-[#daeeff] font-mono">{email}</strong>.
            </p>
            <p className="text-xs text-[#f5a623] mt-6 font-mono tracking-wider">
              HÃY CHUẨN BỊ CHO CHUYẾN BAY TIẾP THEO!
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#4fb3f6] hover:bg-[#f5a623] text-slate-950 text-xs font-bold font-syne rounded-lg transition-colors"
            >
              Trở về trang chủ
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 border border-[#f5a623]/30 flex items-center justify-center text-[#f5a623]">
                <Rocket className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-exo font-black text-xl text-white uppercase tracking-tight">GIA NHẬP ACUET</h3>
                <p className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase">REGISTRATION FORM · GEN 7 (2026)</p>
              </div>
            </div>

            <p className="text-xs text-[#7fa8c9] leading-relaxed mb-5 font-syne">
              Không cần có kinh nghiệm hàng không vũ trụ từ đầu — Ban chuyên môn sẽ trang bị đầy đủ kiến thức qua chuỗi Academy định kỳ. Hãy điền đơn và sẵn sàng phát huy sức sáng tạo!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Hoàng Minh Quang"
                    className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] placeholder-[#3a6080] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                    Mã Sinh Viên (MSSV) *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="VD: 24020000"
                    className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] placeholder-[#3a6080] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                    Lớp & Khoa học *
                  </label>
                  <input
                    type="text"
                    required
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="VD: K70S-AE1 (Hàng Không Vũ Trụ)"
                    className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] placeholder-[#3a6080] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                    Email Sinh Viên *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: quantum@vnu.edu.vn"
                    className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] placeholder-[#3a6080] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                  Định hướng chuyên môn mong muốn
                </label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                >
                  <option value="UAV & Drone Systems">Ban Kỹ thuật - UAV & Thiết bị bay không người lái</option>
                  <option value="Aero-Dynamics & Physics">Ban Kỹ thuật - Khí động học & Cấu trúc Mô hình</option>
                  <option value="Astrophysics & Space exploration">Ban Học thuật - Vũ trụ & Thiên văn học</option>
                  <option value="Media & Event logistics">Ban Truyền thông & Sự kiện</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1">
                  Lý do bạn lựa chọn tham gia ACUET?
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Chia sẻ lý do hoặc sở thích đặc biệt liên quan đến không gian của bạn..."
                  rows={3}
                  className="w-full bg-[#030b1a] border border-[#7fa8c9]/20 text-[#daeeff] placeholder-[#3a6080] text-xs rounded-lg p-3 focus:outline-none focus:border-[#f5a623]/50 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#f5a623] hover:bg-[#fbbf24] text-slate-950 font-extrabold font-syne text-xs rounded-lg transition-all flex items-center justify-center gap-2 tracking-wider focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Orbit className="w-4 h-4 animate-spin text-slate-950" />
                      ĐANG XỬ LÝ HỒ SƠ...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      PHÓNG HỒ SƠ ĐĂNG KÝ
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
