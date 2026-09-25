import React, { useState, useMemo } from 'react';
import { useDragSystem, DragItemData, DropZoneData } from '../../hooks/useDragSystem';
import { sound } from '../../utils/audio';
import { launchConfetti } from '../../utils/confetti';
import { CheckCircle2, Play, ArrowDown, ArrowUp, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { shuffleArray } from '../../utils/shuffle';

interface Stage3Props {
  onSubtaskComplete: (subtaskId: string, points: number) => void;
  onStageComplete: () => void;
}

export const Stage3Physics: React.FC<Stage3Props> = ({ onSubtaskComplete, onStageComplete }) => {
  const [subtask, setSubtask] = useState<1 | 2 | 3>(1);

  // Subtask 1: Flat Paper vs Crumpled Paper Simulation State
  const [prediction, setPrediction] = useState<'flat' | 'crumpled' | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simCompleted, setSimCompleted] = useState<boolean>(false);

  const startPaperSimulation = (choice: 'flat' | 'crumpled') => {
    setPrediction(choice);
    setIsSimulating(true);
    sound.playButtonClick();

    // After animation finishes (~3.5 seconds)
    setTimeout(() => {
      setIsSimulating(false);
      setSimCompleted(true);
      if (choice === 'flat') {
        sound.playCorrect();
        launchConfetti();
        onSubtaskComplete('3.1', 10);
      } else {
        sound.playIncorrect();
        onSubtaskComplete('3.1', 7);
      }
    }, 3500);
  };

  // Subtask 2: Force Identification (Drag & Drop Labels to arrows)
  const task2ForceItems: DragItemData[] = [
    {
      id: 'force-gravity',
      label: 'TRỌNG LỰC',
      correctTargetId: 'arrow-down',
      icon: <ArrowDown className="w-6 h-6 text-amber-400" />,
    },
    {
      id: 'force-air-resistance',
      label: 'LỰC CẢN KHÔNG KHÍ',
      correctTargetId: 'arrow-up',
      icon: <ArrowUp className="w-6 h-6 text-sky-400" />,
    },
  ];

  const task2DropZones: DropZoneData[] = useMemo(
    () => [
      {
        id: 'arrow-down',
        title: 'MŨI TÊN HƯỚNG XUỐNG ↓',
        subtitle: 'Lực hút kéo vật rơi về phía tâm Trái Đất',
      },
      {
        id: 'arrow-up',
        title: 'MŨI TÊN HƯỚNG LÊN ↑',
        subtitle: 'Lực đẩy ngược chiều chuyển động làm vật chậm lại',
      },
    ],
    []
  );

  const [forcesCompleted, setForcesCompleted] = useState<number>(0);

  const shuffledForceItems = useMemo(() => shuffleArray(task2ForceItems), []);

  const forceDragManager = useDragSystem({
    initialItems: shuffledForceItems,
    dropZones: task2DropZones,
    onCorrectDrop: (itemId, targetId, attempts) => {
      const pts = attempts === 1 ? 10 : attempts === 2 ? 7 : 5;
      onSubtaskComplete('3.2', pts);
      const next = forcesCompleted + 1;
      setForcesCompleted(next);
      if (next >= 2) {
        setTimeout(() => {
          setSubtask(3);
        }, 1200);
      }
    },
  });

  // Subtask 3: 4 Quick Questions with shuffled options
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const rawQuestions = [
    {
      question: '1. Trọng lực kéo vật theo hướng nào?',
      options: [
        { text: 'Về phía Trái Đất (xuống dưới)', correct: true },
        { text: 'Bay lên vũ trụ', correct: false },
        { text: 'Bay ngang sang hai bên', correct: false },
      ],
    },
    {
      question: '2. Lực cản không khí có tác dụng gì?',
      options: [
        { text: 'Làm vật chuyển động nhanh hơn rất nhiều', correct: false },
        { text: 'Làm vật chuyển động chậm lại', correct: true },
        { text: 'Làm vật biến mất', correct: false },
      ],
    },
    {
      question: '3. Vật có diện tích tiếp xúc với không khí lớn thường rơi nhanh hay chậm hơn?',
      options: [
        { text: 'Rơi nhanh hơn', correct: false },
        { text: 'Rơi chậm hơn', correct: true },
        { text: 'Không rơi được', correct: false },
      ],
    },
    {
      question: '4. Vì sao chiếc dù giúp người hoặc đồ vật rơi an toàn hơn?',
      options: [
        { text: 'Tán dù rộng làm tăng lực cản không khí, giúp vật rơi chậm hơn', correct: true },
        { text: 'Chiếc dù làm mất hoàn toàn trọng lực của Trái Đất', correct: false },
        { text: 'Dù kéo vật bay thẳng lên mặt trăng', correct: false },
      ],
    },
  ];

  const questions = useMemo(() => {
    return rawQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }, []);

  const handleAnswerQuestion = (idx: number, isCorrect: boolean) => {
    setSelectedAnswer(idx);
    if (isCorrect) {
      sound.playCorrect();
      onSubtaskComplete(`3.3.${currentQuestionIndex + 1}`, 10);
      setTimeout(() => {
        setSelectedAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          onStageComplete();
        }
      }, 1000);
    } else {
      sound.playIncorrect();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between py-2">
      {/* Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/80 mb-3 shadow-lg">
        <div>
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            CHẶNG 3: TRỌNG LỰC VÀ LỰC CẢN KHÔNG KHÍ &bull; NHIỆM VỤ {subtask}/3
          </div>
          <h2 className="text-base md:text-lg font-black text-white">
            {subtask === 1 && 'Thí nghiệm: Dự đoán giữa giấy phẳng và giấy vo tròn, vật nào rơi chậm hơn?'}
            {subtask === 2 && 'Xác định lực: Kéo đúng tên lực vào hai chiều mũi tên!'}
            {subtask === 3 && `Câu hỏi nhanh (${currentQuestionIndex + 1}/${questions.length}): Củng cố kiến thức khoa học!`}
          </h2>
        </div>

        {/* Short Science Flashcards */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-300">
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold">
            <strong className="text-amber-400">Trọng lực:</strong> Kéo về Trái Đất
          </span>
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold">
            <strong className="text-sky-400">Lực cản:</strong> Làm chậm lại
          </span>
        </div>
      </div>

      {/* Main Task Area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Subtask 1: Simulation */}
        {subtask === 1 && (
          <div className="w-full max-w-3xl bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-700 shadow-2xl space-y-5">
            {!isSimulating && !simCompleted && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>DỰ ĐOÁN CỦA EM</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Nếu thả một tờ giấy phẳng và một tờ giấy vo tròn từ cùng một độ cao, vật nào sẽ RƠI CHẬM HƠN?
                </h3>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => startPaperSimulation('flat')}
                    className="p-5 rounded-2xl bg-slate-800 border-2 border-slate-600 hover:border-amber-400 hover:scale-105 transition flex flex-col items-center gap-3 text-center group"
                  >
                    <div className="w-20 h-16 rounded bg-slate-100 shadow border border-slate-400 flex items-center justify-center font-bold text-slate-800 text-xs">
                      Giấy phẳng
                    </div>
                    <div>
                      <div className="text-base font-black text-amber-300">TỜ GIẤY PHẲNG</div>
                      <div className="text-xs text-slate-400">Diện tích tiếp xúc không khí lớn hơn</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => startPaperSimulation('crumpled')}
                    className="p-5 rounded-2xl bg-slate-800 border-2 border-slate-600 hover:border-amber-400 hover:scale-105 transition flex flex-col items-center gap-3 text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 shadow border border-slate-400 flex items-center justify-center font-bold text-slate-800 text-xs">
                      Vo tròn
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-200">TỜ GIẤY VO TRÒN</div>
                      <div className="text-xs text-slate-400">Diện tích tiếp xúc không khí nhỏ hơn</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Animation Simulation in action */}
            {isSimulating && (
              <div className="relative w-full h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/80 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between p-4">
                <div className="text-center text-xs font-bold text-amber-300">
                  ĐANG MÔ PHỎNG THẢ RƠI TRONG KHÔNG KHÍ...
                </div>

                {/* Two falling tracks */}
                <div className="relative flex-1 grid grid-cols-2 gap-8 my-2">
                  {/* Left: Flat paper (glides slowly side-to-side) */}
                  <div className="relative flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-400 mb-1">Giấy phẳng</span>
                    <motion.div
                      initial={{ y: 0, x: 0, rotate: 0 }}
                      animate={{
                        y: [0, 40, 90, 130],
                        x: [0, -25, 25, -10],
                        rotate: [0, -15, 15, -5],
                      }}
                      transition={{ duration: 3.2, ease: 'easeInOut' }}
                      className="w-16 h-10 rounded bg-slate-100 shadow-md border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-800"
                    >
                      Lơ lửng chầm chậm
                    </motion.div>
                  </div>

                  {/* Right: Crumpled paper (drops rapidly to floor) */}
                  <div className="relative flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-400 mb-1">Giấy vo tròn</span>
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: 140 }}
                      transition={{ duration: 1.2, ease: 'easeIn' }}
                      className="w-8 h-8 rounded-full bg-slate-300 shadow-lg border border-slate-400 flex items-center justify-center text-[8px] font-bold text-slate-900"
                    >
                      Rơi nhanh!
                    </motion.div>
                  </div>
                </div>

                {/* Floor */}
                <div className="w-full h-4 bg-emerald-600 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-950 uppercase">
                  Mặt đất
                </div>
              </div>
            )}

            {/* Simulation Result & Explanation */}
            {simCompleted && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-400 text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>KẾT QUẢ THÍ NGHIỆM KHOA HỌC:</span>
                  </div>
                  <ul className="text-xs md:text-sm text-slate-100 space-y-1.5 font-medium">
                    <li>
                      &bull; <strong>Giấy phẳng rơi chậm hơn</strong> vì có diện tích tiếp xúc với không khí lớn hơn, chịu lực cản không khí lớn hơn!
                    </li>
                    <li>
                      &bull; <strong>Giấy vo tròn rơi nhanh hơn</strong> vì chịu lực cản không khí rất nhỏ.
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setSubtask(2)}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-2xl uppercase tracking-wider shadow-lg transition"
                >
                  TIẾP TỤC SANG NHIỆM VỤ 2
                </button>
              </div>
            )}
          </div>
        )}

        {/* Subtask 2: Force Direction Identification */}
        {subtask === 2 && (
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Force Labels Tray */}
            <div className="md:col-span-5 bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-700 shadow-xl space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                CÁC LỰC TÁC DỤNG:
              </div>
              {forceDragManager.items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => forceDragManager.registerItemRef(item.id, el)}
                  onMouseDown={(e) => forceDragManager.handleMouseDownItem(e, item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing font-black text-sm flex items-center gap-3 select-none ${
                    item.isLocked
                      ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20 text-slate-400'
                      : forceDragManager.activeDragId === item.id
                      ? 'opacity-30 border-dashed border-amber-400'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-400 text-white shadow'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">{item.icon}</div>
                  <span className="flex-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Falling Object with Opposite Force Arrows */}
            <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col items-center justify-between min-h-[340px]">
              {/* DropZone: Upward Arrow (Lực cản không khí) */}
              <div
                ref={(el) => forceDragManager.registerDropZoneRef('arrow-up', el)}
                className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  forceDragManager.shakingTargetId === 'arrow-up'
                    ? 'border-red-500 bg-red-950/40 animate-shake'
                    : forceDragManager.dropZones[1]?.lockedItem
                    ? 'border-sky-400 bg-sky-950/30'
                    : 'border-dashed border-sky-500/50 bg-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-6 h-6 text-sky-400 animate-bounce" />
                  <div>
                    <div className="text-xs font-black text-sky-300">MŨI TÊN HƯỚNG LÊN ↑</div>
                    <div className="text-[11px] text-slate-400">Lực đẩy ngược chiều rơi</div>
                  </div>
                </div>
                {forceDragManager.shakingTargetId === 'arrow-up' ? (
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-black text-xs border border-rose-400 animate-pulse">
                    ✕ Chưa đúng vị trí!
                  </span>
                ) : forceDragManager.dropZones[1]?.lockedItem ? (
                  <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 font-black text-xs border border-sky-400">
                    ✓ LỰC CẢN KHÔNG KHÍ
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500">Kéo lực vào đây</span>
                )}
              </div>

              {/* Center Falling Object: Parachute / Fruit */}
              <div className="my-4 flex flex-col items-center">
                <span className="text-4xl filter drop-shadow">🪂</span>
                <span className="text-[11px] font-bold text-amber-300 mt-1">Vật đang rơi</span>
              </div>

              {/* DropZone: Downward Arrow (Trọng lực) */}
              <div
                ref={(el) => forceDragManager.registerDropZoneRef('arrow-down', el)}
                className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  forceDragManager.shakingTargetId === 'arrow-down'
                    ? 'border-red-500 bg-red-950/40 animate-shake'
                    : forceDragManager.dropZones[0]?.lockedItem
                    ? 'border-amber-400 bg-amber-950/30'
                    : 'border-dashed border-amber-500/50 bg-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-6 h-6 text-amber-400 animate-bounce" />
                  <div>
                    <div className="text-xs font-black text-amber-300">MŨI TÊN HƯỚNG XUỐNG ↓</div>
                    <div className="text-[11px] text-slate-400">Lực hút kéo vật về Trái Đất</div>
                  </div>
                </div>
                {forceDragManager.shakingTargetId === 'arrow-down' ? (
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-black text-xs border border-rose-400 animate-pulse">
                    ✕ Chưa đúng vị trí!
                  </span>
                ) : forceDragManager.dropZones[0]?.lockedItem ? (
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-400">
                    ✓ TRỌNG LỰC
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500">Kéo lực vào đây</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subtask 3: 4 Quick Questions */}
        {subtask === 3 && (
          <div className="w-full max-w-2xl bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                CÂU HỎI {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full ${
                      idx === currentQuestionIndex
                        ? 'bg-amber-400 animate-pulse'
                        : idx < currentQuestionIndex
                        ? 'bg-emerald-400'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-black text-white">
              {questions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAnswerQuestion(idx, opt.correct)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm md:text-base transition-all flex items-center justify-between ${
                    selectedAnswer === idx
                      ? opt.correct
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                        : 'bg-red-600/30 border-red-500 text-red-200 animate-shake'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-750'
                  }`}
                >
                  <span>{opt.text}</span>
                  {selectedAnswer === idx && opt.correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Ghost Element */}
      {forceDragManager.activeDragId && forceDragManager.currentDragPos && (
        <div
          className="fixed pointer-events-none z-[10000] transition-none will-change-transform"
          style={{
            transform: `translate3d(${forceDragManager.currentDragPos.x}px, ${forceDragManager.currentDragPos.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          {(() => {
            const dragged = forceDragManager.items.find((i) => i.id === forceDragManager.activeDragId);
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
