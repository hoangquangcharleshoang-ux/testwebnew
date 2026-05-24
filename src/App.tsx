/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Compass,
  Globe,
  Award,
  Users,
  Terminal,
  BookOpen,
  Drone,
  Telescope,
  ArrowRight,
  Send,
  Sparkles,
  Play,
  Facebook,
  ExternalLink,
  Info,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Gift,
  Copy,
  Check,
  UserCheck,
  X
} from "lucide-react";

import StarfieldBackground from "./components/StarfieldBackground";
import ReviewSystem from "./components/ReviewSystem";
import RegistrationModal from "./components/RegistrationModal";
import AerospaceQuiz from "./components/AerospaceQuiz";
import InteractiveCosmos from "./components/InteractiveCosmos";
import { Member, Activity, BentoItem } from "./types";

// Constant Data for Departments/Bento
const BENTO_DETAILS: Record<string, { title: string; subtitle: string; core: string; details: string[]; projects: string[] }> = {
  "01": {
    title: "Học thuật & Nghiên cứu",
    subtitle: "Nắm vững lý thuyết hàng không",
    core: "Tổ chức các buổi seminar, chuyên đề toán cơ học bay, khí động học cơ bản và cấu trúc cơ khí hàng không.",
    details: [
      "Seminar vật lý chuyển động khí quyển và lực nâng cơ bản.",
      "Workshop thiết kế vỏ cánh khí động dòng chảy tầng.",
      "Nghiên cứu cơ bản thuật toán ổn định quỹ đạo bay.",
      "Chuỗi bài giảng cơ bản về cơ học bay & vũ trụ học bán chuyên."
    ],
    projects: ["Aerodynamics Lab", "Basic Rocket Mechanics Handbook"]
  },
  "02": {
    title: "Dự án Kỹ thuật UAV",
    subtitle: "Từ bản vẽ ảo đến cánh bay thật",
    core: "Trực tiếp chế tạo, can thiệp mạch điều khiển bay và tối ưu cấu trúc cơ khí máy bay mô hình cũng như flycam tự chế.",
    details: [
      "Tối ưu thiết kế khung drone Quadcopter in 3D chịu lực.",
      "Lập trình firmware điều khiển bay PX4/ArduPilot.",
      "Thiết lập mạng truyền hình ảnh không dây thời gian thực.",
      "Nghiên cứu cánh bằng mô hình (Fixed Wing) lượn tự do."
    ],
    projects: ["Quadcopter Gen 7 Core", "Fixed-Wing Glider Scout", "FC Firmware Customization"]
  },
  "03": {
    title: "Cộng đồng & Trải nghiệm",
    subtitle: "Kết nối đam mê, kiến tạo hành trình",
    core: "Kênh cầu nối kết nối cựu thành viên đã ra trường, các bạn sinh viên mới khóa K70 đam mê kỹ thuật cơ điện tử và không gian.",
    details: [
      "Trại hè khoa học kết hợp biểu diễn bay UAV thực địa.",
      "Offline giao lưu cựu thành viên đang làm việc tại VAST, Viettel Aerospace.",
      "Hoạt động ngoại khóa Teambuilding hướng nghiệp hàng không.",
      "Tổ chức các sân chơi nội bộ thiết kế máy bay giấy tầm xa."
    ],
    projects: ["Space Camp 2025", "Aerospace Career Talk", "UET Freshman Welcome Day"]
  },
  "04": {
    title: "Không gian & Thiên văn",
    subtitle: "Vươn tầm mắt đón nhận vẻ đẹp vũ trụ",
    core: "Thực hành lắp ráp, căn chỉnh kính thiên văn cơ học để quan sát các hiện tượng thiên văn kỳ thú ngoài khí quyển.",
    details: [
      "Quan sát nhật thực, nguyệt thực bằng kính thiên văn phản xạ.",
      "Học thảo luận bản đồ sao cổ điển và cơ bản chụp ảnh thiên văn (Astrophotography).",
      "Xác định tọa độ chòm sao mùa hè và đo đạc biểu kiến.",
      "Nội san kiến thức vật lý vũ trụ học đại cương hàng tháng."
    ],
    projects: ["Moon Observation 2026", "Astrophotography Showcase", "Starlight Library"]
  }
};

const BCN_MEMBERS: Member[] = [
  {
    name: "Hoàng Minh Quang",
    role: "Chủ nhiệm CLB",
    classCode: "K69S-AE2",
    initials: "HQ",
    bio: "Đam mê lập trình hệ thống bay nhúng nhúng và cơ học chất lỏng. Đại diện ban kỹ thuật chính của dự án bay UAV lượn lọt top 8 PV GAS.",
    specialty: "Lập trình nhúng (Pixhawk / STM32), Thiết kế mô hình 3D SolidWorks.",
    achievements: ["Top 8 UAV Cup PV GAS 2025", "Học bổng KKHT UET 2 kỳ liên tiếp"]
  },
  {
    name: "Dương Khôi Nguyên",
    role: "Phó Chủ nhiệm",
    classCode: "K68I-IT1",
    initials: "DN",
    bio: "Chuyên môn phát triển ứng dụng di động điều khiển luồng telemetry từ thiết bị mặt đất lên trạm GCS.",
    specialty: "Phát triển Web/App, IoT Telemetry, Giao thức Mavlink.",
    achievements: ["Nghiên cứu thuật toán điều khiển GCS", "Giải nhì UET Hackathon"]
  },
  {
    name: "Lê Thị Kim Ánh",
    role: "Phó Chủ nhiệm",
    classCode: "K69S-AE1",
    initials: "KA",
    bio: "Quản trị nhân lực tài năng, thiết kế chiến dịch truyền thông giúp nâng tầm nhận diện thương hiệu ACUET tại ĐHQGHN.",
    specialty: "Quản trị dự án, Lên kế hoạch sự kiện, PR & Content Creation.",
    achievements: ["Trưởng ban nội dung Ngày hội K70", "Excellent Leader Award 2025"]
  }
];

