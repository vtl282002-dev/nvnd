import React, { useState, useMemo } from 'react';
import { AirplaneIcon, RocketIcon, SatelliteIcon, DroneIcon } from '../Characters';
import { useDragSystem, DragItemData, DropZoneData } from '../../hooks/useDragSystem';
import { sound } from '../../utils/audio';
import { launchConfetti } from '../../utils/confetti';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { shuffleArray } from '../../utils/shuffle';

interface Stage2Props {
  onSubtaskComplete: (subtaskId: string, points: number) => void;
  onStageComplete: () => void;
}

export const Stage2Aerospace: React.FC<Stage2Props> = ({ onSubtaskComplete, onStageComplete }) => {
  const [subtask, setSubtask] = useState<1 | 2 | 3>(1);

  // Subtask 1: Aerospace Products Classification
  const task1Products: DragItemData[] = [
    {
      id: 'prod-airplane',
      label: 'Máy bay',
      icon: <AirplaneIcon className="w-14 h-14" />,
      correctTargetId: 'use-transport',
    },
    {
      id: 'prod-rocket',
      label: 'Tên lửa vũ trụ',
      icon: <RocketIcon className="w-14 h-14" />,
      correctTargetId: 'use-orbit',
    },
    {
      id: 'prod-satellite',
      label: 'Vệ tinh nhân tạo',
      icon: <SatelliteIcon className="w-14 h-14" />,
      correctTargetId: 'use-weather',
    },
    {
      id: 'prod-drone',
      label: 'Trực thăng / Drone',
      icon: <DroneIcon className="w-14 h-14" />,
      correctTargetId: 'use-rescue',
    },
  ];

  const task1DropZones: DropZoneData[] = [
    {
      id: 'use-transport',
      title: 'VẬN CHUYỂN NGƯỜI & HÀNG HÓA',
      subtitle: 'Chở hành khách và hàng hóa giữa các thành phố',
    },
    {
      id: 'use-orbit',
      title: 'ĐƯA SẢN PHẨM LÊN QUỸ ĐẠO',
      subtitle: 'Phóng vượt khỏi bầu khí quyển Trái Đất',
    },
    {
      id: 'use-weather',
      title: 'DỰ BÁO THỜI TIẾT & TRUYỀN THÔNG',
      subtitle: 'Truyền tín hiệu tivi, internet và theo dõi bão',
    },
    {
      id: 'use-rescue',
      title: 'CỨU HỘ & QUAN SÁT LINH HOẠT',
      subtitle: 'Bay thấp, lơ lửng và tiếp cận địa hình hiểm trở',
    },
  ];

  // Subtask 3: Spacecraft Design Matching
  const task3PlanetFeatures: DragItemData[] = [
    {
      id: 'feat-size',
      label: 'Kích thước và vị trí hành tinh',
      correctTargetId: 'design-fuel',
      icon: <span className="text-2xl">🪐</span>,
    },
    {
      id: 'feat-surface',
      label: 'Bề mặt đá cứng hoặc bề mặt khí',
      correctTargetId: 'design-legs',
      icon: <span className="text-2xl">⛰️</span>,
    },
    {
      id: 'feat-atmo',
      label: 'Khí quyển dày hoặc mỏng',
      correctTargetId: 'design-mass',
      icon: <span className="text-2xl">💨</span>,
    },
    {
      id: 'feat-temp',
      label: 'Nhiệt độ rất nóng hoặc rất lạnh',
      correctTargetId: 'design-shield',
      icon: <span className="text-2xl">🌡️</span>,
    },
  ];

  const task3DesignZones: DropZoneData[] = [
    {
      id: 'design-fuel',
      title: 'Nhiên liệu và hành trình',
      subtitle: 'Tính toán năng lượng để bay đến đích',
    },
    {
      id: 'design-legs',
      title: 'Có cần chân hạ cánh hay không',
      subtitle: 'Quyết định việc đáp xuống đất hay chỉ bay lơ lửng',
    },
    {
      id: 'design-mass',
      title: 'Vật liệu và khối lượng của tàu',
      subtitle: 'Chịu ma sát và áp suất khí quyển',
    },
    {
      id: 'design-shield',
      title: 'Chất liệu bảo vệ tàu vũ trụ',
      subtitle: 'Cách nhiệt chống băng giá hoặc nhiệt độ cao',
    },
  ];

  const currentInitialItems = useMemo(() => {
    const raw = subtask === 1 ? task1Products : task3PlanetFeatures;
    return shuffleArray(raw);
  }, [subtask]);
  const currentDropZones = useMemo(() => {
    return subtask === 1 ? task1DropZones : task3DesignZones;
  }, [subtask]);
  const [completedCount, setCompletedCount] = useState<number>(0);

  const dragManager = useDragSystem({
    initialItems: currentInitialItems,
    dropZones: currentDropZones,
    onCorrectDrop: (itemId, targetId, attempts) => {
      const pts = attempts === 1 ? 10 : attempts === 2 ? 7 : 5;
      onSubtaskComplete(`2.${subtask}`, pts);

      const nextCount = completedCount + 1;
      setCompletedCount(nextCount);

      if (nextCount >= 4) {
        setTimeout(() => {
          if (subtask === 1) {
            setSubtask(2);
            setCompletedCount(0);
          } else if (subtask === 3) {
            onStageComplete();
          }
        }, 1200);
      }
    },
  });

  // Subtask 2: Engineer Work Quiz State
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizAnswerFeedback, setQuizAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleQuizAnswer = (optionId: string) => {
    setQuizSelectedOption(optionId);
    if (optionId === 'A') {
      sound.playCorrect();
      launchConfetti();
      setQuizAnswerFeedback('correct');
      onSubtaskComplete('2.2', 10);
      setTimeout(() => {
        setSubtask(3);
        setCompletedCount(0);
      }, 1500);
    } else {
      sound.playIncorrect();
      setQuizAnswerFeedback('wrong');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between py-2">
      {/* Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/80 mb-3 shadow-lg">
        <div>
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            CHẶNG 2: KHÁM PHÁ HÀNG KHÔNG VŨ TRỤ &bull; NHIỆM VỤ {subtask}/3
          </div>
          <h2 className="text-base md:text-lg font-black text-white">
            {subtask === 1 && 'Kéo từng sản phẩm hàng không vũ trụ vào đúng công dụng!'}
            {subtask === 2 && 'Kỹ sư hàng không vũ trụ cần làm gì trước khi đưa sản phẩm vào sử dụng?'}
            {subtask === 3 && 'Ghép đặc điểm hành tinh với yếu tố thiết kế tàu vũ trụ phù hợp!'}
          </h2>
        </div>

        {dragManager.feedbackMessage && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-lg border border-white"
          >
            {dragManager.feedbackMessage}
          </motion.div>
        )}
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Subtask 1: Aerospace Products Classification */}
        {subtask === 1 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Products Tray */}
            <div className="md:col-span-5 bg-slate-900/75 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                SẢN PHẨM HÀNG KHÔNG VŨ TRỤ:
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1 items-center">
                {dragManager.items.map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => dragManager.registerItemRef(item.id, el)}
                    onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center select-none ${
                      item.isLocked
                        ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20'
                        : dragManager.activeDragId === item.id
                        ? 'opacity-30 border-dashed border-amber-400'
                        : 'bg-slate-800 border-slate-600 hover:border-amber-400 hover:scale-105 shadow-md'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs font-bold text-slate-100 mt-1">{item.label}</span>
                    {item.isLocked && (
                      <span className="text-[10px] text-emerald-400 font-bold mt-0.5">✓ ĐÃ GHÉP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Uses */}
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dragManager.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  ref={(el) => dragManager.registerDropZoneRef(zone.id, el)}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[135px] ${
                    dragManager.shakingTargetId === zone.id
                      ? 'border-red-500 bg-red-950/40 animate-shake'
                      : zone.lockedItem
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-dashed border-slate-600 bg-slate-900/80 hover:border-amber-400/80'
                  }`}
                >
                  <div>
                    <h3 className="text-xs md:text-sm font-black text-amber-300 uppercase">
                      {zone.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">{zone.subtitle}</p>
                  </div>

                  <div className={`mt-2 min-h-[50px] rounded-xl border p-2 flex items-center justify-center ${
                    dragManager.shakingTargetId === zone.id
                      ? 'bg-rose-950/80 border-rose-500'
                      : 'bg-slate-950/60 border-slate-700/80'
                  }`}>
                    {dragManager.shakingTargetId === zone.id ? (
                      <span className="text-xs font-black text-rose-400 flex items-center gap-1.5 animate-pulse">
                        <span className="text-sm font-black">✕</span> Chưa đúng vị trí!
                      </span>
                    ) : zone.lockedItem ? (
                      <div className="flex items-center gap-2">
                        {zone.lockedItem.icon}
                        <span className="text-xs font-black text-emerald-300">
                          {zone.lockedItem.label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500">Kéo sản phẩm vào đây</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtask 2: Engineer Work Quiz */}
        {subtask === 2 && (
          <div className="w-full max-w-2xl bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase">
                CÂU HỎI KỸ THUẬT HÀNG KHÔNG
              </span>
              <h3 className="text-lg md:text-xl font-black text-white">
                Kỹ sư hàng không vũ trụ cần làm gì trước khi đưa sản phẩm vào sử dụng?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'A', text: 'A. Thiết kế và thử nghiệm.', correct: true },
                { id: 'B', text: 'B. Bỏ qua kiểm tra.', correct: false },
                { id: 'C', text: 'C. Chỉ trang trí sản phẩm.', correct: false },
                { id: 'D', text: 'D. Sử dụng ngay khi chưa kiểm tra.', correct: false },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleQuizAnswer(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all flex items-center justify-between ${
                    quizSelectedOption === opt.id
                      ? opt.correct
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400'
                        : 'bg-red-600/30 border-red-500 text-red-200'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-750'
                  }`}
                >
                  <span>{opt.text}</span>
                  {quizSelectedOption === opt.id && opt.correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {quizAnswerFeedback === 'wrong' && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500 text-red-200 text-xs font-semibold text-center animate-shake">
                Chưa chính xác! Một kỹ sư có trách nhiệm luôn phải làm gì để đảm bảo an toàn tuyệt đối? Hãy thử lại nhé!
              </div>
            )}
          </div>
        )}

        {/* Subtask 3: Spacecraft Design Matching */}
        {subtask === 3 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Features Tray */}
            <div className="md:col-span-5 bg-slate-900/75 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl space-y-2.5">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                ĐẶC ĐIỂM CỦA HÀNH TINH:
              </div>
              {dragManager.items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => dragManager.registerItemRef(item.id, el)}
                  onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing text-xs md:text-sm font-bold flex items-center gap-3 select-none ${
                    item.isLocked
                      ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20'
                      : dragManager.activeDragId === item.id
                      ? 'opacity-30 border-dashed border-amber-400'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-400 text-slate-100 shadow'
                  }`}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className="flex-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Design Elements Zones */}
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
              {dragManager.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  ref={(el) => dragManager.registerDropZoneRef(zone.id, el)}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[135px] ${
                    dragManager.shakingTargetId === zone.id
                      ? 'border-red-500 bg-red-950/40 animate-shake'
                      : zone.lockedItem
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-dashed border-slate-600 bg-slate-900/80 hover:border-amber-400/80'
                  }`}
                >
                  <div>
                    <h3 className="text-xs md:text-sm font-black text-amber-300 uppercase">
                      {zone.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">{zone.subtitle}</p>
                  </div>

                  <div className="mt-2 min-h-[46px] rounded-xl bg-slate-950/60 border border-slate-700/80 p-2 flex items-center justify-center">
                    {zone.lockedItem ? (
                      <span className="text-xs font-bold text-emerald-300 text-center">
                        {zone.lockedItem.label}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500">Ghép đặc điểm vào đây</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Ghost Element when Dragging */}
      {dragManager.activeDragId && dragManager.currentDragPos && (
        <div
          className="fixed pointer-events-none z-[10000] transition-none will-change-transform"
          style={{
            transform: `translate3d(${dragManager.currentDragPos.x}px, ${dragManager.currentDragPos.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          {(() => {
            const dragged = dragManager.items.find((i) => i.id === dragManager.activeDragId);
            if (!dragged) return null;
            return (
              <div className="bg-amber-400 text-slate-950 p-3.5 rounded-2xl shadow-2xl border-2 border-white scale-110 flex items-center gap-2 max-w-xs font-black text-xs">
                {dragged.icon && <div className="scale-90">{dragged.icon}</div>}
                <span>{dragged.label}</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
