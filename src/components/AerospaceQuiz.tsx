/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState } from "react";
import { Sparkles, HelpCircle, Trophy, RefreshCw, X } from "lucide-react";

interface WordPuzzle {
  word: string;
  hint: string;
  funFact: string;
}

const PUZZLES: WordPuzzle[] = [
  {
    word: "ORBIT",
    hint: "Quỹ đạo bay tuần hoàn xung quanh một thiên thể vũ trụ.",
    funFact: "Trạm vũ trụ quốc tế ISS bay ở quỹ đạo Trái Đất tầm thấp (LEO) với tốc độ khoảng 27,600 km/h!",
  },
  {
    word: "DRONE",
    hint: "Thiết bị bay không người lái vô cùng phổ biến trong nghiên cứu ACUET.",
    funFact: "ACUET có các dự án tự phát triển UAV phục vụ khảo sát địa hình.",
  },
  {
    word: "SPACE",
    hint: "Khoảng không gian vô tận ngoài bầu khí quyển Trái Đất.",
    funFact: "Ranh giới Kármán ở độ cao 100km được coi là điểm bắt đầu của không gian vũ trụ.",
  },
  {
    word: "UAV",
    hint: "Viết tắt tiếng Anh của Phương tiện bay không người lái.",
    funFact: "UAV Cup PV GAS 2025 là giải đấu kỹ thuật mà ACUET lọt vào Top 8 toàn quốc!",
  },
  {
    word: "ROCKET",
    hint: "Phương tiện phóng đẩy sử dụng phản lực để thoát ly lực hấp dẫn Trái Đất.",
    funFact: "Tên lửa Saturn V đưa con người lên Mặt Trăng tiêu thụ khoảng 13 tấn nhiên liệu mỗi giây!",
  },
];

interface AerospaceQuizProps {
  onClose: () => void;
}

