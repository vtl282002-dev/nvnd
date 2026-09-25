import React, { memo } from 'react';
import { Volume2, VolumeX, Settings, Award, Timer as TimerIcon, User, Users, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

import { StageId, GamePlayMode, TeamInfo, TeamId } from '../types';

interface HeaderBarProps {
  currentStage: StageId;
  totalScore: number;
  timeRemainingSeconds: number;
  timedMode: boolean;
  isMuted?: boolean;
  onToggleMute: () => void;
  onOpenTeacherSettings: () => void;
  studentName?: string;
  subtaskTitle?: string;
  gamePlayMode?: GamePlayMode;
  teamA?: TeamInfo;
  teamB?: TeamInfo;
  currentTeamTurn?: TeamId;
  onSwitchTeamTurn?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = memo(({
  currentStage,
  totalScore,
  timeRemainingSeconds,
  timedMode,
  isMuted = false,
  onToggleMute,
  onOpenTeacherSettings,
  studentName,
  subtaskTitle = '',
  gamePlayMode = 'single',
  teamA,
  teamB,
  currentTeamTurn = 'teamA',
  onSwitchTeamTurn,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const stage = currentStage;
  const score = totalScore;
  const timeLeft = timedMode ? timeRemainingSeconds : null;
  const soundEnabled = !isMuted;
  const onToggleSound = onToggleMute;

  const isVersus = gamePlayMode === 'versus' && teamA && teamB;

  return (
    <header
      id="game-header-bar"
      className="w-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 md:px-4 md:py-2.5 shadow-xl flex items-center justify-between gap-2 md:gap-3 text-white z-40"
    >
      {/* Left: Branding & Team/Student Info */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2">
          {/* Brazil Flag STEM Emblem */}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-[#009c3b] to-[#10b981] p-1 flex items-center justify-center shadow-md border border-amber-300 flex-shrink-0">
            <span className="text-xl">🪂</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] md:text-xs font-black tracking-wider text-amber-300 uppercase">STEM LỚP 3</span>
              {isVersus ? (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                  ⚔️ 2 ĐỘI ĐỐI KHÁNG
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600/80 text-blue-100 font-semibold">
                  BRAZIL
                </span>
              )}
            </div>
            <h1 className="text-xs md:text-sm font-extrabold text-white tracking-tight leading-tight truncate max-w-[150px] md:max-w-none">
              NHIỆM VỤ NHẢY DÙ CỦA PAULO
            </h1>
          </div>
        </div>

        {/* Student Name (if single mode) */}
        {!isVersus && studentName && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-600 text-xs font-semibold text-amber-200">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[100px] truncate">{studentName}</span>
          </div>
        )}
      </div>

      {/* Middle: Stage indicator */}
      <div className="hidden sm:flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-lg text-xs font-black transition-all ${
                s === stage
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 scale-110 shadow-lg ring-2 ring-white'
                  : s < stage
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {s < stage ? '✓' : `C${s}`}
            </div>
          ))}
        </div>
        <span className="text-[10px] md:text-[11px] font-bold text-slate-200 mt-0.5 max-w-[180px] truncate text-center">
          {subtaskTitle}
        </span>
      </div>

      {/* Right: Scores & Controls */}
      <div className="flex items-center gap-2">
        {/* Versus Mode: Both Teams Badges & Turn switch */}
        {isVersus && teamA && teamB ? (
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-700">
            {/* Team A Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentTeamTurn === 'teamA'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 font-bold scale-105'
                  : 'bg-slate-800/80 text-slate-300 opacity-75'
              }`}
            >
              <div className="text-left leading-none">
                <div className="text-[8px] uppercase tracking-wider font-extrabold flex items-center gap-0.5">
                  <span>{teamA.name}</span>
                  {currentTeamTurn === 'teamA' && <span className="animate-ping text-[7px]">●</span>}
                </div>
                <div className="text-sm font-black mt-0.5 text-amber-300">{teamA.score} đ</div>
              </div>
            </div>

            {/* Turn Switch Button */}
            {onSwitchTeamTurn && (
              <button
                type="button"
                id="switch-turn-btn"
                onClick={() => {
                  sound.playButtonClick();
                  onSwitchTeamTurn();
                }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 transition"
                title="Đổi lượt đội chơi"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Team B Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentTeamTurn === 'teamB'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300 font-bold scale-105'
                  : 'bg-slate-800/80 text-slate-300 opacity-75'
              }`}
            >
              <div className="text-left leading-none">
                <div className="text-[8px] uppercase tracking-wider font-extrabold flex items-center gap-0.5">
                  <span>{teamB.name}</span>
                  {currentTeamTurn === 'teamB' && <span className="animate-ping text-[7px]">●</span>}
                </div>
                <div className="text-sm font-black mt-0.5 text-amber-200">{teamB.score} đ</div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Mode Score Badge */
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/30 border border-amber-400/50 px-2.5 md:px-3 py-1.5 rounded-xl shadow">
            <Award className="w-4 h-4 text-amber-300" />
            <div className="text-right">
              <div className="text-[9px] md:text-[10px] text-amber-200 uppercase font-bold tracking-wider leading-none">Điểm</div>
              <div className="text-sm md:text-lg font-black text-amber-300 leading-none">{score}</div>
            </div>
          </div>
        )}

        {/* Optional Timer */}
        {timeLeft !== null && (
          <div
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-mono font-bold text-xs ${
              timeLeft < 60
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-200'
            }`}
          >
            <TimerIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}

        {/* Audio Toggle */}
        <button
          type="button"
          id="sound-toggle-btn"
          onClick={() => {
            sound.playButtonClick();
            onToggleSound();
          }}
          className={`p-2 rounded-xl border transition ${
            soundEnabled
              ? 'bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700'
              : 'bg-slate-800/50 border-slate-700 text-slate-500'
          }`}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Teacher Settings Button */}
        <button
          type="button"
          id="teacher-settings-btn"
          onClick={() => {
            sound.playButtonClick();
            onOpenTeacherSettings();
          }}
          className="p-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          title="Bảng điều khiển giáo viên"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
});
