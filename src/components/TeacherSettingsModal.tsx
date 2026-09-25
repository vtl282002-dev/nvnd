import React from 'react';
import { TeacherSettings, StageId } from '../types';
import {
  X,
  Volume2,
  VolumeX,
  Camera,
  Mouse,
  Timer,
  Shuffle,
  RotateCcw,
  Sliders,
  Maximize,
  CheckCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeacherSettings;
  onUpdateSettings: (newSettings: Partial<TeacherSettings>) => void;
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onResetScore: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentStage,
  onSelectStage,
  onResetScore,
}) => {
  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-5 md:p-6 max-w-2xl w-full text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-300 uppercase tracking-tight">
                BẢNG ĐIỀU KHIỂN GIÁO VIÊN
              </h2>
              <p className="text-xs text-slate-400">
                Tùy chỉnh chặng bài giảng, cử chỉ camera và chế độ thi đấu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Stage Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            CHỌN NHANH CHẶNG BÀI HỌC:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 1 as StageId, title: 'Chặng 1: Câu chuyện Paulo' },
              { id: 2 as StageId, title: 'Chặng 2: Hàng không vũ trụ' },
              { id: 3 as StageId, title: 'Chặng 3: Trọng lực & lực cản' },
              { id: 4 as StageId, title: 'Chặng 4: Thiết kế dù Capuaçu' },
            ].map((stg) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  onSelectStage(stg.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition flex flex-col justify-between h-20 ${
                  currentStage === stg.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{stg.title}</span>
                {currentStage === stg.id && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Đang học
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Mode & Camera settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              PHƯƠNG THỨC ĐIỀU KHIỂN:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ controlMode: 'mouse' })}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 ${
                  settings.controlMode === 'mouse'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Mouse className="w-4 h-4" />
                <span>Chuột</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ controlMode: 'gesture' })}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 ${
                  settings.controlMode === 'gesture'
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Cử chỉ tay</span>
              </button>
            </div>

            {/* Gesture Sensitivity */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Độ nhạy nhận diện bàn tay:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onUpdateSettings({ gestureSensitivity: level })}
                    className={`py-1 rounded-lg text-xs font-semibold capitalize border ${
                      settings.gestureSensitivity === level
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {level === 'low' ? 'Thấp' : level === 'medium' ? 'Vừa' : 'Cao'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                TÍNH GIỜ TIẾT HỌC:
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ timedMode: !settings.timedMode })}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  settings.timedMode
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {settings.timedMode ? 'Đang BẬT' : 'Đang TẮT'}
              </button>
            </div>

            {settings.timedMode && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Thời lượng ({settings.timerMinutes} phút):
                </span>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={settings.timerMinutes}
                  onChange={(e) => onUpdateSettings({ timerMinutes: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                XÁO TRỘN ĐÁP ÁN:
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ shuffleItems: !settings.shuffleItems })}
                className={`p-1.5 rounded-lg border ${
                  settings.shuffleItems
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Points & Reset */}
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              ĐIỂM CƠ BẢN LẦN ĐẦU ĐÚNG:
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {[10, 15, 20].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => onUpdateSettings({ basePointsFirstTry: pts })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    settings.basePointsFirstTry === pts
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  +{pts} điểm
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
            >
              <Maximize className="w-4 h-4 text-emerald-400" />
              <span>Toàn màn hình</span>
            </button>

            <button
              type="button"
              id="reset-score-btn"
              onClick={() => {
                if (confirm('Thầy/Cô có chắc chắn muốn đặt lại điểm số về 0?')) {
                  sound.playButtonClick();
                  onResetScore();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-700 text-xs font-bold text-red-300 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Điểm</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase rounded-2xl shadow-lg transition"
          >
            LƯU & TIẾP TỤC BÀI GIẢNG
          </button>
        </div>
      </div>
    </div>
  );
};
