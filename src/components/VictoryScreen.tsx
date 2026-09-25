import React, { useEffect, useState } from 'react';
import { PauloIcon, LucasIcon, CapuacuFruit, ParachuteCanopyIcon } from './Characters';
import { Award, RotateCcw, BookOpen, Star, Sparkles, CheckCircle2, Trophy, Users } from 'lucide-react';
import { launchConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';
import { FireworksCanvas } from './FireworksCanvas';
import { GamePlayMode, TeamInfo } from '../types';

interface VictoryScreenProps {
  studentName: string;
  totalScore: number;
  completionTimeSeconds: number;
  totalCorrectTasks: number;
  onPlayAgain: () => void;
  gamePlayMode?: GamePlayMode;
  teamA?: TeamInfo;
  teamB?: TeamInfo;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  studentName,
  totalScore,
  completionTimeSeconds,
  totalCorrectTasks,
  onPlayAgain,
  gamePlayMode = 'single',
  teamA,
  teamB,
}) => {
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  useEffect(() => {
    sound.playVictory();
    // Confetti celebration bursts
    launchConfetti(window.innerWidth / 2, window.innerHeight / 3, 100);
    const t1 = setTimeout(() => launchConfetti(window.innerWidth / 4, window.innerHeight / 2, 70), 600);
    const t2 = setTimeout(() => launchConfetti((3 * window.innerWidth) / 4, window.innerHeight / 2, 70), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} phút ${remainingSecs} giây`;
  };

  // 5 Stars rating based on score
  const starCount = totalScore >= 180 ? 5 : totalScore >= 140 ? 4 : 3;

  const isVersus = gamePlayMode === 'versus' && teamA && teamB;
  const winnerTeam = isVersus
    ? teamA.score > teamB.score
      ? teamA
      : teamB.score > teamA.score
      ? teamB
      : null
    : null;

  return (
    <div
      id="victory-screen"
      className="relative w-full h-full flex flex-col items-center justify-between py-4 px-3 md:px-8 max-w-5xl mx-auto overflow-y-auto z-10"
    >
      {/* HTML5 Canvas Fireworks Background (Full Canvas Celebration) */}
      <FireworksCanvas />

      {/* Top Victory Header */}
      <div className="text-center space-y-2 animate-fade-in relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/25 border border-amber-400 text-amber-300 text-xs md:text-sm font-black tracking-widest uppercase shadow-lg backdrop-blur">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{isVersus ? 'KẾT QUẢ ĐỐI KHÁNG 2 ĐỘI STEM' : 'CHIẾN THẮNG XUẤT SẮC!'}</span>
        </div>

        {isVersus ? (
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 uppercase tracking-tight filter drop-shadow">
              {winnerTeam ? `🏆 CHÚC MỪNG ${winnerTeam.name} CHIẾN THẮNG! 🏆` : '🤝 HAI ĐỘI HÒA NHAU VÔ CÙNG XUẤT SẮC! 🤝'}
            </h1>
            <p className="text-sm md:text-base font-semibold text-slate-200 mt-1">
              Cả hai đội đã hoàn thành xuất sắc nhiệm vụ chế tạo dù và đưa quả capuaçu tiếp đất an toàn!
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 uppercase tracking-tight filter drop-shadow">
              CHÚC MỪNG! EM ĐÃ HOÀN THÀNH NHIỆM VỤ NHẢY DÙ CỦA PAULO!
            </h1>
            <p className="text-sm md:text-base font-semibold text-slate-200 mt-1">
              Quả capuaçu đã tiếp đất nhẹ nhàng và an toàn nhờ chiếc dù tuyệt vời do em thiết kế!
            </p>
          </div>
        )}
      </div>

      {/* Celebrating Characters & Safe Landed Capuaçu Parachute */}
      <div className="w-full max-w-2xl bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 border-2 border-emerald-400 shadow-2xl flex items-center justify-around gap-4 my-2 relative z-20">
        {/* Paulo celebrating */}
        <div className="flex flex-col items-center animate-bounce duration-1000">
          <PauloIcon className="w-20 h-20 md:w-28 md:h-28 filter drop-shadow-xl" />
          <span className="text-xs font-black text-amber-300 mt-1">Paulo hoan hô!</span>
        </div>

        {/* Center: Landed Fruit with safe Parachute */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
          <ParachuteCanopyIcon className="w-20 h-12 md:w-24 md:h-14 filter drop-shadow-md" />
          <div className="w-12 h-5 flex justify-center items-center">
            <svg viewBox="0 0 60 25" className="w-12 h-5">
              <line x1="8" y1="0" x2="30" y2="25" stroke="#ffdf00" strokeWidth="2" />
              <line x1="22" y1="0" x2="30" y2="25" stroke="#ffdf00" strokeWidth="2" />
              <line x1="38" y1="0" x2="30" y2="25" stroke="#ffdf00" strokeWidth="2" />
              <line x1="52" y1="0" x2="30" y2="25" stroke="#ffdf00" strokeWidth="2" />
            </svg>
          </div>
          <CapuacuFruit className="w-14 h-14 filter drop-shadow-xl" />
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] md:text-[11px] font-black uppercase mt-1">
            ✓ TIẾP ĐẤT AN TOÀN
          </div>
        </div>

        {/* Lucas celebrating */}
        <div className="flex flex-col items-center animate-bounce duration-1000 delay-150">
          <LucasIcon className="w-20 h-20 md:w-28 md:h-28 filter drop-shadow-xl" />
          <span className="text-xs font-black text-sky-300 mt-1">Lucas vui mừng!</span>
        </div>
      </div>

      {/* Results & Stats Card */}
      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-slate-700 shadow-2xl space-y-4 relative z-20">
        {isVersus && teamA && teamB ? (
          /* Versus Mode 2 Teams Results */
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
                <span className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  BẢNG TỔNG KẾT ĐỐI KHÁNG 2 ĐỘI
                </span>
              </div>
              <div className="text-xs text-slate-400 font-bold">
                Thời gian: <span className="text-white">{formatTime(completionTimeSeconds)}</span>
              </div>
            </div>

            {/* 2 Teams Score Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Team A */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  winnerTeam?.id === 'teamA'
                    ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400 shadow-xl'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                {winnerTeam?.id === 'teamA' && (
                  <div className="absolute top-1 right-2 text-2xl">👑</div>
                )}
                <div className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                  ĐỘI 1
                </div>
                <div className="text-base md:text-lg font-black text-white truncate mt-0.5">
                  {teamA.name}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-amber-400">{teamA.score}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">điểm</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-1">
                  ✓ {teamA.correctCount} nhiệm vụ đúng
                </div>
              </div>

              {/* Team B */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  winnerTeam?.id === 'teamB'
                    ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400 shadow-xl'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                {winnerTeam?.id === 'teamB' && (
                  <div className="absolute top-1 right-2 text-2xl">👑</div>
                )}
                <div className="text-xs font-black text-amber-400 uppercase tracking-wide">
                  ĐỘI 2
                </div>
                <div className="text-base md:text-lg font-black text-white truncate mt-0.5">
                  {teamB.name}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-amber-400">{teamB.score}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">điểm</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-1">
                  ✓ {teamB.correctCount} nhiệm vụ đúng
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Player Results */
          <div>
            {/* Student name & Star rating */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Nhà kỹ sư nhí:</div>
                <div className="text-xl md:text-2xl font-black text-amber-300">{studentName || 'Học sinh STEM'}</div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-6 h-6 ${
                      s <= starCount
                        ? 'fill-amber-400 text-amber-300 filter drop-shadow'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center mt-3">
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase">Tổng điểm</div>
                <div className="text-2xl md:text-3xl font-black text-amber-400">{totalScore}</div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase">Nhiệm vụ đúng</div>
                <div className="text-2xl md:text-3xl font-black text-emerald-400">{totalCorrectTasks} / 10</div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-bold uppercase">Thời gian</div>
                <div className="text-sm md:text-base font-black text-slate-200 mt-1.5">{formatTime(completionTimeSeconds)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            id="review-knowledge-btn"
            onClick={() => {
              sound.playButtonClick();
              setShowReviewModal(true);
            }}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white font-bold text-sm uppercase flex items-center justify-center gap-2 transition"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>XEM LẠI KIẾN THỨC</span>
          </button>

          <button
            type="button"
            id="play-again-btn"
            onClick={() => {
              sound.playButtonClick();
              onPlayAgain();
            }}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase flex items-center justify-center gap-2 shadow-lg transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>CHƠI LẠI TỪ ĐẦU</span>
          </button>
        </div>
      </div>

      {/* Review Knowledge Modal (Section 15 summary) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-black text-amber-300 uppercase">
                  KIẾN THỨC TỔNG KẾT STEM
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                {
                  id: 1,
                  title: 'Trọng lực',
                  content: 'Trọng lực là lực hút kéo mọi vật về phía Trái Đất.',
                },
                {
                  id: 2,
                  title: 'Lực cản không khí',
                  content: 'Lực cản không khí là lực đẩy ngược chiều chuyển động, làm vật rơi chậm lại.',
                },
                {
                  id: 3,
                  title: 'Diện tích tiếp xúc',
                  content: 'Vật có diện tích tiếp xúc với không khí càng lớn thì lực cản không khí thường càng lớn.',
                },
                {
                  id: 4,
                  title: 'Tán dù rộng',
                  content: 'Tán dù rộng làm tăng lực cản không khí, giúp quả capuaçu rơi chậm và tiếp đất an toàn.',
                },
                {
                  id: 5,
                  title: 'Quy trình kỹ sư',
                  content: 'Kỹ sư cần thiết kế, chế tạo, thử nghiệm và cải tiến sản phẩm trước khi đưa vào sử dụng.',
                },
              ].map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.id}
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-200">{item.title}:</h4>
                    <p className="text-slate-200 text-xs md:text-sm font-medium mt-0.5">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl uppercase text-xs tracking-wider shadow"
              >
                ĐÃ HIỂU VÀ GHI NHỚ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