export default function AerospaceQuiz({ onClose }: AerospaceQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [score, setScore] = useState(0);

  const puzzle = PUZZLES[currentIdx];
  const maxAttempts = 6;

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuess = guess.toUpperCase().trim();
    if (!cleanGuess || solved || failed) return;

    if (cleanGuess.length !== puzzle.word.length) {
      alert(`Từ cần tìm có đúng ${puzzle.word.length} ký tự!`);
      return;
    }

    const newAttempts = [...attempts, cleanGuess];
    setAttempts(newAttempts);
    setGuess("");

    if (cleanGuess === puzzle.word) {
      setSolved(true);
      setScore((prev) => prev + 100);
    } else if (newAttempts.length >= maxAttempts) {
      setFailed(true);
    }
  };

  const nextPuzzle = () => {
    setCurrentIdx((prev) => (prev + 1) % PUZZLES.length);
    setAttempts([]);
    setSolved(false);
    setFailed(false);
    setGuess("");
  };

  const restartAll = () => {
    setCurrentIdx(0);
    setAttempts([]);
    setSolved(false);
    setFailed(false);
    setGuess("");
    setScore(0);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#060f1e] border border-[#4fb3f6]/20 rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7fa8c9] hover:text-white transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="bg-[#4fb3f6]/10 p-1.5 rounded border border-[#4fb3f6]/30">
            <Sparkles className="w-5 h-5 text-[#4fb3f6]" />
          </div>
          <div>
            <h3 className="font-exo font-extrabold text-xl tracking-tight text-white">
              Aerospace Wordle
            </h3>
            <p className="font-mono text-[9px] text-[#3a6080] tracking-wider uppercase">
              ACUET SPECIAL MINI-GAME
            </p>
          </div>
        </div>

        <div className="bg-[#05111f] border border-[#7fa8c9]/10 rounded-lg p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#f5a623] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#a78bfa] font-mono tracking-wider font-semibold mb-1">
                GỢI Ý TỪ KHÓA ({puzzle.word.length} CHỮ CÁI):
              </p>
              <p className="text-sm text-[#daeeff] leading-relaxed font-syne">
                {puzzle.hint}
              </p>
            </div>
          </div>
        </div>

        {/* Word Grid */}
        <div className="flex flex-col gap-2 mb-6">
          {Array.from({ length: maxAttempts }).map((_, rIdx) => {
            const wordGuess = attempts[rIdx];
            return (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {Array.from({ length: puzzle.word.length }).map((_, cIdx) => {
                  let letter = "";
                  let bgColor = "bg-[#030b1a] border-[#1a2d40]";
                  let textColor = "text-[#daeeff]";

                  if (wordGuess) {
                    letter = wordGuess[cIdx] || "";
                    if (letter === puzzle.word[cIdx]) {
                      bgColor = "bg-emerald-950 border-emerald-500 text-emerald-400";
                    } else if (puzzle.word.includes(letter)) {
                      bgColor = "bg-amber-950/80 border-amber-500 text-amber-300";
                    } else {
                      bgColor = "bg-slate-900 border-slate-800 text-slate-500";
                    }
                  } else if (rIdx === attempts.length && !solved && !failed) {
                    letter = guess[cIdx] || "";
                    bgColor = letter ? "border-[#4fb3f6]/40" : "border-[#1a2d40]";
                  }

                  return (
                    <div
                      key={cIdx}
                      className={`w-10 h-10 border rounded flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${bgColor} ${textColor}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Game State Panel */}
        {solved && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 mb-5 text-center animate-pulse">
            <div className="flex justify-center mb-1">
              <Trophy className="w-8 h-8 text-[#f5a623]" />
            </div>
            <h4 className="text-sm font-bold text-emerald-400">GIẢI MÃ THÀNH CÔNG!</h4>
            <p className="text-xs text-[#daeeff] my-1">Đáp án chính xác: <strong className="font-mono text-white text-sm">{puzzle.word}</strong></p>
            <p className="text-xs text-[#7fa8c9] italic mt-1.5 max-w-sm mx-auto leading-relaxed">
              &ldquo;{puzzle.funFact}&rdquo;
            </p>
            <button
              onClick={nextPuzzle}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-syne text-xs rounded transition-colors"
            >
              Từ tiếp theo &rarr;
            </button>
          </div>
        )}

        {failed && (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-4 mb-5 text-center">
            <h4 className="text-sm font-bold text-rose-400">CHƯA CHÍNH XÁC</h4>
            <p className="text-xs text-[#daeeff] my-1">Đáp án đúng là: <strong className="font-mono text-white text-sm">{puzzle.word}</strong></p>
            <p className="text-xs text-[#7fa8c9] mt-2 max-w-sm mx-auto leading-relaxed">
              &ldquo;{puzzle.funFact}&rdquo;
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={nextPuzzle}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold font-syne text-xs rounded transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={restartAll}
                className="px-4 py-2 bg-[#f5a623] hover:bg-[#fbbf24] text-slate-950 font-bold font-syne text-xs rounded transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Chơi lại từ đầu
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!solved && !failed && (
          <form onSubmit={handleGuessSubmit} className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.slice(0, puzzle.word.length))}
              placeholder={`Nhập ${puzzle.word.length} chữ cái...`}
              className="flex-1 px-4 py-2 bg-[#030b1a] border border-[#4fb3f6]/20 rounded-lg text-white font-mono font-medium text-center uppercase focus:border-[#4fb3f6]/60 transition-colors placeholder:text-[#3a6080]"
              maxLength={puzzle.word.length}
              disabled={solved || failed}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#4fb3f6] hover:bg-[#f5a623] active:scale-95 text-slate-950 font-extrabold font-syne text-xs rounded-lg transition-all"
            >
              Gửi
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-[#7fa8c9]/10 flex items-center justify-between font-mono text-[9px] text-[#7fa8c9]">
          <div>Câu số: {currentIdx + 1} / {PUZZLES.length}</div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#f5a623]">Điểm số:</span>
            <span className="bg-[#f5a623]/10 text-[#fbbf24] px-1.5 py-0.5 rounded border border-[#f5a623]/30 font-bold">
              {score} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
