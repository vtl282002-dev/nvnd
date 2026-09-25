import React from 'react';
import { Award, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageSummaryModalProps {
  isOpen: boolean;
  stageName: string;
  stageScoreEarned: number;
  totalScore: number;
  correctCount: number;
  keyTakeaway: string;
  onContinue: () => void;
}

export const StageSummaryModal: React.FC<StageSummaryModalProps> = ({
  isOpen,
  stageName,
  stageScoreEarned,
  totalScore,
  correctCount,
  keyTakeaway,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 md:p-8 max-w-lg w-full text-white shadow-2xl space-y-5 animate-scale-up text-center">
        {/* Stage Clear Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-900/50">
          🏆
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>HOÀN THÀNH CHẶNG!</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight">
            {stageName}
          </h2>
        </div>

        {/* Score & Correct answers stats card */}
        <div className="grid grid-cols-2 gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <div className="text-center border-r border-slate-700">
            <div className="text-xs text-slate-400 font-bold uppercase">Điểm chặng này</div>
            <div className="text-2xl md:text-3xl font-black text-amber-400">+{stageScoreEarned}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase">Tổng điểm hiện tại</div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400">{totalScore}</div>
          </div>
        </div>

        {/* Key takeaway - GHI NHỚ */}
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-4 text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mt-0.5">
            <BookOpen className="w-5 h-5 flex-shrink-0" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
              KIẾN THỨC CẦN GHI NHỚ:
            </div>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {keyTakeaway}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <button
            type="button"
            id="stage-continue-btn"
            onClick={() => {
              sound.playButtonClick();
              onContinue();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition"
          >
            <span>TIẾP TỤC CHẶNG TIẾP THEO</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