// Interactive count-up hook
function useCountUp(target: number, duration: number = 2000, trigger: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.min(Math.abs(Math.floor(totalMiliseconds / end)), 50);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

export default function App() {
  // Modal configurations
  const [regOpen, setRegOpen] = useState(false);
  const [cosmosFullScreenOpen, setCosmosFullScreenOpen] = useState(false);
  const [wordleOpen, setWordleOpen] = useState(false);
  const [activeBentoId, setActiveBentoId] = useState<string | null>(null);
  const [activeLeader, setActiveLeader] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState("trangchu");

  // Stats Counters trigger
  const [statsTrigger, setStatsTrigger] = useState(false);
  useEffect(() => {
    // trigger animation immediately on mount
    setStatsTrigger(true);
  }, []);

  const countMembers = useCountUp(120, 1500, statsTrigger);
  const countYears = useCountUp(6, 1200, statsTrigger);
  const countProjects = useCountUp(18, 1400, statsTrigger);
  const countUavRank = useCountUp(8, 1000, statsTrigger);

  // Suggestion/Góp ý Box State
  const [gopYName, setGopYName] = useState("");
  const [gopYContent, setGopYContent] = useState("");
  const [gopYSuccess, setGopYSuccess] = useState(false);
  
  const handleGopYSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gopYContent.trim()) return;
    setGopYSuccess(true);
    setGopYName("");
    setGopYContent("");
    setTimeout(() => {
      setGopYSuccess(false);
    }, 4000);
  };

  // Nav scroll handler helper
  const navigateTo = (sectionId: string, tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page min-h-screen text-[#daeeff] overflow-x-hidden font-syne select-none">
      {/* Stars Background */}
      <StarfieldBackground />

      {/* Floating Nebula Layers */}
      <div className="nebula absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="nb1 absolute w-[700px] h-[500px] rounded-full opacity-[0.16] top-[-100px] left-[-150px] bg-[radial-gradient(ellipse,rgba(26,74,138,0.5)_0%,transparent_65%)] nb1-anim" />
        <div className="nb2 absolute w-[500px] h-[400px] rounded-full opacity-[0.12] top-[150px] right-[-80px] bg-[radial-gradient(ellipse,rgba(109,40,217,0.45)_0%,transparent_65%)] nb2-anim" />
        <div className="nb3 absolute w-[600px] h-[300px] rounded-full opacity-[0.11] bottom-[200px] left-[30%] bg-[radial-gradient(ellipse,rgba(14,74,122,0.4)_0%,transparent_70%)] nb3-anim" />
      </div>

      {/* FIXED BACKGROUND ACCENT */}
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[65%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav id="header-nav" className="nav relative z-30 flex items-center justify-between px-6 md:px-8 h-[64px] border-b border-[#4fb3f6]/10 bg-[#030b1a]/85 backdrop-blur-md">
        <div className="logo-a flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="logo-badge w-9 h-9 rounded-lg bg-[#4fb3f6]/7 border border-[#4fb3f6]/25 flex items-center justify-center shadow-lg shadow-[#4fb3f6]/5">
            <div className="logo-ring w-[19px] h-[19px] rounded-full border-1.5 border-[#4fb3f6] flex items-center justify-center animate-spin [animation-duration:8s]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
            </div>
          </div>
          <div className="logo-txt">
            <div className="logo-n font-exo font-extrabold text-[18px] tracking-[2px] text-[#daeeff] leading-none mb-0.5">ACUET</div>
            <div className="logo-s font-mono text-[8px] text-[#3a6080] tracking-[1.5px] uppercase">Aerospace · UET · VNU</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="nav-links hidden md:flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-lg border border-[#4fb3f6]/5">
          <button
            onClick={() => navigateTo("page", "trangchu")}
            className={`text-xs tracking-wide px-3.5 py-1.5 rounded transition-all font-medium ${
              activeTab === "trangchu" ? "bg-[#4fb3f6]/10 text-[#4fb3f6] shadow-sm font-bold" : "text-[#7fa8c9] hover:text-white"
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => navigateTo("gioi-thieu", "gioithieu")}
            className={`text-xs tracking-wide px-3.5 py-1.5 rounded transition-all font-medium ${
              activeTab === "gioithieu" ? "bg-[#4fb3f6]/10 text-[#4fb3f6] shadow-sm font-bold" : "text-[#7fa8c9] hover:text-white"
            }`}
          >
            Giới thiệu
          </button>
          <button
            onClick={() => navigateTo("chuyen-mon", "chuyenmon")}
            className={`text-xs tracking-wide px-3.5 py-1.5 rounded transition-all font-medium ${
              activeTab === "chuyenmon" ? "bg-[#4fb3f6]/10 text-[#4fb3f6] shadow-sm font-bold" : "text-[#7fa8c9] hover:text-white"
            }`}
          >
            Hoạt động 25–26
          </button>
          <button
            onClick={() => navigateTo("ban-chu-nhiem", "bcn")}
            className={`text-xs tracking-wide px-3.5 py-1.5 rounded transition-all font-medium ${
              activeTab === "bcn" ? "bg-[#4fb3f6]/10 text-[#4fb3f6] shadow-sm font-bold" : "text-[#7fa8c9] hover:text-white"
            }`}
          >
            Ban chủ nhiệm
          </button>
          <button
            onClick={() => navigateTo("danh-gia", "reviews")}
            className={`text-xs tracking-wide px-3.5 py-1.5 rounded transition-all font-medium ${
              activeTab === "reviews" ? "bg-[#4fb3f6]/10 text-[#4fb3f6] shadow-sm font-bold" : "text-[#7fa8c9] hover:text-white"
            }`}
          >
            Đánh giá
          </button>
          <button
            onClick={() => setWordleOpen(true)}
            className="text-xs tracking-wide px-3.5 py-1.5 text-[#fbbf24] hover:text-white hover:bg-amber-500/10 rounded transition-all flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3 h-3 text-[#f5a623]" />
            Game Wordle
          </button>
        </div>

        <div className="nav-r flex items-center gap-3">
          <div className="nav-pill hidden lg:block font-mono text-[9px] px-3 py-1.5 border border-[#4fb3f6]/20 bg-[#4fb3f6]/5 rounded text-[#4fb3f6] tracking-[1px] font-bold">
            GEN 7 · 2026
          </div>
          <button
            onClick={() => setRegOpen(true)}
            className="nav-btn text-[11px] font-extrabold tracking-wide px-[17px] py-2 bg-[#4fb3f6] text-[#030b1a] hover:bg-[#fbbf24] hover:shadow-lg hover:shadow-[#4fb3f6]/12 rounded-lg cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all w-fit"
          >
            Gia nhập CLB
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero relative z-10 w-full min-h-[580px] max-w-7xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* HERO LEFT: TEXTS & PRIMARY CALL TO ACTIONS */}
        <div className="hero-l lg:col-span-7 space-y-6 order-1 lg:order-1">
          <div className="hero-eyebrow flex items-center gap-2">
            <div className="ew-line w-5 h-[1px] bg-[#f5a623]" />
            <div className="ew-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold flex items-center gap-1.5">
              <span>ACUET</span>
              <span className="w-1 h-1 bg-[#daeeff]/30 rounded-full" />
              <span>Thành lập 10/2020</span>
              <span className="w-1 h-1 bg-[#daeeff]/30 rounded-full" />
              <span>RC·UET·VNU</span>
            </div>
          </div>

          <h1 className="hero-title font-exo font-black text-5xl md:text-7xl leading-[0.9] tracking-tighter text-white uppercase">
            CLB <br />
            <span className="line2 italic bg-gradient-to-r from-[#7dd3fc] via-[#4fb3f6] to-[#a78bfa] [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] font-black">
              HÀNG KHÔNG
            </span> <br />
            <span className="line3 text-transparent bg-clip-text [-webkit-text-stroke:1.5px_rgba(79,179,246,0.65)] font-extrabold select-none">
              VŨ TRỤ
            </span>
          </h1>

          <div className="hero-sub font-mono text-[10px] tracking-[2.5px] text-[#4fb3f6] font-semibold uppercase">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ · ĐẠI HỌC QUỐC GIA HÀ NỘI
          </div>

          <p className="hero-desc text-sm md:text-base text-[#7fa8c9] leading-relaxed max-w-lg font-syne font-normal">
            Nơi kết nối và nuôi dưỡng khát vọng của những tâm hồn sinh viên đam mê{" "}
            <strong className="text-white font-extrabold hover:text-[#4fb3f6] transition-colors">
              bầu trời, công nghệ cơ khí nhúng và thám hiểm vũ trụ rộng lớn
            </strong>{" "}
            — từ nghiên cứu chế tạo khí động học UAV, lập trình phản điều khiển đến thiên văn quan sát thực địa.
          </p>

          <div className="hero-btns flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo("gioi-thieu", "gioithieu")}
              className="btn-p inline-flex items-center gap-2 px-5 py-3 bg-[#4fb3f6] hover:bg-[#fbbf24] text-[#030b1a] font-bold text-xs uppercase tracking-wide rounded-lg cursor-pointer transform hover:scale-105 duration-200"
            >
              <Compass className="w-4 h-4" /> Khám phá CLB
            </button>
            <button
              onClick={() => navigateTo("chuyen-mon", "chuyenmon")}
              className="btn-g inline-flex items-center gap-2 px-5 py-3 bg-slate-900/60 hover:bg-[#4fb3f6]/10 text-[#7fa8c9] hover:text-white border border-[#7fa8c9]/20 hover:border-[#4fb3f6] text-xs uppercase tracking-wide rounded-lg cursor-pointer transform hover:scale-105 duration-200"
            >
              <Play className="w-3.5 h-3.5 fill-[#7fa8c9] group-hover:fill-white" /> Hoạt động nổi bật
            </button>
            <button
              onClick={() => setWordleOpen(true)}
              className="btn-forum inline-flex items-center gap-2 px-5 py-3 bg-[#a78bfa]/8 hover:bg-[#a78bfa]/18 text-[#a78bfa] hover:text-[#c4b5fd] border border-[#a78bfa]/25 hover:border-[#a78bfa] text-xs uppercase tracking-wide rounded-lg cursor-pointer transform hover:scale-105 duration-200"
            >
              <HelpCircle className="w-4 h-4" /> Diễn đàn & Minigame
            </button>
          </div>
        </div>

        {/* HERO RIGHT: 3D INTERACTIVE CELESTIAL PLANET (CUTENIVERSE PREVIEW) */}
        <div className="hero-r lg:col-span-5 flex flex-col items-center justify-center relative select-none order-2 lg:order-2">
          {/* Subtle cosmic background glow for integration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,179,246,0.06)_0%,transparent_75%)] pointer-events-none" />
          
          <div 
            onClick={() => setCosmosFullScreenOpen(true)}
            className="group/cosmos relative w-full max-w-sm aspect-square bg-[#030b1a]/60 backdrop-blur-md rounded-2xl border border-[#4fb3f6]/20 hover:border-[#4fb3f6]/55 p-4 shadow-[0_0_50px_rgba(79,179,246,0.1)] cursor-pointer transform hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* High-tech telemetry overlays on top edge */}
            <div className="flex items-center justify-between z-10 relative pointer-events-none shrink-0">
              <div className="flex items-center gap-1.5 font-mono text-[8px] tracking-[1.5px] text-[#4fb3f6]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>CUTENIVERSE THU NHỎ</span>
              </div>
              <span className="text-[7px] font-mono text-[#3a6080] border border-[#3a6080]/30 rounded px-1.5 py-0.5 uppercase tracking-widest font-bold">
                TELEMETRY: ON
              </span>
            </div>

            {/* Core 3D Interactive Cosmos viewport (without hard circular clipping so full state shows) */}
            <div className="grow relative w-full h-full min-h-[200px]">
              <InteractiveCosmos
                mode="preview"
                onOpenFullscreen={() => setCosmosFullScreenOpen(true)}
              />
            </div>

            {/* Bottom hud labels and interactive prompts */}
            <div className="flex items-center justify-between z-10 relative pointer-events-none shrink-0 border-t border-[#4fb3f6]/10 pt-3">
              <div className="flex flex-col text-left">
                <span className="text-[7px] font-mono text-[#3a6080] uppercase">HỆ THỐNG</span>
                <span className="text-[9px] font-mono font-black text-[#fbbf24] uppercase tracking-wider">ỔN ĐỊNH 100%</span>
              </div>
              
              <div className="flex items-center gap-1 bg-[#4fb3f6]/10 border border-[#4fb3f6]/20 rounded-md px-2 py-1 text-[8px] font-mono text-[#4fb3f6] group-hover/cosmos:bg-[#4fb3f6]/20 group-hover/cosmos:border-[#4fb3f6]/40 transition-all duration-300">
                <span>VÀO MODULE TOÀN VIỆN</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>
            
            {/* Visual scanlines effect of spacesuit HUD */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#4fb3f6]/4 to-transparent pointer-events-none" />
          </div>
        </div>
      </header>

      {/* HORIZONTAL ANN_TICKER */}
      <section className="ticker relative z-20 w-full height-[38px] overflow-hidden border-y border-[#4fb3f6]/10 bg-[#05111f]/95 py-2.5 flex items-center shadow-lg">
        <div className="ticker-lbl font-mono text-[9px] font-extrabold tracking-[2px] text-[#4fb3f6] bg-[#4fb3f6]/10 border-r border-[#4fb3f6]/15 px-6 shrink-0 h-full flex items-center font-bold">
          LIVE INFO
        </div>

        <div className="ticker-container overflow-hidden w-full relative">
          <div className="ticker-t flex gap-12 text-[#7fa8c9] whitespace-nowrap scroll-smooth ticker-scroll-anim">
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
              Tuyển sinh Gen 7: <b className="text-[#f5a623] font-semibold">Mở cổng đăng ký 01/06/2026</b>
            </div>
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fb3f6]" />
              Thi đấu UAV Cup PV GAS: <b className="text-white font-semibold">Vào Top 8 Toàn Quốc siêu kịch tính!</b>
            </div>
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Hội thảo Khí động học: <b className="text-[#a78bfa] font-semibold">30 suất đặc cách thực nghiệm khí động học</b>
            </div>
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sự kiện Quan sát Nguyệt thực: <b className="text-emerald-400 font-semibold">Triển khai thành công rực rỡ tại Hà Nội</b>
            </div>
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              Ngày hội Khoa học ĐHQGHN: <b className="text-white font-semibold">Gian hàng UAV ACUET được khen ngợi xuất sắc</b>
            </div>

            {/* Repeat list for seamless loop */}
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
              Tuyển sinh Gen 7: <b className="text-[#f5a623] font-semibold">Mở cổng đăng ký 01/06/2026</b>
            </div>
            <div className="tk-i flex items-center gap-2 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fb3f6]" />
              Thi đấu UAV Cup PV GAS: <b className="text-white font-semibold">Vào Top 8 Toàn Quốc siêu kịch tính!</b>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTERS WITH INTERACTIVE HIGHLIGHTS */}
      <section className="stats relative z-10 w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 bg-[#060f1e]/40 border-b border-[#4fb3f6]/10 select-none">
        <div className="st p-6 md:p-8 border-r border-[#4fb3f6]/7 text-center group hover:bg-[#4fb3f6]/3 transition-colors">
          <div className="st-n font-exo font-black text-4xl md:text-5xl text-white tracking-tighter leading-none mb-1 group-hover:text-[#4fb3f6] transition-colors">
            {countMembers}
            <em className="font-sans not-italic text-2xl md:text-3xl text-[#4fb3f6] ml-0.5 font-bold">+</em>
          </div>
          <div className="st-l font-mono text-[9px] text-[#3a6080] tracking-[2px] uppercase font-bold">Thành viên chính thức</div>
          <div className="st-d font-mono text-[9px] text-[#f5a623] mt-1.5">Tăng trưởng Gen 6 · 2025</div>
        </div>

        <div className="st p-6 md:p-8 border-r border-r-[#4fb3f6]/7 text-center group hover:bg-[#4fb3f6]/3 transition-colors">
          <div className="st-n font-exo font-black text-4xl md:text-5xl text-white tracking-tighter leading-none mb-1 group-hover:text-[#4fb3f6] transition-colors">
            {countYears}
            <em className="font-sans not-italic text-2xl md:text-3xl text-[#4fb3f6] ml-0.5 font-bold">th</em>
          </div>
          <div className="st-l font-mono text-[9px] text-[#3a6080] tracking-[2px] uppercase font-bold">Năm hoạt động</div>
          <div className="st-d font-mono text-[9px] text-[#f5a623] mt-1.5 font-semibold">Thành lập 10/2020</div>
        </div>

        <div className="st p-6 md:p-8 border-r border-r-[#4fb3f6]/7 text-center group hover:bg-[#4fb3f6]/3 transition-colors">
          <div className="st-n font-exo font-black text-4xl md:text-5xl text-white tracking-tighter leading-none mb-1 group-hover:text-[#4fb3f6] transition-colors">
            {countProjects}
            <em className="font-sans not-italic text-2xl md:text-3xl text-[#4fb3f6] ml-0.5 font-bold">+</em>
          </div>
          <div className="st-l font-mono text-[9px] text-[#3a6080] tracking-[2px] uppercase font-bold">Dự án &amp; Sự kiện</div>
          <div className="st-d font-mono text-[9px] text-[#f5a623] mt-1.5">Nhiệm Kỳ 2025–2026</div>
        </div>

        <div className="st p-6 md:p-8 text-center group hover:bg-[#4fb3f6]/3 transition-colors">
          <div className="st-n font-exo font-black text-4xl md:text-5xl text-white tracking-tighter leading-none mb-1 group-hover:text-[#4fb3f6] transition-colors">
            Top <em className="font-sans not-italic text-4xl text-[#fbbf24] font-black">{countUavRank}</em>
          </div>
          <div className="st-l font-mono text-[9px] text-[#3a6080] tracking-[2px] uppercase font-bold">Toàn quốc UAV Cup</div>
          <div className="st-d font-mono text-[9px] text-[#f5a623] mt-1.5">Vượt qua vòng loại kịch tính</div>
        </div>
      </section>

      {/* CORE IDENTITY AND BENTO DEPARTMENTS */}
      <section className="sec max-w-7xl mx-auto py-16 px-6 md:px-8 relative z-10" id="gioi-thieu">
        <div className="sh mb-12 max-w-2xl">
          <div className="sl flex items-center gap-2 mb-2">
            <div className="sl-line w-4 h-[1px] bg-[#f5a623]" />
            <span className="sl-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold">Về Chúng Tôi</span>
          </div>
          <h2 className="st2 font-exo font-black text-35 md:text-4xl text-white tracking-tight leading-none uppercase">
            CƠ CẤU BAN CHUYÊN MÔN ACUET
          </h2>
          <p className="sd text-xs md:text-sm text-[#7fa8c9] leading-relaxed mt-3">
            ACUET duy trì cơ cấu tổ chức tinh gọn và chuyên sâu, giúp gắn kết lý thuyết toán cơ học bệ phóng hàng không với chế tạo thực nghiệm UAV và tìm tòi tri thức vũ trụ. <span className="text-[#4fb3f6] font-semibold">Click từng ban mục để xem chi tiết!</span>
          </p>
        </div>

        {/* Bento Board Grid */}
        <div className="bento grid grid-cols-1 md:grid-cols-3 gap-6" id="chuyen-mon">
          {/* Bento Card 1: Học thuật - Wide */}
          <div
            onClick={() => setActiveBentoId("01")}
            className="bc wide md:col-span-2 bg-[#060f1e]/75 hover:bg-[#060f1e]/90 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/35 rounded-xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-[1.012] group select-none shadow-md"
          >
            <div className="bc-num absolute right-4 top-2 font-exo font-black text-7xl text-[#4fb3f6]/5 select-none font-bold">
              01
            </div>
            <div className="bc-icon w-[44px] h-[44px] rounded-lg bg-[#4fb3f6]/6 border border-[#4fb3f6]/15 flex items-center justify-center text-[#4fb3f6] mb-4 group-hover:bg-[#4fb3f6]/12 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="bc-t text-base font-extrabold text-[#daeeff] mb-2 group-hover:text-[#4fb3f6] transition-colors font-syne">
              Học thuật &amp; Nghiên cứu khoa học
            </h3>
            <p className="bc-d text-xs text-[#7fa8c9] leading-relaxed mb-4 font-syne">
              Tổ chức các buổi sinh hoạt khoa học, seminar học thuật về khí động học, cơ học dòng chảy, cơ cấu cánh lái và kết quả nghiên cứu mô phỏng không gian vũ trụ cơ bản.
            </p>
            <div className="bc-tag inline-flex items-center gap-1.5 font-mono text-[9px] text-[#4fb3f6] border border-[#4fb3f6]/16 bg-[#4fb3f6]/5 px-2.5 py-1 rounded">
              <Sparkles className="w-3 h-3 text-[#f5a623]" />
              Hội thảo chuyên sâu định kỳ
            </div>
          </div>

          {/* Bento Card 2: Kỹ thuật */}
          <div
            onClick={() => setActiveBentoId("02")}
            className="bc bg-[#060f1e]/75 hover:bg-[#060f1e]/90 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/35 rounded-xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-[1.012] group select-none shadow-md"
          >
            <div className="bc-num absolute right-4 top-2 font-exo font-black text-7xl text-[#f5a623]/5 select-none font-bold">
              02
            </div>
            <div className="bc-icon w-[44px] h-[44px] rounded-lg bg-[#f5a623]/6 border border-[#f5a623]/15 flex items-center justify-center text-[#f5a623] mb-4 group-hover:bg-[#f5a623]/12 group-hover:text-white transition-all">
              <Drone className="w-5 h-5 animate-bounce" />
            </div>
            <h3 className="bc-t text-base font-extrabold text-[#daeeff] mb-2 group-hover:text-[#f5a623] transition-colors font-syne">
              Dự án Kỹ thuật UAV
            </h3>
            <p className="bc-d text-xs text-[#7fa8c9] leading-relaxed mb-4 font-syne">
              Tập trung chế tạo, cấu hình và tinh chỉnh hệ điều khiển bay cho các mô hình cánh bằng, máy bay mô phỏng và drone nhiều cánh quạt RC.
            </p>
            <div className="bc-tag inline-flex items-center gap-1.5 font-mono text-[9px] text-[#f5a623] border border-[#f5a623]/16 bg-[#f5a623]/5 px-2.5 py-1 rounded">
              <Globe className="w-3 h-3" />
              4 Dự án chế tạo đang vận hành
            </div>
          </div>

          {/* Bento Card 3: Cộng đồng */}
          <div
            onClick={() => setActiveBentoId("03")}
            className="bc bg-[#060f1e]/75 hover:bg-[#060f1e]/90 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/35 rounded-xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-[1.012] group select-none shadow-md"
          >
            <div className="bc-num absolute right-4 top-2 font-exo font-black text-7xl text-[#4fb3f6]/5 select-none font-bold">
              03
            </div>
            <div className="bc-icon w-[44px] h-[44px] rounded-lg bg-[#4fb3f6]/6 border border-[#4fb3f6]/15 flex items-center justify-center text-[#4fb3f6] mb-4 group-hover:bg-[#4fb3f6]/12 group-hover:text-white transition-all">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="bc-t text-base font-extrabold text-[#daeeff] mb-2 group-hover:text-[#4fb3f6] transition-colors font-syne">
              Cộng đồng &amp; Sự kiện xã hội
            </h3>
            <p className="bc-d text-xs text-[#7fa8c9] leading-relaxed mb-4 font-syne">
              Phát động và làm cầu nối giới thiệu câu lạc bộ hàng không vũ trụ tới các đoàn đại học và sự kiện chào đón K70 rực rỡ nhiệt huyết.
            </p>
            <div className="bc-tag inline-flex items-center gap-1.5 font-mono text-[9px] text-[#4fb3f6] border border-[#4fb3f6]/10 bg-[#4fb3f6]/5 px-2.5 py-1 rounded">
              <ArrowRight className="w-3 h-3" />
              Workshop định kỳ hàng tuần
            </div>
          </div>

          {/* Bento Card 4: Thiên văn học - Wide */}
          <div
            onClick={() => setActiveBentoId("04")}
            className="bc wide md:col-span-2 bg-[#060f1e]/75 hover:bg-[#060f1e]/90 border border-[#a78bfa]/10 hover:border-[#a78bfa]/35 rounded-xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-[1.012] group select-none shadow-md"
          >
            <div className="bc-num absolute right-4 top-2 font-exo font-black text-7xl text-[#a78bfa]/5 select-none font-bold">
              04
            </div>
            <div className="bc-icon w-[44px] h-[44px] rounded-lg bg-[#a78bfa]/6 border border-[#a78bfa]/15 flex items-center justify-center text-[#a78bfa] mb-4 group-hover:bg-[#a78bfa]/12 group-hover:text-white transition-all">
              <Telescope className="w-5 h-5" />
            </div>
            <h3 className="bc-t text-base font-extrabold text-[#daeeff] mb-2 group-hover:text-[#a78bfa] transition-colors font-syne">
              Hàng Không · Vũ Trụ · Vật Lý Thiên Văn
            </h3>
            <p className="bc-d text-xs text-[#7fa8c9] leading-relaxed mb-4 font-syne">
              Vành đai quan sát dải Ngân Hà kết hợp xây dựng kính vọng phản xạ, rèn luyện kỹ năng định vị tinh vân đêm sâu hữu ích cho nghiên cứu thực tiễn không trình học thuật.
            </p>
            <div className="bc-tag inline-flex items-center gap-1.5 font-mono text-[9px] text-[#a78bfa] border border-[#a78bfa]/15 bg-[#a78bfa]/5 px-2.5 py-1 rounded">
              <Globe className="w-3 h-3" />
              Sự kiện thiên văn tầm nhìn tối tân
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED MISSION PATH & PORTFOLIO */}
      <section className="sec max-w-7xl mx-auto py-12 px-6 md:px-8 relative z-10" id="hoatdong">
        <div className="sh mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="sl flex items-center gap-2 mb-2">
              <div className="sl-line w-4 h-[1px] bg-[#f5a623]" />
              <span className="sl-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold">Dấu ấn nhiệm kỳ</span>
            </div>
            <h2 className="st2 font-exo font-black text-35 md:text-4xl text-white tracking-tight leading-none uppercase">
              HOẠT ĐỘNG KHỞI KHOÁ NỔI BẬT
            </h2>
          </div>
          <div>
            <button
              onClick={() => setWordleOpen(true)}
              className="text-xs font-mono font-bold text-[#4fb3f6] hover:text-[#fbbf24] transition-colors flex items-center gap-1.5 p-1 bg-[#4fb3f6]/4 hover:bg-[#4fb3f6]/8 rounded border border-[#4fb3f6]/10 px-3 py-1.5"
            >
              Chơi ngay Mini-Game
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main highlight activity component */}
        <div className="act-g grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Highlight Project Card */}
          <div className="act-big lg:col-span-7 bg-[#060f1e]/80 border border-[#4fb3f6]/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="act-img min-h-[220px] bg-gradient-to-br from-[#071628]/95 to-[#4fb3f6]/20 relative flex items-center justify-center overflow-hidden p-6 text-center select-none">
              {/* Fake satellite structural drawing placeholder using clean React structures */}
              <div className="absolute inset-0 w-full h-full bg-slate-950/20 backdrop-blur-[1px]" />
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/30 flex items-center justify-center text-[#f5a623] shadow-lg animate-pulse">
                  <Drone className="w-8 h-8" />
                </div>
                <div className="font-mono text-[9px] tracking-[2.5px] text-[#fbbf24] bg-slate-950/80 px-3 py-1.5 rounded-md border border-[#f5a623]/30">
                  UAV CUP PV GAS 2025 HIGHLIGHT
                </div>
                <p className="text-xs text-[#7fa8c9] font-mono italic max-w-sm">
                  &ldquo;Chế tạo cánh bằng lượn thu thập tọa độ và xả bóng tầm thấp chính xác.&rdquo;
                </p>
              </div>

              <div className="act-img-badge absolute top-3 left-3 font-mono text-[9px] text-[#f5a623] bg-slate-950/85 border border-[#f5a623]/35 rounded px-2.5 py-1">
                KỶ LỤC ACUET
              </div>
            </div>

            <div className="act-body p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="act-cat font-mono text-[9px] tracking-[2px] text-[#f5a623] uppercase block mb-1">
                  THI ĐẤU QUỐC GIA · KỸ THUẬT NHÚNG
                </span>
                <h3 className="act-t font-exo font-extrabold text-xl md:text-2xl text-white mb-2 leading-snug">
                  Hành trình UAV Cup PV GAS 2025 lọt vào TOP 8 toàn quốc
                </h3>
                <p className="act-d text-xs text-[#7fa8c9] leading-relaxed mb-4">
                  Đội thi liên minh nòng cốt của ACUET đã thiết kế nguyên mẫu cánh bằng lượn dài 1.6m sử dụng mô-đun lái lái tự do Pixhawk kết nối micro-telemetry. Thành tích lọt vào top 8 đội tinh hoa vượt trội vòng loại gay cấn toàn quốc.
                </p>
              </div>

              <div>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="act-lnk text-xs font-mono text-[#4fb3f6] hover:text-[#fbbf24] inline-flex items-center gap-1.5 border-b border-[#4fb3f6]/20 transition-all font-semibold"
                >
                  <Facebook className="w-3.5 h-3.5" /> Xem hành trình trên Fanpage
                </a>
              </div>
            </div>
          </div>

          {/* Quick smaller activity timeline */}
          <div className="act-sm-col lg:col-span-5 flex flex-col gap-4">
            <div className="act-sm bg-[#060f1e]/60 border border-[#4fb3f6]/8 rounded-xl p-5 hover:border-[#4fb3f6]/22 transition-all duration-300">
              <span className="act-sm-cat font-mono text-[8px] tracking-[1.5px] text-[#3a6080] block mb-1">
                HỒ SƠ KHỐI VŨ TRỤ · GEN 6
              </span>
              <h4 className="act-sm-t text-sm font-bold text-white mb-1.5">
                Khai hoả đợt chiêu mộ thành viên Gen 6 rầm rộ
              </h4>
              <p className="act-sm-d text-xs text-[#7fa8c9] leading-relaxed">
                Chiến dịch bùng nổ thu hút hơn 120 sinh viên ứng tuyển tìm kiếm 40 học viên đồng hành tài năng.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[8px] text-[#3a6080]">THÁNG 10, 2025</span>
                <span className="text-[10px] text-[#4fb3f6] inline-flex items-center gap-1 font-mono font-semibold">
                  Chi tiết <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="act-sm bg-[#060f1e]/60 border border-[#4fb3f6]/8 rounded-xl p-5 hover:border-[#4fb3f6]/22 transition-all duration-300">
              <span className="act-sm-cat font-mono text-[8px] tracking-[1.5px] text-[#3a6080] block mb-1">
                VẬT LÝ THIÊN VĂN · TRẢI NGHIỆM
              </span>
              <h4 className="act-sm-t text-sm font-bold text-white mb-1.5">
                Quan sát nguyệt thực toàn phần bằng kính phản xạ
              </h4>
              <p className="act-sm-d text-xs text-[#7fa8c9] leading-relaxed">
                Hội nhóm lắp dựng thành công 3 kính thiên văn tự chế, chào đón hơn 80 người theo dõi tại khuôn viên ĐHQGHN.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[8px] text-[#3a6080]">THÁNG 03, 2026</span>
                <span className="text-[10px] text-[#4fb3f6] inline-flex items-center gap-1 font-mono font-semibold">
                  Xem thêm <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="act-sm bg-[#060f1e]/60 border border-[#4fb3f6]/8 rounded-xl p-5 hover:border-[#4fb3f6]/22 transition-all duration-300">
              <span className="act-sm-cat font-mono text-[8px] tracking-[1.5px] text-[#3a6080] block mb-1">
                WELCOMING FEAST · CHÀO ĐÓN K70
              </span>
              <h4 className="act-sm-t text-sm font-bold text-white mb-1.5">
                Đón chào làn sóng tân sinh viên K70 gia nhập UET
              </h4>
              <p className="act-sm-d text-xs text-[#7fa8c9] leading-relaxed">
                Biểu diễn kỹ thuật drone lượn nghệ thuật ấn tượng, khơi dậy tinh thần hàng không cho hàng trăm khoá mới.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[8px] text-[#3a6080]">THÁNG 09, 2025</span>
                <span className="text-[10px] text-[#4fb3f6] inline-flex items-center gap-1 font-mono font-semibold">
                  Xem thêm <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP BAN CHỦ NHIỆM */}
      <section className="lead-g max-w-7xl mx-auto items-center py-16 px-6 md:px-8 border-t border-[#4fb3f6]/10 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10" id="ban-chu-nhiem">
        <div className="lead-l lg:col-span-5 space-y-4">
          <div className="sl flex items-center gap-2 mb-1">
            <div className="sl-line w-4 h-[1px] bg-[#f5a623]" />
            <span className="sl-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold">Ban Điều Hành</span>
          </div>
          <h2 className="st2 font-exo font-black text-3xl md:text-4xl text-white tracking-tight leading-none uppercase">
            BAN CHỦ NHIỆM <br />
            NHIỆM KỲ 2025–2026
          </h2>
          <p className="text-xs md:text-sm text-[#7fa8c9] leading-relaxed">
            Đội ngũ đại diện đầy bản lĩnh, nhiệt huyết kết hợp đa dạng chuyên môn từ cơ khí, điện tử nhúng đến kỹ thuật phần mềm, sẵn sàng dẫn dắt chặng đường GEN 7 cất cánh.
          </p>
          <p className="text-xs text-[#3a6080] font-mono leading-relaxed">
            *Click vào từng thẻ thành viên để xem thành tích cá nhân chuyên sâu của Ban Chủ Nhiệm!
          </p>
        </div>

        {/* Members grid with individual biography modals */}
        <div className="lead-cards lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
          {BCN_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              onClick={() => setActiveLeader(member)}
              className="lc bg-[#060f1e]/85 hover:bg-[#060f1e] border border-[#4fb3f6]/10 hover:border-[#f5a623]/40 rounded-xl p-5 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg group relative overflow-hidden select-none"
            >
              {idx === 0 && (
                <div className="pointer-events-none absolute -right-[40px] -top-[40px] bg-[#f5a623]/10 w-24 h-24 rounded-full border border-dashed border-[#f5a623]/25 flex items-center justify-center animate-spin [animation-duration:12s]" />
              )}
              <div className={`lc-av w-14 h-14 rounded-full border-1.5 flex items-center justify-center font-exo font-extrabold text-[17px] mx-auto mb-4 transition-all ${
                idx === 0 
                  ? "bg-[#f5a623]/6 border-[#f5a623] text-[#f5a623] group-hover:bg-[#f5a623]/12"
                  : "bg-[#4fb3f6]/6 border-[#4fb3f6]/40 text-[#4fb3f6] group-hover:bg-[#4fb3f6]/12"
              }`}>
                {member.initials}
              </div>

              <div className={`lc-role font-mono text-[9px] tracking-[2px] uppercase mb-1.5 font-bold ${
                idx === 0 ? "text-[#f5a623]" : "text-[#4fb3f6]"
              }`}>
                {member.role}
              </div>

              <h4 className="lc-name text-sm font-bold text-white mb-1 group-hover:text-[#4fb3f6] transition-colors">
                {member.name}
              </h4>
              <p className="lc-cls font-mono text-[9px] text-[#3a6080]">
                Lớp: {member.classCode}
              </p>

              <div className="mt-4 inline-flex items-center gap-1 font-mono text-[8px] text-[#4fb3f6] border border-[#4fb3f6]/14 bg-[#4fb3f6]/3 px-2 py-1 rounded">
                Xem Tiểu Sử &rarr;
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA ENROLLMENT BANNER */}
      <section className="recruit-sec relative z-10 py-6 px-6 md:px-8">
        <div className="recruit max-w-[1140px] mx-auto border border-[#f5a623]/28 bg-[#f5a623]/[0.025] rounded-2xl p-8 md:p-12 overflow-hidden relative shadow-lg">
          {/* Faux Background Stamp label */}
          <div className="absolute right-[-24px] top-[-8px] font-exo font-black text-6xl md:text-8xl text-[#f5a623]/[0.025] tracking-widest whitespace-nowrap uppercase pointer-events-none select-none font-bold">
            ACUET GEN 7
          </div>

          <div className="rec-inner grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="rec-tag inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[2px] text-[#f5a623] border border-[#f5a623]/35 bg-[#f5a623]/5 px-3 py-1 rounded font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#f5a623] animate-spin" />
                CHIÊU MỘ ĐỒNG ĐỘI GEN 7
              </div>

              <h2 className="rec-title font-exo font-black text-3xl md:text-5xl text-white uppercase leading-none tracking-tight">
                TRỞ THÀNH <br />
                MẢNH GHÉP TIẾP THEO <br />
                CỦA PHI ĐỘI ACUET
              </h2>

              <p className="rec-d text-xs md:text-sm text-[#7fa8c9] leading-relaxed font-syne font-normal max-w-xl">
                Không phân biệt điểm số hay nền tảng kỹ năng trước đây — chúng tôi chỉ kiếm tìm lòng đam mê chân thực với bầu trời, khao khát chế tác mô hình bay nhúng nhịp nhàng và kết nối bằng hữu chí hướng. Nhận thông báo phỏng vấn ngay hôm nay!
              </p>

              <div>
                <button
                  onClick={() => setRegOpen(true)}
                  className="rec-btn inline-flex items-center gap-2 px-6 py-3.5 bg-[#f5a623] hover:bg-[#fbbf24] text-[#030b1a] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#f5a623]/10 transform active:scale-95"
                >
                  <Send className="w-4 h-4 text-[#030b1a]" /> Đăng Ký Đơn Ứng Tuyển
                </button>
              </div>
            </div>

            <div className="rec-feats lg:col-span-5 space-y-3">
              <div className="rf flex items-start gap-3 p-4 bg-[#f5a623]/3 border border-[#f5a623]/10 rounded-xl hover:border-[#f5a623]/25 transition-all">
                <div className="rf-ic w-8 h-8 rounded-lg bg-[#f5a623]/7 border border-[#f5a623]/18 flex items-center justify-center text-[#f5a623] font-bold flex-shrink-0">
                  01
                </div>
                <div className="rf-t text-left">
                  <h4 className="text-xs font-bold text-white mb-0.5 font-syne">Mở đăng ký Gen 7 chính thức</h4>
                  <p className="text-[10px] text-[#7fa8c9] font-mono uppercase tracking-wide">Cổng mở từ ngày 01/06/2026</p>
                </div>
              </div>

              <div className="rf flex items-start gap-3 p-4 bg-[#f5a623]/3 border border-[#f5a623]/10 rounded-xl hover:border-[#f5a623]/25 transition-all">
                <div className="rf-ic w-8 h-8 rounded-lg bg-[#4fb3f6]/7 border border-[#4fb3f6]/18 flex items-center justify-center text-[#4fb3f6] font-bold flex-shrink-0">
                  02
                </div>
                <div className="rf-t text-left">
                  <h4 className="text-xs font-bold text-white mb-0.5 font-syne">Đào tạo Academy hàng không k70</h4>
                  <p className="text-[10px] text-[#7fa8c9] font-mono">Bổ sung giáo thuật không gian và huấn luyện UAV thực chiến.</p>
                </div>
              </div>

              <div className="rf flex items-start gap-3 p-4 bg-[#a78bfa]/3 border border-[#a78bfa]/10 rounded-xl hover:border-[#a78bfa]/25 transition-all">
                <div className="rf-ic w-8 h-8 rounded-lg bg-[#a78bfa]/7 border border-[#a78bfa]/18 flex items-center justify-center text-[#a78bfa] font-bold flex-shrink-0">
                  03
                </div>
                <div className="rf-t text-left">
                  <h4 className="text-xs font-bold text-white mb-0.5 font-syne">Lịch phỏng vấn trực tiếp</h4>
                  <p className="text-[10px] text-[#7fa8c9] font-mono">Tự chọn thời gian qua thư mời thông báo tự động tiện lợi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT RATING & COMMUNITY MODULE */}
      <ReviewSystem />

      {/* CHANNELS OF ACUET */}
      <section className="social-s max-w-7xl mx-auto py-12 px-6 md:px-8 relative z-10" id="mxh">
        <div className="sh mb-8 text-left">
          <div className="sl flex items-center gap-2 mb-2">
            <div className="sl-line w-4 h-[1px] bg-[#f5a623]" />
            <span className="sl-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold">Kênh Truyền Thông</span>
          </div>
          <h2 className="st2 font-exo font-black text-3xl text-white uppercase tracking-tight">
            THEO DÕI BAN TRUYỀN THÔNG ACUET
          </h2>
        </div>

        <div className="soc-g grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="soc-c bg-[#060f1e]/85 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/30 hover:bg-[#4fb3f6]/3 p-4 rounded-xl flex items-center gap-4 transition-all group cursor-pointer text-decoration-none"
          >
            <div className="soc-ic w-11 h-11 rounded-lg bg-[#4fb3f6]/6 border border-[#4fb3f6]/14 flex items-center justify-center text-[#4fb3f6] group-hover:bg-[#4fb3f6] group-hover:text-[#030b1a] transition-all flex-shrink-0 shadow">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <div className="soc-n text-xs font-black text-white group-hover:text-[#4fb3f6] transition-colors font-syne">
                Facebook Fanpage
              </div>
              <div className="soc-h font-mono text-[9px] text-[#7fa8c9] mt-0.5">
                @acuet.vnu
              </div>
            </div>
          </a>

          <div className="soc-c bg-[#060f1e]/85 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/30 hover:bg-[#4fb3f6]/3 p-4 rounded-xl flex items-center gap-4 transition-all group cursor-pointer select-none">
            <div className="soc-ic w-11 h-11 rounded-lg bg-[#4fb3f6]/6 border border-[#4fb3f6]/14 flex items-center justify-center text-[#4fb3f6] group-hover:bg-[#4fb3f6] group-hover:text-[#030b1a] transition-all flex-shrink-0 shadow">
              <Compass className="w-5 h-5 animate-spin [animation-duration:15s]" />
            </div>
            <div>
              <div className="soc-n text-xs font-black text-white group-hover:text-[#4fb3f6] transition-colors font-syne">
                Kênh TikTok Độc Quyền
              </div>
              <div className="soc-h font-mono text-[9px] text-[#7fa8c9] mt-0.5">
                @acuet.aerospace
              </div>
            </div>
          </div>

          <div className="soc-c bg-[#060f1e]/85 border border-[#4fb3f6]/10 hover:border-[#4fb3f6]/30 hover:bg-[#4fb3f6]/3 p-4 rounded-xl flex items-center gap-4 transition-all group cursor-pointer select-none">
            <div className="soc-ic w-11 h-11 rounded-lg bg-[#4fb3f6]/6 border border-[#4fb3f6]/14 flex items-center justify-center text-[#4fb3f6] group-hover:bg-[#4fb3f6] group-hover:text-[#030b1a] transition-all flex-shrink-0 shadow">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="soc-n text-xs font-black text-white group-hover:text-[#4fb3f6] transition-colors font-syne">
                YouTube CLB Chính Thức
              </div>
              <div className="soc-h font-mono text-[9px] text-[#7fa8c9] mt-0.5">
                ACUET Official Channel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK & GÓP Ý CORNER */}
      <section className="feedback-section max-w-7xl mx-auto py-12 px-6 md:px-8 relative z-10 border-t border-[#4fb3f6]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="sl flex items-center gap-2">
              <div className="sl-line w-4 h-[1px] bg-[#f5a623]" />
              <span className="sl-txt font-mono text-[9px] tracking-[3px] text-[#f5a623] uppercase font-bold">KẾT NỐI Ý KIẾN</span>
            </div>
            <h2 className="st2 font-exo font-black text-2xl md:text-3xl text-white uppercase leading-none">
              GÓP Ý &amp; PHÁT TRIỂN CLB
            </h2>
            <p className="text-xs text-[#7fa8c9] leading-relaxed">
              Mọi đóng góp quý báu của sinh viên, thầy cô và cựu thành viên đều là động cơ đẩy trực tiếp cho cấu trúc ACUET ổn định. Đừng ngần ngại chia sẻ ý kiến ẩn danh hoặc có danh tính của bạn!
            </p>
            <div className="bg-[#05111f]/60 rounded-xl p-4 border border-[#4fb3f6]/8 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#daeeff] font-semibold">
                <Info className="w-4 h-4 text-[#4fb3f6]" />
                <span>Bạn muốn làm thí nghiệm mới?</span>
              </div>
              <p className="text-[11px] text-[#7fa8c9] leading-relaxed">
                Chúng tôi có ngân sách của trường sẵn sàng tài trợ cho các đề tài nghiên cứu UAV tầm cao, chế tác cảm biến telemetry hoặc quan trắc vệ tinh có triển vọng!
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060f1e]/70 border border-[#4fb3f6]/10 rounded-xl p-6 shadow-md">
            <form onSubmit={handleGopYSubmit} className="space-y-4">
              <span className="font-mono text-[9px] tracking-widest text-[#3a6080] uppercase block">HÒM THƯ GÓP Ý CHÍNH THỨC</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-[#3a6080] tracking-wider uppercase block mb-1">Tên của bạn (Tùy chọn)</label>
                  <input
                    type="text"
                    value={gopYName}
                    onChange={(e) => setGopYName(e.target.value)}
                    placeholder="VD: Cựu thành viên Gen 3..."
                    className="w-full bg-[#030b1a] text-[#daeeff] placeholder-[#3a6080] border border-[#4fb3f6]/10 focus:border-[#4fb3f6]/40 p-3 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-[#3a6080] tracking-wider uppercase block mb-1">Hình thức phản hồi</label>
                  <select className="w-full bg-[#030b1a] text-[#daeeff] border border-[#4fb3f6]/10 p-3 rounded-lg text-xs focus:outline-none">
                    <option>Đề xuất ý tưởng dự án thực nghiệm</option>
                    <option>Góp ý công tác tổ chức điều hành BCN</option>
                    <option>Đăng ký cấp thiết bị chuyên dụng</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[8px] text-[#3a6080] tracking-wider uppercase block mb-1">Nội dung đóng góp *</label>
                <textarea
                  required
                  value={gopYContent}
                  onChange={(e) => setGopYContent(e.target.value)}
                  placeholder="Hãy mô tả chi tiết khát vọng hoặc góp ý cải cách vận hành chuyên môn tại ACUET..."
                  rows={4}
                  className="w-full bg-[#030b1a] text-[#daeeff] placeholder-[#3a6080] border border-[#4fb3f6]/10 focus:border-[#4fb3f6]/40 p-3 rounded-lg text-xs focus:outline-none resize-none"
                />
              </div>

              {gopYSuccess && (
                <div className="flex items-center gap-2 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-lg p-3 text-xs animate-fadeIn">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Ý kiến đóng góp của bạn đã được mã hóa gửi về BCN thành công. Cảm ơn sự tận tâm của bạn!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#4fb3f6]/10 hover:bg-[#4fb3f6] text-[#4fb3f6] hover:text-[#030b1a] border border-[#4fb3f6]/25 hover:border-[#4fb3f6] font-syne font-bold font-mono tracking-wider text-xs rounded-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                GỬI PHẢN HỒI AN TOÀN
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="footer relative z-10 border-t border-[#4fb3f6]/7 py-12 px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <div className="ft-n font-exo font-black text-2xl tracking-[2px] text-white">
            ACUET
          </div>
          <p className="ft-d text-xs text-[#7fa8c9] leading-relaxed max-w-sm">
            CLB Hàng Không Vũ Trụ — Sân chơi trí tuệ, mô hình thực nghiệm định hướng kỹ thuật hàng đầu dành cho sinh viên tại Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội.
          </p>
          <a
            href="mailto:ac.uet.vnu@gmail.com"
            className="ft-mail inline-flex items-center gap-2 font-mono text-[10px] text-[#4fb3f6] hover:text-[#fbbf24] transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> ac.uet.vnu@gmail.com
          </a>
        </div>

        <div className="md:col-span-3 space-y-3.5">
          <div className="ft-h font-mono text-[9px] tracking-[2.5px] text-[#3a6080] uppercase font-bold">
            Trang Liên Kết
          </div>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="ft-a text-[11px] text-[#7fa8c9] hover:text-white transition-colors text-left font-medium">Trang chủ chính</button>
            <button onClick={() => navigateTo("gioi-thieu", "gioithieu")} className="ft-a text-[11px] text-[#7fa8c9] hover:text-white transition-colors text-left font-medium">Giới thiệu tổng quan</button>
            <button onClick={() => navigateTo("chuyen-mon", "chuyenmon")} className="ft-a text-[11px] text-[#7fa8c9] hover:text-white transition-colors text-left font-medium">Nhiệm Kỳ Hoạt động</button>
            <button onClick={() => navigateTo("ban-chu-nhiem", "bcn")} className="ft-a text-[11px] text-[#7fa8c9] hover:text-white transition-colors text-left font-medium">Ban chủ nhiệm 2025–2026</button>
            <button onClick={() => setWordleOpen(true)} className="ft-a text-[11px] text-[#fbbf24] hover:text-white transition-colors text-left font-semibold">Wordle Không Gian Game</button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-3.5">
          <div className="ft-h font-mono text-[9px] tracking-[2.5px] text-[#3a6080] uppercase font-bold">
            Kế hoạch Phát Triển
          </div>
          <div className="bg-[#05111f]/70 border border-[#4fb3f6]/10 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Gift className="w-3.5 h-3.5 text-[#fbbf24] animate-bounce" />
              SĂN THÀNH TÍCH
            </h4>
            <p className="text-[11px] text-[#7fa8c9] leading-relaxed">
              Chiến dịch thám hiểm nguyệt thực toàn phần kế tiếp và tuyển chọn nghiên cứu sinh quốc gia bắt đầu sớm từ quý 3/2026!
            </p>
          </div>
        </div>
      </footer>

      {/* FOOTER BOTTOM */}
      <div className="footer-bot relative z-10 border-t border-[#4fb3f6]/5 py-6 px-6 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="ft-copy font-mono text-[9px] text-[#3a6080] tracking-wider uppercase">
          © 2026 HÀNG KHÔNG VŨ TRỤ ACUET — TRƯỜNG ĐH CÔNG NGHỆ · VNU
        </div>
        <div className="ft-copy font-mono text-[9px] text-[#3a6080] tracking-wider uppercase">
          ACUET · KHỞI TẠO TỪ 10/2020 · PHÒNG THÍ NGHIỆM ĐHQGHN
        </div>
      </div>

      {/* SIDEBAR SCROLL BAR INDICATOR */}
      <div className="scroll-i absolute bottom-4 left-6 z-10 hidden md:flex items-center gap-2 text-[#3a6080] font-mono text-[8px] tracking-[2px] uppercase select-none">
        <div className="sb w-7 h-[1px] bg-[#3a6080] overflow-hidden relative scroll-bar-indicator" />
        SCROLL DETECTOR
      </div>

      {/****************** MODALS & DIALOGS ******************/}

      {/* Registration Modal Form */}
      {regOpen && <RegistrationModal onClose={() => setRegOpen(false)} />}

      {/* Wordle Game Modal */}
      {wordleOpen && <AerospaceQuiz onClose={() => setWordleOpen(false)} />}

      {/* Bento Grid Item detail modal */}
      {activeBentoId && (
        <div className="fixed inset-0 bg-[#030b1a]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#060f1e] border border-[#4fb3f6]/30 rounded-xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setActiveBentoId(null)}
              className="absolute top-4 right-4 text-[#7fa8c9] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="font-mono text-xs text-[#fbbf24] bg-[#f5a623]/10 px-2 py-1 rounded border border-[#f5a623]/25 uppercase font-bold tracking-wider">
                Mục Chuyên Môn {activeBentoId}
              </span>
              <h3 className="font-exo font-black text-2xl text-white mt-2 uppercase tracking-tight">
                {BENTO_DETAILS[activeBentoId]?.title}
              </h3>
              <p className="text-xs text-[#4fb3f6] font-mono mt-0.5 italic">
                {BENTO_DETAILS[activeBentoId]?.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#daeeff] leading-relaxed bg-[#05111f] border border-[#4fb3f6]/6 p-3.5 rounded-lg">
                {BENTO_DETAILS[activeBentoId]?.core}
              </p>

              <div>
                <span className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1.5 font-bold">Lĩnh vực sinh hoạt</span>
                <ul className="space-y-1.5">
                  {BENTO_DETAILS[activeBentoId]?.details.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#7fa8c9] flex items-start gap-1.5">
                      <span className="text-[#f5a623] text-sm leading-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1.5 font-bold">Dự án mũi nhọn</span>
                <div className="flex flex-wrap gap-2">
                  {BENTO_DETAILS[activeBentoId]?.projects.map((item, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-white bg-slate-900 border border-[#7fa8c9]/15 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#7fa8c9]/10 flex justify-end gap-2">
              <button
                onClick={() => setRegOpen(true)}
                className="px-4 py-2 bg-[#f5a623] hover:bg-[#fbbf24] text-slate-950 font-extrabold font-syne text-[10px] uppercase rounded transition-colors cursor-pointer"
              >
                Gia nhập Ban này
              </button>
              <button
                onClick={() => setActiveBentoId(null)}
                className="px-4 py-2 bg-[#1a2d40] hover:bg-slate-800 text-white font-syne text-[10px] rounded transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BCN Biography detail modal */}
      {activeLeader && (
        <div className="fixed inset-0 bg-[#030b1a]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#060f1e] border border-[#f5a623]/35 rounded-xl w-full max-w-md p-6 relative shadow-2xl animate-fadeIn">
            <button
              onClick={() => setActiveLeader(null)}
              className="absolute top-4 right-4 text-[#7fa8c9] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/30 flex items-center justify-center text-[#f5a623] font-exo font-black text-lg shadow-inner flex-shrink-0">
                {activeLeader.initials}
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#f5a623] tracking-widest uppercase font-bold">
                  {activeLeader.role}
                </span>
                <h3 className="font-exo font-black text-xl text-white leading-tight uppercase font-extrabold">
                  {activeLeader.name}
                </h3>
                <p className="font-mono text-[10px] text-[#3a6080]">
                  Lớp sinh hoạt: {activeLeader.classCode}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#030b1a] border border-[#7fa8c9]/10 p-3.5 rounded-lg">
                <span className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1 font-bold">Lời ngỏ &amp; Tầm nhìn</span>
                <p className="text-xs text-[#daeeff] leading-relaxed italic">
                  &ldquo;{activeLeader.bio}&rdquo;
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1 font-bold">Chuyên môn sâu</span>
                <p className="text-xs text-[#7fa8c9]">
                  {activeLeader.specialty}
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase block mb-1.5 font-bold">Dự án đã dẫn dắt</span>
                <ul className="space-y-1">
                  {activeLeader.achievements.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#daeeff] flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#7fa8c9]/10 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveLeader(null);
                  setRegOpen(true);
                }}
                className="px-4 py-2 bg-[#4fb3f6] hover:bg-[#fbbf24] text-slate-950 font-extrabold font-syne text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                Gửi câu hỏi cho {activeLeader.initials}
              </button>
              <button
                onClick={() => setActiveLeader(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-syne text-[10px] rounded transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN CUTENIVERSE COSMOS OVERLAY */}
      {cosmosFullScreenOpen && (
        <div className="fixed inset-0 z-50 bg-[#020712] select-none flex flex-col">
          {/* Top Panel Bar */}
          <div className="bg-[#030b1a]/95 border-b border-[#4fb3f6]/15 px-6 py-4 flex items-center justify-between relative z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="font-exo font-black tracking-widest text-[#daeeff] uppercase text-sm sm:text-base">
                CUTENIVERSE SYSTEM SIMULATOR
              </div>
              <span className="hidden sm:inline bg-[#4fb3f6]/10 text-[#4fb3f6] text-[8px] font-mono px-2 py-0.5 rounded border border-[#4fb3f6]/20 font-bold tracking-wider">
                MAIN CORE ONLINE
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href="/cuteniverse/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4fb3f6]/10 hover:bg-[#4fb3f6]/18 border border-[#4fb3f6]/20 hover:border-[#4fb3f6] text-[#4fb3f6] hover:text-white rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all"
              >
                Mở trong tab mới
              </a>
              <button
                onClick={() => setCosmosFullScreenOpen(false)}
                className="group cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 border border-red-500/20 hover:border-red-500/50 hover:bg-slate-950 text-red-500 hover:text-red-400 font-syne font-bold text-[10px] tracking-wider uppercase gap-1.5 transition-all"
              >
                <span>Quay về trang chủ</span>
              </button>
            </div>
          </div>
          
          {/* Primary View Frame */}
          <div className="grow relative bg-[#000003]">
            <iframe
              src="/cuteniverse/index.html"
              className="w-full h-full border-0 absolute inset-0"
              title="Cuteniverse Standalone Sandbox"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </div>
  );
}
