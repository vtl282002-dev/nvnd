import React, { useState } from 'react';
import { PauloIcon, LucasIcon, CapuacuFruit, ParachuteCanopyIcon, CapuacuTreeIcon } from './Characters';
import { Volume2, VolumeX, Camera, Mouse, Sparkles, Play, User, Swords } from 'lucide-react';
import { ControlMode, GamePlayMode } from '../types';
import { sound } from '../utils/audio';

interface StartScreenProps {
  studentName?: string;
  setStudentName?: (name: string) => void;
  controlMode?: ControlMode;
  setControlMode?: (mode: ControlMode) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  onStartGame: (
    name: string,
    mode: ControlMode,
    playMode?: GamePlayMode,
    teamAName?: string,
    teamBName?: string
  ) => void;
  onOpenTeacherSettings?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  studentName: propStudentName,
  setStudentName: propSetStudentName,
  controlMode: propControlMode,
  setControlMode: propSetControlMode,
  soundEnabled: propSoundEnabled,
  setSoundEnabled: propSetSoundEnabled,
  onStartGame,
  onOpenTeacherSettings,
}) => {
  const [localName, setLocalName] = useState<string>('Học sinh lớp 3');
  const [localMode, setLocalMode] = useState<ControlMode>('mouse');
  const [localSound, setLocalSound] = useState<boolean>(true);

  // Versus Mode options
  const [selectedPlayMode, setSelectedPlayMode] = useState<GamePlayMode>('single');
  const [teamAName, setTeamAName] = useState<string>('Đội Xanh (Paulo)');
  const [teamBName, setTeamBName] = useState<string>('Đội Vàng (Lucas)');

  const studentName = propStudentName !== undefined ? propStudentName : localName;
  const setStudentName = propSetStudentName || setLocalName;

  const controlMode = propControlMode !== undefined ? propControlMode : localMode;
  const setControlMode = propSetControlMode || setLocalMode;

  const soundEnabled = propSoundEnabled !== undefined ? propSoundEnabled : localSound;
  const setSoundEnabled = propSetSoundEnabled || setLocalSound;

  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleStartClick = () => {
    sound.playButtonClick();
    // 3 - 2 - 1 - BẮT ĐẦU!
    setCountdown(3);

    const timer1 = setTimeout(() => {
      sound.playButtonClick();
      setCountdown(2);
    }, 800);

    const timer2 = setTimeout(() => {
      sound.playButtonClick();
      setCountdown(1);
    }, 1600);

    const timer3 = setTimeout(() => {
      sound.playCorrect();
      setCountdown(0); // "BẮT ĐẦU!"
    }, 2400);

    const timer4 = setTimeout(() => {
      setCountdown(null);
      onStartGame(studentName, controlMode, selectedPlayMode, teamAName, teamBName);
    }, 3200);
  };

  return (
    <div
      id="start-screen"
      className="relative w-full h-full flex flex-col items-center justify-between py-3 px-2 md:px-8 max-w-5xl mx-auto overflow-y-auto"
    >
      {/* Top Banner & Title */}
      <div className="text-center space-y-1.5 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs md:text-sm font-black tracking-widest uppercase shadow">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>CHƯƠNG TRÌNH STEM CƠ BẢN LỚP 3</span>
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 filter drop-shadow-md tracking-tight uppercase">
          NHIỆM VỤ NHẢY DÙ CỦA PAULO
        </h1>

        <p className="text-xs md:text-sm lg:text-base font-semibold text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Cùng Paulo khám phá Brazil, tìm hiểu kỹ thuật hàng không vũ trụ và thiết kế chiếc dù giúp quả capuaçu tiếp đất an toàn!
        </p>
      </div>

      {/* Center Illustration Hero Area */}
      <div className="relative w-full max-w-2xl py-2 flex items-center justify-center gap-4 md:gap-8">
        {/* Floating Capuaçu with Parachute */}
        <div className="absolute -top-3 right-1/4 animate-bounce duration-1000 flex flex-col items-center z-20">
          <ParachuteCanopyIcon className="w-20 h-12 md:w-24 md:h-14 filter drop-shadow-lg" />
          <div className="w-16 h-6 flex justify-center items-center">
            {/* Cords */}
            <svg viewBox="0 0 60 30" className="w-12 h-6">
              <line x1="5" y1="0" x2="30" y2="30" stroke="#ffdf00" strokeWidth="2" />
              <line x1="20" y1="0" x2="30" y2="30" stroke="#ffdf00" strokeWidth="2" />
              <line x1="40" y1="0" x2="30" y2="30" stroke="#ffdf00" strokeWidth="2" />
              <line x1="55" y1="0" x2="30" y2="30" stroke="#ffdf00" strokeWidth="2" />
            </svg>
          </div>
          <CapuacuFruit className="w-12 h-12 md:w-14 md:h-14 filter drop-shadow-md -mt-1" />
        </div>

        {/* Paulo Character */}
        <div className="flex flex-col items-center z-10 group transform hover:scale-105 transition">
          <PauloIcon className="w-20 h-20 md:w-28 md:h-28 filter drop-shadow-xl" />
          <span className="text-xs font-black text-amber-300 mt-1 uppercase tracking-wide">Paulo</span>
        </div>

        {/* Tree Center */}
        <div className="flex flex-col items-center opacity-85">
          <CapuacuTreeIcon className="w-24 h-24 md:w-32 md:h-32" />
          <span className="text-[10px] font-bold text-emerald-300">Cây Capuaçu Brazil</span>
        </div>

        {/* Lucas Character */}
        <div className="flex flex-col items-center z-10 group transform hover:scale-105 transition">
          <LucasIcon className="w-20 h-20 md:w-28 md:h-28 filter drop-shadow-xl" />
          <span className="text-xs font-black text-sky-300 mt-1 uppercase tracking-wide">Lucas</span>
        </div>
      </div>

      {/* Control Setup & Mode Card */}
      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-3xl border border-slate-700 shadow-2xl flex flex-col gap-3">
        {/* Game Mode Choice: 1 Player vs 2 Teams Versus */}
        <div>
          <label className="block text-[11px] font-black text-amber-300 mb-1 uppercase tracking-wider">
            CHỌN HÌNH THỨC CHƠI:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              id="select-single-mode-btn"
              onClick={() => {
                sound.playButtonClick();
                setSelectedPlayMode('single');
              }}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 font-bold text-xs md:text-sm transition-all ${
                selectedPlayMode === 'single'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400 shadow-lg'
                  : 'bg-slate-950/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="text-left">
                <div>1 Người chơi</div>
                <div className="text-[10px] text-slate-300 font-normal">Luyện tập cá nhân</div>
              </div>
            </button>

            <button
              type="button"
              id="select-versus-mode-btn"
              onClick={() => {
                sound.playButtonClick();
                setSelectedPlayMode('versus');
              }}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 font-bold text-xs md:text-sm transition-all ${
                selectedPlayMode === 'versus'
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 shadow-lg'
                  : 'bg-slate-950/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Swords className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <div>2 Đội Đối Kháng</div>
                <div className="text-[10px] text-emerald-300 font-normal">Thi đấu lớp học</div>
              </div>
            </button>
          </div>
        </div>

        {/* Inputs based on Play Mode */}
        {selectedPlayMode === 'versus' ? (
          <div className="grid grid-cols-2 gap-2.5 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[10px] font-black text-emerald-300 mb-0.5 uppercase">
                🟢 Đội 1:
              </label>
              <input
                type="text"
                id="team-a-name-input"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                placeholder="Tên đội 1..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-white font-bold text-xs outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-amber-300 mb-0.5 uppercase">
                🟡 Đội 2:
              </label>
              <input
                type="text"
                id="team-b-name-input"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                placeholder="Tên đội 2..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-bold text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              HỌ VÀ TÊN HỌC SINH:
            </label>
            <input
              type="text"
              id="student-name-input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập tên em (Ví dụ: Minh Anh, Hoàng Nam...)"
              className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border-2 border-slate-600 focus:border-amber-400 text-white font-bold placeholder-slate-500 outline-none transition text-sm shadow-inner"
            />
          </div>
        )}

        {/* Input Method Selector (Mouse vs Camera Gesture) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1">
            PHƯƠNG THỨC ĐIỀU KHIỂN:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              id="select-mouse-mode-btn"
              onClick={() => {
                sound.playButtonClick();
                setControlMode('mouse');
              }}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 font-bold text-xs md:text-sm transition-all ${
                controlMode === 'mouse'
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-2 ring-blue-400'
                  : 'bg-slate-950/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Mouse className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <div>Điều khiển Chuột</div>
                <div className="text-[10px] text-slate-300 font-normal">Kéo thả bằng chuột</div>
              </div>
            </button>

            <button
              type="button"
              id="select-gesture-mode-btn"
              onClick={() => {
                sound.playButtonClick();
                setControlMode('gesture');
                setShowTutorial(true);
              }}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 font-bold text-xs md:text-sm transition-all ${
                controlMode === 'gesture'
                  ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400'
                  : 'bg-slate-950/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <div>Cử chỉ Camera</div>
                <div className="text-[10px] text-emerald-300 font-normal">Nắm chọn - Xoè thả</div>
              </div>
            </button>
          </div>
        </div>

        {/* Actions Row: Audio & Tutorial & SẴN SÀNG */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="sound-start-toggle"
              onClick={() => {
                sound.playButtonClick();
                setSoundEnabled(!soundEnabled);
              }}
              className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition ${
                soundEnabled
                  ? 'bg-slate-800 border-amber-400/50 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Bật âm' : 'Tắt'}</span>
            </button>

            <button
              type="button"
              id="gesture-guide-btn"
              onClick={() => {
                sound.playButtonClick();
                setShowTutorial(true);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>✋ Hướng dẫn cử chỉ</span>
            </button>
          </div>

          <button
            type="button"
            id="ready-start-btn"
            onClick={handleStartClick}
            className="flex-1 py-3 px-4 md:px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm md:text-base tracking-wide uppercase shadow-xl hover:shadow-amber-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>SẴN SÀNG!</span>
          </button>
        </div>
      </div>

      {/* Gesture Tutorial Modal (Updated 3-gesture rule) */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 md:p-6 max-w-lg w-full text-white shadow-2xl space-y-3.5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✋</span>
                <h3 className="text-base md:text-lg font-black text-emerald-300 uppercase">
                  QUY TẮC 3 CỬ CHỈ BÀN TAY
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTutorial(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              {/* 1. Fist = Select */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/90 border border-emerald-500/40 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl text-emerald-300 font-bold flex-shrink-0">
                  ✊
                </div>
                <div>
                  <div className="font-black text-emerald-300 text-sm">1. NẮM TAY = CHỌN VẬT THỂ</div>
                  <div className="text-slate-200 text-xs mt-0.5">
                    Đưa con trỏ đến hình ảnh và nắm bàn tay lại để gắp và giữ vật thể.
                  </div>
                </div>
              </div>

              {/* 2. Open Hand = Drop */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/90 border border-amber-500/40 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl text-amber-300 font-bold flex-shrink-0">
                  ✋
                </div>
                <div>
                  <div className="font-black text-amber-300 text-sm">2. XOÈ TAY = THẢ VẬT THỂ VÀO Ô</div>
                  <div className="text-slate-200 text-xs mt-0.5">
                    Di chuyển vật thể đến ô đáp án và xoè bàn tay ra để thả trực tiếp vào ô!
                  </div>
                </div>
              </div>

              {/* 3. Thumbs Up = Alternative Drop */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/90 border border-cyan-500/40 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl text-cyan-300 font-bold flex-shrink-0">
                  👍
                </div>
                <div>
                  <div className="font-black text-cyan-300 text-sm">3. HÌNH DÁNG LIKE = THẢ VÀO Ô</div>
                  <div className="text-slate-200 text-xs mt-0.5">
                    Em cũng có thể giơ ngón tay cái Like 👍 ngay trên ô mục tiêu để thả vào ô!
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  setShowTutorial(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-400 transition uppercase text-xs tracking-wider"
              >
                ĐÃ HIỂU 3 CỬ CHỈ, SẴN SÀNG!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 scale-125 transition-transform duration-500 drop-shadow-2xl">
              {countdown === 0 ? 'BẮT ĐẦU!' : countdown}
            </div>
            <div className="mt-4 text-xl font-bold text-slate-200 uppercase tracking-widest">
              {countdown === 0 ? 'CHÚC EM HOÀN THÀNH XUẤT SẮC!' : 'CHUẨN BỊ...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
