import React, { useState, useMemo } from 'react';
import {
  ParachuteCanopyIcon,
  ParachuteLinesIcon,
  CargoBasketIcon,
  CapuacuFruit,
  DistractorRock,
  DistractorPinwheel,
} from '../Characters';
import { useDragSystem, DragItemData, DropZoneData } from '../../hooks/useDragSystem';
import { sound } from '../../utils/audio';
import { launchConfetti } from '../../utils/confetti';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { shuffleArray } from '../../utils/shuffle';

interface Stage4Props {
  onParachuteTestSuccess: () => void;
  onSubtaskComplete: (subtaskId: string, points: number) => void;
}

export const Stage4ParachuteDesign: React.FC<Stage4Props> = ({
  onParachuteTestSuccess,
  onSubtaskComplete,
}) => {
  // Test simulation state: 'idle' | 'testing' | 'success' | 'failed'
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [failureReason, setFailureReason] = useState<string | null>(null);

  // 4 Assembly Slots:
  // slot-canopy (Top), slot-lines (Middle-upper), slot-basket (Middle-lower), slot-fruit (Bottom)
  const parachuteParts: DragItemData[] = [
    {
      id: 'part-canopy-good',
      label: 'Tán dù rộng',
      correctTargetId: 'slot-canopy',
      icon: <ParachuteCanopyIcon className="w-16 h-10" />,
    },
    {
      id: 'part-lines-good',
      label: 'Dây dù bền chắc',
      correctTargetId: 'slot-lines',
      icon: <ParachuteLinesIcon className="w-14 h-10" />,
    },
    {
      id: 'part-basket-good',
      label: 'Giá đỡ quả an toàn',
      correctTargetId: 'slot-basket',
      icon: <CargoBasketIcon className="w-14 h-10" />,
    },
    {
      id: 'part-fruit-good',
      label: 'Quả capuaçu chín',
      correctTargetId: 'slot-fruit',
      icon: <CapuacuFruit className="w-12 h-12" />,
    },
    // Distractors
    {
      id: 'part-canopy-broken',
      label: 'Tán dù bị rách',
      isDistractor: true,
      correctTargetId: 'slot-canopy', // Can accidentally place, but test will fail
      icon: <ParachuteCanopyIcon isBroken className="w-16 h-10" />,
    },
    {
      id: 'part-lines-tangled',
      label: 'Dây dù bị đứt',
      isDistractor: true,
      correctTargetId: 'slot-lines',
      icon: <ParachuteLinesIcon isTangled className="w-14 h-10" />,
    },
    {
      id: 'part-rock',
      label: 'Hòn đá nặng',
      isDistractor: true,
      correctTargetId: 'none',
      icon: <DistractorRock className="w-12 h-12" />,
    },
    {
      id: 'part-pinwheel',
      label: 'Chong chóng đồ chơi',
      isDistractor: true,
      correctTargetId: 'none',
      icon: <DistractorPinwheel className="w-12 h-12" />,
    },
  ];

  const assemblySlots: DropZoneData[] = useMemo(
    () => [
      {
        id: 'slot-canopy',
        title: '1. VỊ TRÍ PHÍA TRÊN CÙNG',
        subtitle: 'Tạo lực cản không khí giúp rơi chậm',
      },
      {
        id: 'slot-lines',
        title: '2. VỊ TRÍ NỐI Ở GIỮA',
        subtitle: 'Nối và giữ thăng bằng cho giá đỡ',
      },
      {
        id: 'slot-basket',
        title: '3. VỊ TRÍ ĐỆM ĐỠ PHÍA DƯỚI',
        subtitle: 'Hấp thụ va đập khi chạm đất',
      },
      {
        id: 'slot-fruit',
        title: '4. VỊ TRÍ VẬT CẦN CỨU HỘ',
        subtitle: 'Hành khách cần được tiếp đất an toàn',
      },
    ],
    []
  );

  const shuffledParachuteParts = useMemo(() => shuffleArray(parachuteParts), []);

  const dragManager = useDragSystem({
    initialItems: shuffledParachuteParts,
    dropZones: assemblySlots,
    onCorrectDrop: (itemId, targetId, attempts) => {
      onSubtaskComplete(`4.assemble`, 10);
    },
  });

  // Check if all 4 slots are filled
  const canopySlot = dragManager.dropZones.find((z) => z.id === 'slot-canopy')?.lockedItem;
  const linesSlot = dragManager.dropZones.find((z) => z.id === 'slot-lines')?.lockedItem;
  const basketSlot = dragManager.dropZones.find((z) => z.id === 'slot-basket')?.lockedItem;
  const fruitSlot = dragManager.dropZones.find((z) => z.id === 'slot-fruit')?.lockedItem;

  const isFullyAssembled = !!(canopySlot && linesSlot && basketSlot && fruitSlot);

  // Trigger test flight
  const handleTestFlight = () => {
    sound.playParachuteOpen();
    setTestState('testing');
    setFailureReason(null);

    // Validate assembly correctness:
    // Canopy must be part-canopy-good, Lines must be part-lines-good
    const isDefective =
      canopySlot?.id === 'part-canopy-broken' || linesSlot?.id === 'part-lines-tangled';

    setTimeout(() => {
      if (isDefective) {
        sound.playIncorrect();
        setTestState('failed');
        if (canopySlot?.id === 'part-canopy-broken') {
          setFailureReason('Tán dù bị rách nên không đủ lực cản không khí! Chiếc dù rơi quá nhanh.');
        } else {
          setFailureReason('Dây dù bị đứt nên chiếc dù bị nghiêng và không giữ thăng bằng được!');
        }
      } else {
        sound.playStageClear();
        launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
        setTestState('success');
        onSubtaskComplete('4.test', 30);
        setTimeout(() => {
          onParachuteTestSuccess();
        }, 2500);
      }
    }, 3800);
  };

  const handleRetryAssembly = () => {
    sound.playButtonClick();
    setTestState('idle');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between py-2">
      {/* Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/80 mb-3 shadow-lg">
        <div>
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            CHẶNG 4: THIẾT KẾ DÙ CỨU QUẢ CAPUAÇU &bull; NHIỆM VỤ TỔNG HỢP CUỐI CÙNG
          </div>
          <h2 className="text-base md:text-lg font-black text-white">
            {testState === 'idle' &&
              'Kéo 4 bộ phận vào đúng vị trí để hoàn thiện chiếc dù cứu quả capuaçu!'}
            {testState === 'testing' && 'ĐANG THỬ NGHIỆM THẢ RƠI TỪ TRÊN CAO...'}
            {testState === 'failed' && 'CHƯA ĐẠT! HÃY ĐIỀU CHỈNH LẠI BỘ PHẬN!'}
            {testState === 'success' && 'XUẤT SẮC! QUẢ CAPUAÇU ĐÃ TIẾP ĐẤT AN TOÀN!'}
          </h2>
        </div>

        {isFullyAssembled && testState === 'idle' && (
          <button
            type="button"
            id="start-parachute-test-btn"
            onClick={handleTestFlight}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm uppercase shadow-xl hover:scale-105 transition flex items-center gap-2 animate-bounce"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>THỬ NGHIỆM CHIẾC DÙ</span>
          </button>
        )}
      </div>

      {/* Main Assembly / Simulation Arena */}
      <div className="flex-1 flex items-center justify-center">
        {testState === 'idle' ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Parts Inventory Tray */}
            <div className="md:col-span-5 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                KHO BỘ PHẬN LẮP RÁP (CHÚ Ý BỘ PHẬN HỎNG):
              </div>
              <div className="grid grid-cols-2 gap-2.5 flex-1 items-center">
                {dragManager.items.map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => dragManager.registerItemRef(item.id, el)}
                    onMouseDown={(e) => dragManager.handleMouseDownItem(e, item.id)}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center select-none ${
                      item.isLocked
                        ? 'opacity-40 pointer-events-none border-emerald-500 bg-emerald-950/20'
                        : dragManager.activeDragId === item.id
                        ? 'opacity-30 border-dashed border-amber-400'
                        : 'bg-slate-800 border-slate-600 hover:border-amber-400 hover:scale-105 shadow-md'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] font-bold text-slate-200 mt-1">{item.label}</span>
                    {item.isLocked && (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ ĐÃ LẮP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Parachute Assembly Scaffold (Top to bottom) */}
            <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-700 shadow-xl flex flex-col gap-2.5 justify-between">
              {dragManager.dropZones.map((slot) => (
                <div
                  key={slot.id}
                  ref={(el) => dragManager.registerDropZoneRef(slot.id, el)}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between min-h-[64px] ${
                    dragManager.shakingTargetId === slot.id
                      ? 'border-red-500 bg-red-950/40 animate-shake'
                      : slot.lockedItem
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-dashed border-slate-600 bg-slate-950/50 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        dragManager.shakingTargetId === slot.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : slot.lockedItem
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-amber-300'
                      }`}
                    >
                      {dragManager.shakingTargetId === slot.id ? '✕' : slot.lockedItem ? '✓' : slot.title[0]}
                    </span>
                    <div>
                      <div className="text-xs font-black text-amber-300">{slot.title}</div>
                      <div className="text-[11px] text-slate-400">{slot.subtitle}</div>
                    </div>
                  </div>

                  <div className="min-w-[120px] flex items-center justify-center">
                    {dragManager.shakingTargetId === slot.id ? (
                      <span className="text-xs font-black text-rose-400 flex items-center gap-1 animate-pulse">
                        <span className="text-sm">✕</span> Chưa đúng vị trí!
                      </span>
                    ) : slot.lockedItem ? (
                      <div className="flex items-center gap-2">
                        {slot.lockedItem.icon}
                        <span className="text-xs font-bold text-emerald-200">
                          {slot.lockedItem.label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">Kéo bộ phận vào</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Flight Simulation Stage View */
          <div className="relative w-full max-w-3xl h-[420px] bg-gradient-to-b from-[#002776] via-[#0284c7] to-[#009c3b] rounded-3xl border-2 border-slate-700 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            {/* Upper Sky Altitude Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-amber-200 px-2">
              <span>Độ cao: 100m</span>
              <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-600 text-white">
                {testState === 'testing'
                  ? 'Gió cản không khí đang tác dụng...'
                  : testState === 'failed'
                  ? 'Thử nghiệm thất bại'
                  : 'Tiếp đất thành công!'}
              </span>
              <span>Mặt đất: 0m</span>
            </div>

            {/* Falling Parachute Payload Simulation */}
            <div className="relative flex-1 flex flex-col items-center justify-start overflow-hidden">
              <motion.div
                initial={{ y: 0, x: 0, rotate: 0 }}
                animate={
                  testState === 'testing'
                    ? {
                        // Smooth descending drift
                        y: [0, 60, 140, 220],
                        x: [0, -15, 15, 0],
                        rotate: [0, -6, 6, 0],
                      }
                    : testState === 'failed'
                    ? {
                        // Rapid plunge & tilt
                        y: 240,
                        rotate: 45,
                        x: 40,
                      }
                    : {
                        // Gently resting on ground
                        y: 220,
                        rotate: 0,
                        x: 0,
                      }
                }
                transition={
                  testState === 'failed'
                    ? { duration: 1.4, ease: 'easeIn' }
                    : { duration: 3.5, ease: 'easeInOut' }
                }
                className="flex flex-col items-center"
              >
                {/* Parachute Canopy */}
                <div className="filter drop-shadow-xl">
                  {canopySlot?.id === 'part-canopy-broken' ? (
                    <ParachuteCanopyIcon isBroken className="w-28 h-16" />
                  ) : (
                    <ParachuteCanopyIcon className="w-32 h-18 animate-pulse" />
                  )}
                </div>

                {/* Suspension Lines */}
                <div className="-mt-1 filter drop-shadow">
                  {linesSlot?.id === 'part-lines-tangled' ? (
                    <ParachuteLinesIcon isTangled className="w-24 h-16" />
                  ) : (
                    <ParachuteLinesIcon className="w-28 h-16" />
                  )}
                </div>

                {/* Cargo Basket & Fruit Payload */}
                <div className="-mt-4 relative flex items-center justify-center">
                  <CargoBasketIcon className="w-24 h-16" />
                  <div className="absolute top-2">
                    {testState === 'failed' ? (
                      <CapuacuFruit broken className="w-14 h-14" />
                    ) : (
                      <CapuacuFruit className="w-12 h-12" />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Ground Level */}
            <div className="w-full h-8 bg-gradient-to-t from-[#065f46] to-[#009c3b] rounded-2xl flex items-center justify-center border-t-2 border-emerald-300">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                MẶT ĐẤT KHU VỰC RỪNG BRAZIL
              </span>
            </div>

            {/* Failure Message Overlay & Instant Fix Button */}
            {testState === 'failed' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border-2 border-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-lg font-black text-red-400 uppercase">
                    HÃY KIỂM TRA LẠI TÁN DÙ VÀ DÂY DÙ!
                  </h3>
                  <p className="text-sm font-semibold text-slate-200">{failureReason}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRetryAssembly}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm uppercase flex items-center gap-2 shadow-xl hover:from-amber-300 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>SỬA LẠI CHIẾC DÙ NGAY</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Ghost Element */}
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
