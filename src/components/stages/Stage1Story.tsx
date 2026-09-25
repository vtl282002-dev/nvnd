import React, { useState, useMemo } from 'react';
import { PauloIcon, LucasIcon, ParentsIcon, CapuacuFruit } from '../Characters';
import { useDragSystem, DragItemData, DropZoneData } from '../../hooks/useDragSystem';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { shuffleArray } from '../../utils/shuffle';

interface Stage1Props {
  onSubtaskComplete: (subtaskId: string, points: number) => void;
  onStageComplete: () => void;
}

export const Stage1Story: React.FC<Stage1Props> = ({ onSubtaskComplete, onStageComplete }) => {
  const [subtask, setSubtask] = useState<1 | 2 | 3>(1);

  // Task 1: Character Identification Items
  const task1InitialItems: DragItemData[] = [
    {
      id: 'char-paulo',
      label: 'Paulo',
      icon: <PauloIcon className="w-14 h-14" />,
      correctTargetId: 'story-characters-zone',
    },
    {
      id: 'char-lucas',
      label: 'Lucas',
      icon: <LucasIcon className="w-14 h-14" />,
      correctTargetId: 'story-characters-zone',
    },
    {
      id: 'char-parents',
      label: 'Bố mẹ Paulo',
      icon: <ParentsIcon className="w-14 h-14" />,
      correctTargetId: 'story-characters-zone',
    },
    {
      id: 'char-alien',
      label: 'Người ngoài hành tinh',
      isDistractor: true,
      icon: <span className="text-4xl">👽</span>,
      correctTargetId: 'none',
    },
    {
      id: 'char-dino',
      label: 'Khủng long',
      isDistractor: true,
      icon: <span className="text-4xl">🦖</span>,
      correctTargetId: 'none',
    },
  ];

  const task1DropZones: DropZoneData[] = [
    {
      id: 'story-characters-zone',
      title: 'NHÂN VẬT CỦA CÂU CHUYỆN',
      subtitle: 'Kéo đúng 3 nhân vật vào đây (Paulo, Lucas, Bố mẹ Paulo)',
      maxItems: 3,
      acceptedItems: [],
    },
  ];

  // Task 2: Story Sequencing Items
  const task2InitialItems: DragItemData[] = [
    {
      id: 'seq-1',
      label: 'Gia đình Paulo chuyển đến sống gần Trung tâm Phóng Alcântara ở Brazil.',
      correctTargetId: 'slot-1',
    },
    {
      id: 'seq-2',
      label: 'Paulo gặp Lucas và hai bạn cùng đi hái quả capuaçu.',
      correctTargetId: 'slot-2',
    },
    {
      id: 'seq-3',
      label: 'Quả capuaçu rơi từ trên cây xuống đất và bị vỡ.',
      correctTargetId: 'slot-3',
    },
    {
      id: 'seq-4',
      label: 'Paulo nghĩ đến việc thiết kế một chiếc dù.',
      correctTargetId: 'slot-4',
    },
    {
      id: 'seq-5',
      label: 'Chiếc dù giúp quả capuaçu tiếp đất chậm và an toàn.',
      correctTargetId: 'slot-5',
    },
  ];

  const task2DropZones: DropZoneData[] = [
    { id: 'slot-1', title: '1. Mở đầu', subtitle: 'Sự kiện diễn ra đầu tiên' },
    { id: 'slot-2', title: '2. Gặp gỡ', subtitle: 'Hai người bạn làm gì?' },
    { id: 'slot-3', title: '3. Sự cố', subtitle: 'Chuyện gì xảy ra với quả capuaçu?' },
    { id: 'slot-4', title: '4. Ý tưởng', subtitle: 'Paulo nghĩ ra giải pháp gì?' },
    { id: 'slot-5', title: '5. Kết quả', subtitle: 'Chiếc dù mang lại kết quả gì?' },
  ];

  // Task 3: Problem & Solution Items
  const task3InitialItems: DragItemData[] = [
    {
      id: 'item-problem',
      label: 'Quả capuaçu rơi từ trên cây xuống và bị vỡ.',
      correctTargetId: 'zone-problem',
      icon: <CapuacuFruit broken className="w-12 h-12" />,
    },
    {
      id: 'item-solution',
      label: 'Thiết kế chiếc dù làm quả rơi chậm và tiếp đất an toàn.',
      correctTargetId: 'zone-solution',
      icon: <span className="text-3xl">🪂</span>,
    },
    {
      id: 'item-distract-cut',
      label: 'Chặt cây capuaçu không cho quả mọc nữa.',
      isDistractor: true,
      correctTargetId: 'none',
      icon: <span className="text-3xl">🪓</span>,
    },
    {
      id: 'item-distract-soccer',
      label: 'Đá bóng dưới gốc cây không quan tâm đến quả rơi.',
      isDistractor: true,
      correctTargetId: 'none',
      icon: <span className="text-3xl">⚽</span>,
    },
  ];

  const task3DropZones: DropZoneData[] = [
    { id: 'zone-problem', title: 'VẤN ĐỀ', subtitle: 'Khó khăn gặp phải là gì?' },
    { id: 'zone-solution', title: 'GIẢI PHÁP', subtitle: 'Cách giải quyết thông minh là gì?' },
  ];

  // Setup current active drag system with shuffled items
  const currentInitialItems = useMemo(() => {
    const raw = subtask === 1 ? task1InitialItems : subtask === 2 ? task2InitialItems : task3InitialItems;
    return shuffleArray(raw);
  }, [subtask]);

  const currentDropZones = useMemo(() => {
    return subtask === 1 ? task1DropZones : subtask === 2 ? task2DropZones : task3DropZones;
  }, [subtask]);

  const [completedItemsCount, setCompletedItemsCount] = useState<number>(0);

  const dragManager = useDragSystem({
    initialItems: currentInitialItems,
    dropZones: currentDropZones,
    onCorrectDrop: (itemId, targetId, attempts) => {
      const pts = attempts === 1 ? 10 : attempts === 2 ? 7 : 5;
      onSubtaskComplete(`1.${subtask}`, pts);

      const nextCount = completedItemsCount + 1;
      setCompletedItemsCount(nextCount);

      const requiredCount = subtask === 1 ? 3 : subtask === 2 ? 5 : 2;
      if (nextCount >= requiredCount) {
        setTimeout(() => {
          if (subtask === 1) {
            setSubtask(2);
            setCompletedItemsCount(0);
          } else if (subtask === 2) {
            setSubtask(3);
            setCompletedItemsCount(0);
          } else {
            onStageComplete();
          }
        }, 1200);
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-between py-2">
      {/* Subtask Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/80 mb-3 shadow-lg">
        <div>
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            CHẶNG 1: CÂU CHUYỆN CỦA PAULO &bull; NHIỆM VỤ {subtask}/3
          </div>
          <h2 className="text-base md:text-lg font-black text-white">
            {subtask === 1 && 'Hãy kéo những nhân vật xuất hiện trong câu chuyện vào khung!'}
            {subtask === 2 && 'Hãy kéo các sự kiện vào đúng thứ tự của câu chuyện!'}
            {subtask === 3 && 'Phân loại đâu là VẤN ĐỀ và đâu là GIẢI PHÁP!'}
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

      {/* Main Task Work Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Subtask 1: Character Identification */}
        {subtask === 1 && (
          <>
            {/* Tray of characters */}
            <div className="md:col-span-6 bg-slate-900/70 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col gap-3 min-h-[300px]">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                DANH SÁCH NHÂN VẬT & ĐỐI TƯỢNG:
              </div>
              <div className="grid grid-cols-3 gap-2.5 flex-1 items-center">
                {dragManager.items.map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => dragManager.registerItemRef(item.id, el)}
                    onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                    className={`relative p-3 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center select-none ${
                      item.isLocked
                        ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20'
                        : dragManager.activeDragId === item.id
                        ? 'opacity-30 border-dashed border-amber-400'
                        : 'bg-slate-800/90 border-slate-600 hover:border-amber-400 hover:scale-105 shadow-md'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs font-bold text-slate-200 mt-1">{item.label}</span>
                    {item.isLocked && (
                      <span className="absolute top-1 right-1 text-emerald-400 text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Drop Zone */}
            <div className="md:col-span-6 flex flex-col h-full min-h-[300px]">
              {dragManager.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  ref={(el) => dragManager.registerDropZoneRef(zone.id, el)}
                  className={`flex-1 p-5 rounded-3xl border-3 border-dashed flex flex-col justify-between transition-all ${
                    dragManager.shakingTargetId === zone.id
                      ? 'border-red-500 bg-red-950/30 animate-shake'
                      : zone.acceptedItems && zone.acceptedItems.length >= 3
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-amber-400/70 bg-slate-900/80'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-black text-amber-300 uppercase">
                      {zone.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-semibold">{zone.subtitle}</p>
                  </div>

                  {/* Slots for 3 characters */}
                  <div className="grid grid-cols-3 gap-3 my-4">
                    {[0, 1, 2].map((idx) => {
                      const item = zone.acceptedItems && zone.acceptedItems[idx];
                      return (
                        <div
                          key={idx}
                          className="h-28 rounded-2xl border-2 border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center p-2 text-center"
                        >
                          {item ? (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex flex-col items-center"
                            >
                              {item.icon}
                              <span className="text-xs font-bold text-emerald-300 mt-1">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-black">✓ ĐÚNG</span>
                            </motion.div>
                          ) : dragManager.shakingTargetId === zone.id ? (
                            <div className="flex flex-col items-center animate-pulse">
                              <span className="text-2xl text-rose-400 font-black">✕</span>
                              <span className="text-[10px] text-rose-300 font-bold mt-1">Sai nhân vật!</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-bold">Kéo vào đây</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center text-xs font-bold text-amber-300">
                    Đã tìm được: {zone.acceptedItems ? zone.acceptedItems.length : 0} / 3 nhân vật
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Subtask 2: Sequencing */}
        {subtask === 2 && (
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Story Cards */}
            <div className="bg-slate-900/75 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                CÁC SỰ KIỆN CỦA CÂU CHUYỆN:
              </div>
              {dragManager.items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => dragManager.registerItemRef(item.id, el)}
                  onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing text-xs md:text-sm font-bold flex items-center gap-3 select-none ${
                    item.isLocked
                      ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20 text-slate-400'
                      : dragManager.activeDragId === item.id
                      ? 'opacity-30 border-dashed border-amber-400'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-400 text-slate-100 shadow'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 font-black text-xs">
                    ✦
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Target Slots 1 to 5 */}
            <div className="bg-slate-900/75 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                THỨ TỰ THỜI GIAN (BƯỚC 1 ĐẾN 5):
              </div>
              {dragManager.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  ref={(el) => dragManager.registerDropZoneRef(zone.id, el)}
                  className={`p-3 rounded-2xl border-2 transition-all min-h-[56px] flex items-center justify-between gap-3 ${
                    dragManager.shakingTargetId === zone.id
                      ? 'border-red-500 bg-red-950/40 animate-shake'
                      : zone.lockedItem
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-dashed border-slate-600 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        dragManager.shakingTargetId === zone.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : zone.lockedItem
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-amber-300'
                      }`}
                    >
                      {dragManager.shakingTargetId === zone.id ? '✕' : zone.lockedItem ? '✓' : zone.title[0]}
                    </span>
                    {zone.lockedItem ? (
                      <span className="text-xs md:text-sm font-bold text-emerald-200">
                        {zone.lockedItem.label}
                      </span>
                    ) : (
                      <div className="text-slate-400 text-xs">
                        <span className="font-bold text-slate-300">{zone.title}: </span>
                        <span>{zone.subtitle}</span>
                      </div>
                    )}
                  </div>
                  {dragManager.shakingTargetId === zone.id && (
                    <span className="text-xs font-black text-rose-400 px-2 py-0.5 rounded-lg bg-rose-950/80 border border-rose-500 animate-pulse">
                      ✕ Chưa đúng!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtask 3: Problem and Solution */}
        {subtask === 3 && (
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Options Tray */}
            <div className="bg-slate-900/75 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl space-y-2.5">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                CÁC TÌNH HUỐNG & HÀNH ĐỘNG:
              </div>
              {dragManager.items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => dragManager.registerItemRef(item.id, el)}
                  onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing text-xs md:text-sm font-bold flex items-center gap-3 select-none ${
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

            {/* Target Problem & Solution Boxes */}
            <div className="flex flex-col gap-4">
              {dragManager.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  ref={(el) => dragManager.registerDropZoneRef(zone.id, el)}
                  className={`flex-1 p-5 rounded-3xl border-3 border-dashed flex flex-col justify-between transition-all min-h-[140px] ${
                    dragManager.shakingTargetId === zone.id
                      ? 'border-red-500 bg-red-950/40 animate-shake'
                      : zone.lockedItem
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : zone.id === 'zone-problem'
                      ? 'border-red-400/60 bg-red-950/10'
                      : 'border-emerald-400/60 bg-emerald-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-base font-black uppercase ${
                          zone.id === 'zone-problem' ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {zone.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-semibold">{zone.subtitle}</p>
                    </div>
                    {dragManager.shakingTargetId === zone.id ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500 animate-pulse flex items-center gap-1">
                        ✕ CHƯA ĐÚNG!
                      </span>
                    ) : zone.lockedItem ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
                        ✓ ĐÃ KHÓA ĐÁP ÁN ĐÚNG
                      </span>
                    ) : null}
                  </div>

                  <div className={`mt-3 min-h-[60px] rounded-2xl border p-3 flex items-center justify-center text-center transition-colors ${
                    dragManager.shakingTargetId === zone.id
                      ? 'bg-rose-950/70 border-rose-500'
                      : 'bg-slate-950/60 border-slate-700'
                  }`}>
                    {dragManager.shakingTargetId === zone.id ? (
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-xs animate-pulse">
                        <span className="text-base font-black">✕</span>
                        <span>Nội dung chưa khớp với {zone.id === 'zone-problem' ? 'vấn đề' : 'giải pháp'}!</span>
                      </div>
                    ) : zone.lockedItem ? (
                      <div className="flex items-center gap-3 text-left">
                        {zone.lockedItem.icon}
                        <span className="text-xs md:text-sm font-bold text-white">
                          {zone.lockedItem.label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">
                        Kéo thẻ tương ứng vào đây
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Ghost Element when Dragging with Hand Gesture or Mouse */}
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
