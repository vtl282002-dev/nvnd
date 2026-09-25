import React, { useState, useEffect, useRef } from 'react';
import { useHandControl } from '../context/HandControlContext';
import { shuffleArray } from '../utils/shuffle';
import { sound } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';
import { FireworksCanvas } from './FireworksCanvas';
import {
  Sparkles,
  RotateCcw,
  Home,
  BookOpen,
  HelpCircle,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Camera,
  Trophy,
  Swords,
  CheckCircle,
  XCircle,
  X,
  Pause,
  Play,
  ArrowRight,
  Download,
} from 'lucide-react';

interface ArenaSlot {
  id: string;
  title: string;
  description: string;
  expectedItemId: string;
}

interface ArenaItem {
  id: string;
  label: string;
  description?: string;
  iconEmoji: string;
  targetSlotId: string;
}

interface RoundData {
  roundNumber: number;
  title: string;
  subtitle: string;
  slots: ArenaSlot[];
  items: ArenaItem[];
}

const VERSUS_ROUNDS: RoundData[] = [
  {
    roundNumber: 1,
    title: '4 BỘ PHẬN THIẾT KẾ DÙ CỨU QUẢ CAPUAÇU',
    subtitle: 'Đưa đúng 4 bộ phận kỹ thuật vào từng ô tương ứng để chiếc dù hoàn thiện!',
    slots: [
      {
        id: 'slot-canopy',
        title: 'Tán dù rộng (Vải Ripstop)',
        description: 'Tạo lực cản không khí đẩy lên',
        expectedItemId: 'item-canopy',
      },
      {
        id: 'slot-lines',
        title: 'Dây dù bền chắc (Dây treo)',
        description: 'Nối tán dù và giữ thăng bằng',
        expectedItemId: 'item-lines',
      },
      {
        id: 'slot-harness',
        title: 'Giá đỡ chống sốc (Đệm đỡ)',
        description: 'Hấp thụ va đập khi chạm đất',
        expectedItemId: 'item-harness',
      },
      {
        id: 'slot-payload',
        title: 'Quả Capuaçu (Hành khách)',
        description: 'Vật cần hạ cánh an toàn tuyệt đối',
        expectedItemId: 'item-payload',
      },
    ],
    items: [
      {
        id: 'item-canopy',
        label: 'Tán dù rộng',
        description: 'Vải Ripstop hứng khí',
        iconEmoji: '🪂',
        targetSlotId: 'slot-canopy',
      },
      {
        id: 'item-lines',
        label: 'Dây dù bền',
        description: 'Nối tán dù cân bằng',
        iconEmoji: '🧵',
        targetSlotId: 'slot-lines',
      },
      {
        id: 'item-harness',
        label: 'Giá đỡ chống sốc',
        description: 'Đệm bảo vệ đáy dù',
        iconEmoji: '🛡️',
        targetSlotId: 'slot-harness',
      },
      {
        id: 'item-payload',
        label: 'Quả Capuaçu',
        description: 'Trái cây cần bảo vệ',
        iconEmoji: '🍈',
        targetSlotId: 'slot-payload',
      },
    ],
  },
  {
    roundNumber: 2,
    title: 'TRỌNG LỰC & LỰC CẢN KHÔNG KHÍ',
    subtitle: 'Phân loại các hiện tượng vật lý tác động lên vật rơi!',
    slots: [
      {
        id: 'slot-gravity',
        title: 'Trọng lực (Lực hút)',
        description: 'Kéo vật rơi thẳng đứng xuống',
        expectedItemId: 'item-gravity',
      },
      {
        id: 'slot-air',
        title: 'Lực cản không khí',
        description: 'Đẩy tán dù lên trên',
        expectedItemId: 'item-air',
      },
      {
        id: 'slot-big-canopy',
        title: 'Tán dù diện tích lớn',
        description: 'Lực cản lớn, rơi rất chậm',
        expectedItemId: 'item-big-canopy',
      },
      {
        id: 'slot-small-canopy',
        title: 'Tán dù diện tích nhỏ',
        description: 'Lực cản ít, rơi nhanh dễ vỡ',
        expectedItemId: 'item-small-canopy',
      },
    ],
    items: [
      {
        id: 'item-gravity',
        label: 'Trọng lực',
        description: 'Kéo vật rơi xuống Trái Đất',
        iconEmoji: '⬇️',
        targetSlotId: 'slot-gravity',
      },
      {
        id: 'item-air',
        label: 'Lực cản không khí',
        description: 'Đẩy vật hướng lên trên',
        iconEmoji: '⬆️',
        targetSlotId: 'slot-air',
      },
      {
        id: 'item-big-canopy',
        label: 'Tán dù to',
        description: 'Rơi an toàn và êm ái',
        iconEmoji: '🟢',
        targetSlotId: 'slot-big-canopy',
      },
      {
        id: 'item-small-canopy',
        label: 'Tán dù nhỏ',
        description: 'Rơi nhanh nguy hiểm',
        iconEmoji: '🔴',
        targetSlotId: 'slot-small-canopy',
      },
    ],
  },
  {
    roundNumber: 3,
    title: 'SẢN PHẨM HÀNG KHÔNG VŨ TRỤ',
    subtitle: 'Nối các phương tiện kỹ thuật với nhiệm vụ tương ứng!',
    slots: [
      {
        id: 'slot-rocket',
        title: 'Tên lửa đẩy',
        description: 'Phóng vệ tinh vào quỹ đạo',
        expectedItemId: 'item-rocket',
      },
      {
        id: 'slot-sat',
        title: 'Vệ tinh nhân tạo',
        description: 'Quan sát rừng nhiệt đới Amazon',
        expectedItemId: 'item-sat',
      },
      {
        id: 'slot-shuttle',
        title: 'Tàu con thoi',
        description: 'Chở phi hành gia làm việc',
        expectedItemId: 'item-shuttle',
      },
      {
        id: 'slot-parachute',
        title: 'Chiếc dù hạ cánh',
        description: 'Đưa khoang đổ bộ tiếp đất',
        expectedItemId: 'item-parachute',
      },
    ],
    items: [
      {
        id: 'item-rocket',
        label: 'Tên lửa đẩy',
        description: 'Lực đẩy phản lực cực mạnh',
        iconEmoji: '🚀',
        targetSlotId: 'slot-rocket',
      },
      {
        id: 'item-sat',
        label: 'Vệ tinh',
        description: 'Bay quanh Trái Đất truyền tin',
        iconEmoji: '🛰️',
        targetSlotId: 'slot-sat',
      },
      {
        id: 'item-shuttle',
        label: 'Tàu không gian',
        description: 'Phương tiện nghiên cứu',
        iconEmoji: '🛸',
        targetSlotId: 'slot-shuttle',
      },
      {
        id: 'item-parachute',
        label: 'Dù hạ cánh',
        description: 'Tiếp đất an toàn',
        iconEmoji: '🪂',
        targetSlotId: 'slot-parachute',
      },
    ],
  },
];

interface VersusBattleArenaProps {
  onBackToMain: () => void;
  onOpenTeacherSettings?: () => void;
  teamAName?: string;
  teamBName?: string;
}

export const VersusBattleArena: React.FC<VersusBattleArenaProps> = ({
  onBackToMain,
  onOpenTeacherSettings,
  teamAName = 'ĐỘI 1 (PAULO)',
  teamBName = 'ĐỘI 2 (LUCAS)',
}) => {
  const {
    pointer1,
    pointer2,
    controlMode,
    cameraStatus,
    showCameraPreview,
    setShowCameraPreview,
    toggleControlMode,
  } = useHandControl();

  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const currentRound = VERSUS_ROUNDS[currentRoundIdx];

  // Scores
  const [scoreTeam1, setScoreTeam1] = useState<number>(0);
  const [scoreTeam2, setScoreTeam2] = useState<number>(0);

  // Completed slots for Team 1 and Team 2 (Slot ID -> Item)
  const [team1CompletedSlots, setTeam1CompletedSlots] = useState<Record<string, ArenaItem>>({});
  const [team2CompletedSlots, setTeam2CompletedSlots] = useState<Record<string, ArenaItem>>({});

  // Shuffled items for each team
  const [team1ShuffledItems, setTeam1ShuffledItems] = useState<ArenaItem[]>([]);
  const [team2ShuffledItems, setTeam2ShuffledItems] = useState<ArenaItem[]>([]);

  // Drag states for each team
  const [activeDragTeam1, setActiveDragTeam1] = useState<ArenaItem | null>(null);
  const [activeDragTeam2, setActiveDragTeam2] = useState<ArenaItem | null>(null);

  // Wrong slot visual feedback ("X" mark in slot when player drops incorrect item)
  const [wrongSlotTeam1, setWrongSlotTeam1] = useState<string | null>(null);
  const [wrongSlotTeam2, setWrongSlotTeam2] = useState<string | null>(null);
  const wrongTimeoutTeam1 = useRef<any>(null);
  const wrongTimeoutTeam2 = useRef<any>(null);

  // Audio & State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Victory & Feedback
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const autoAdvanceTimerRef = useRef<any>(null);

  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);

  // Refs for dropzones and items bounding boxes
  const slotRefsTeam1 = useRef<Map<string, HTMLDivElement>>(new Map());
  const slotRefsTeam2 = useRef<Map<string, HTMLDivElement>>(new Map());
  const itemRefsTeam1 = useRef<Map<string, HTMLDivElement>>(new Map());
  const itemRefsTeam2 = useRef<Map<string, HTMLDivElement>>(new Map());
  const grabStartTimeTeam1 = useRef<number>(0);
  const grabStartTimeTeam2 = useRef<number>(0);

  // Mouse drag coordinates for desktop fallback
  const [mouseDragPos, setMouseDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Advance to next round immediately
  const goToNextRound = () => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    setAutoAdvanceCountdown(null);
    setRoundWinner(null);
    if (currentRoundIdx < VERSUS_ROUNDS.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      onBackToMain();
    }
  };

  // Called as soon as 1 student/team completes all 4 slots
  const handleRoundComplete = (winnerName: string) => {
    sound.playStageClear();
    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);
    setRoundWinner(winnerName);

    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);

    // If there are more rounds, auto advance after 2.5 seconds
    if (currentRoundIdx < VERSUS_ROUNDS.length - 1) {
      let remaining = 3;
      setAutoAdvanceCountdown(remaining);
      autoAdvanceTimerRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(autoAdvanceTimerRef.current);
          setAutoAdvanceCountdown(null);
          setRoundWinner(null);
          setCurrentRoundIdx((prev) => prev + 1);
        } else {
          setAutoAdvanceCountdown(remaining);
        }
      }, 1000);
    }
  };

  // Initialize and shuffle round items for both teams
  const initRound = (roundIdx: number) => {
    const round = VERSUS_ROUNDS[roundIdx];
    if (wrongTimeoutTeam1.current) clearTimeout(wrongTimeoutTeam1.current);
    if (wrongTimeoutTeam2.current) clearTimeout(wrongTimeoutTeam2.current);
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    setAutoAdvanceCountdown(null);
    setWrongSlotTeam1(null);
    setWrongSlotTeam2(null);
    setTeam1ShuffledItems(shuffleArray(round.items));
    setTeam2ShuffledItems(shuffleArray(round.items));
    setTeam1CompletedSlots({});
    setTeam2CompletedSlots({});
    setActiveDragTeam1(null);
    setActiveDragTeam2(null);
    setRoundWinner(null);
  };

  useEffect(() => {
    initRound(currentRoundIdx);
  }, [currentRoundIdx]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
      if (wrongTimeoutTeam1.current) clearTimeout(wrongTimeoutTeam1.current);
      if (wrongTimeoutTeam2.current) clearTimeout(wrongTimeoutTeam2.current);
    };
  }, []);

  // Audio Toggle
  const toggleSound = () => {
    const next = sound.toggleMute();
    setSoundOn(!next);
  };

  // --- Hand 1 Interaction Logic (Team 1) ---
  useEffect(() => {
    if (isPaused || roundWinner || controlMode !== 'gesture') return;

    // 1. SELECT (✊ Nắm tay để chọn thẻ)
    if (pointer1.gesture === 'fist' && !activeDragTeam1) {
      for (const [id, el] of itemRefsTeam1.current.entries()) {
        const item = team1ShuffledItems.find((i) => i.id === id);
        if (item && !team1CompletedSlots[item.targetSlotId]) {
          const rect = el.getBoundingClientRect();
          const padding = 20;
          if (
            pointer1.x >= rect.left - padding &&
            pointer1.x <= rect.right + padding &&
            pointer1.y >= rect.top - padding &&
            pointer1.y <= rect.bottom + padding
          ) {
            sound.playGrab();
            setActiveDragTeam1(item);
            grabStartTimeTeam1.current = Date.now();
            break;
          }
        }
      }
    }

    // 2. DROP (✋ Xoè tay để thả vào ô, hoặc 👍 Like, hoặc nhả nắm tay)
    const isDropGesture1 =
      pointer1.gesture === 'open' || pointer1.gesture === 'thumbs_up' || !pointer1.isGrabbing || pointer1.gesture !== 'fist';

    if (isDropGesture1 && activeDragTeam1) {
      if (Date.now() - grabStartTimeTeam1.current > 120) {
        let matchedSlotId: string | null = null;
        let minDistance = Infinity;
        const PADDING = 45;

        // Bounding box with padding + distance check
        for (const [slotId, el] of slotRefsTeam1.current.entries()) {
          const rect = el.getBoundingClientRect();
          if (
            pointer1.x >= rect.left - PADDING &&
            pointer1.x <= rect.right + PADDING &&
            pointer1.y >= rect.top - PADDING &&
            pointer1.y <= rect.bottom + PADDING
          ) {
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;
            const dist = Math.hypot(pointer1.x - centerX, pointer1.y - centerY);
            if (dist < minDistance) {
              minDistance = dist;
              matchedSlotId = slotId;
            }
          }
        }

        // Fallback distance check
        if (!matchedSlotId) {
          for (const [slotId, el] of slotRefsTeam1.current.entries()) {
            const rect = el.getBoundingClientRect();
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;
            const dist = Math.hypot(pointer1.x - centerX, pointer1.y - centerY);
            if (dist < 110 && dist < minDistance) {
              minDistance = dist;
              matchedSlotId = slotId;
            }
          }
        }

        if (matchedSlotId && matchedSlotId === activeDragTeam1.targetSlotId) {
          // Đúng ô đáp án! Đẩy vào ô ngay lập tức
          sound.playCorrect();
          launchConfetti(pointer1.x, pointer1.y, 40);
          setScoreTeam1((prev) => prev + 10);
          setTeam1CompletedSlots((prev) => ({ ...prev, [matchedSlotId!]: activeDragTeam1 }));
          setWrongSlotTeam1((prev) => (prev === matchedSlotId ? null : prev));

          // Kiểm tra nếu Đội 1 hoàn thành cả 4 ô -> Hoàn thành nhiệm vụ chuyển chặng mới
          const nextCompletedCount = Object.keys(team1CompletedSlots).length + 1;
          if (nextCompletedCount >= 4) {
            handleRoundComplete(teamAName);
          }
        } else if (matchedSlotId) {
          // Sai ô -> Hiển thị dấu X cảnh báo trong ô đáp án bị chọn sai!
          sound.playIncorrect();
          if (wrongTimeoutTeam1.current) clearTimeout(wrongTimeoutTeam1.current);
          setWrongSlotTeam1(matchedSlotId);
          wrongTimeoutTeam1.current = setTimeout(() => {
            setWrongSlotTeam1(null);
          }, 1500);
        } else {
          // Thả ngoài ô
          sound.playDrop();
        }
        setActiveDragTeam1(null);
      }
    }
  }, [pointer1, activeDragTeam1, team1ShuffledItems, team1CompletedSlots, isPaused, roundWinner, teamAName]);

  // --- Hand 2 Interaction Logic (Team 2) ---
  useEffect(() => {
    if (isPaused || roundWinner || controlMode !== 'gesture') return;

    // 1. SELECT (✊ Nắm tay để chọn thẻ)
    if (pointer2.gesture === 'fist' && !activeDragTeam2) {
      for (const [id, el] of itemRefsTeam2.current.entries()) {
        const item = team2ShuffledItems.find((i) => i.id === id);
        if (item && !team2CompletedSlots[item.targetSlotId]) {
          const rect = el.getBoundingClientRect();
          const padding = 20;
          if (
            pointer2.x >= rect.left - padding &&
            pointer2.x <= rect.right + padding &&
            pointer2.y >= rect.top - padding &&
            pointer2.y <= rect.bottom + padding
          ) {
            sound.playGrab();
            setActiveDragTeam2(item);
            grabStartTimeTeam2.current = Date.now();
            break;
          }
        }
      }
    }

    // 2. DROP (✋ Xoè tay để thả vào ô, hoặc 👍 Like, hoặc nhả nắm tay)
    const isDropGesture2 =
      pointer2.gesture === 'open' || pointer2.gesture === 'thumbs_up' || !pointer2.isGrabbing || pointer2.gesture !== 'fist';

    if (isDropGesture2 && activeDragTeam2) {
      if (Date.now() - grabStartTimeTeam2.current > 120) {
        let matchedSlotId: string | null = null;
        let minDistance = Infinity;
        const PADDING = 45;

        for (const [slotId, el] of slotRefsTeam2.current.entries()) {
          const rect = el.getBoundingClientRect();
          if (
            pointer2.x >= rect.left - PADDING &&
            pointer2.x <= rect.right + PADDING &&
            pointer2.y >= rect.top - PADDING &&
            pointer2.y <= rect.bottom + PADDING
          ) {
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;
            const dist = Math.hypot(pointer2.x - centerX, pointer2.y - centerY);
            if (dist < minDistance) {
              minDistance = dist;
              matchedSlotId = slotId;
            }
          }
        }

        if (!matchedSlotId) {
          for (const [slotId, el] of slotRefsTeam2.current.entries()) {
            const rect = el.getBoundingClientRect();
            const centerX = (rect.left + rect.right) / 2;
            const centerY = (rect.top + rect.bottom) / 2;
            const dist = Math.hypot(pointer2.x - centerX, pointer2.y - centerY);
            if (dist < 110 && dist < minDistance) {
              minDistance = dist;
              matchedSlotId = slotId;
            }
          }
        }

        if (matchedSlotId && matchedSlotId === activeDragTeam2.targetSlotId) {
          // Đúng ô đáp án! Đẩy vào ô ngay lập tức
          sound.playCorrect();
          launchConfetti(pointer2.x, pointer2.y, 40);
          setScoreTeam2((prev) => prev + 10);
          setTeam2CompletedSlots((prev) => ({ ...prev, [matchedSlotId!]: activeDragTeam2 }));
          setWrongSlotTeam2((prev) => (prev === matchedSlotId ? null : prev));

          // Kiểm tra nếu Đội 2 hoàn thành cả 4 ô -> Hoàn thành nhiệm vụ chuyển chặng mới
          const nextCompletedCount = Object.keys(team2CompletedSlots).length + 1;
          if (nextCompletedCount >= 4) {
            handleRoundComplete(teamBName);
          }
        } else if (matchedSlotId) {
          // Sai ô -> Hiển thị dấu X cảnh báo trong ô đáp án bị chọn sai!
          sound.playIncorrect();
          if (wrongTimeoutTeam2.current) clearTimeout(wrongTimeoutTeam2.current);
          setWrongSlotTeam2(matchedSlotId);
          wrongTimeoutTeam2.current = setTimeout(() => {
            setWrongSlotTeam2(null);
          }, 1500);
        } else {
          // Thả ngoài ô
          sound.playDrop();
        }
        setActiveDragTeam2(null);
      }
    }
  }, [pointer2, activeDragTeam2, team2ShuffledItems, team2CompletedSlots, isPaused, roundWinner, teamBName]);

  // Mouse Handlers for Desktop Drag Fallback (Throttled with requestAnimationFrame)
  const handleMouseDownTeam1 = (e: React.MouseEvent, item: ArenaItem) => {
    if (team1CompletedSlots[item.targetSlotId]) return;
    sound.playGrab();
    setActiveDragTeam1(item);
    setMouseDragPos({ x: e.clientX, y: e.clientY });

    let rafId: number | null = null;
    let lastX = e.clientX;
    let lastY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMouseDragPos({ x: lastX, y: lastY });
        });
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      let matchedSlotId: string | null = null;
      let minDistance = Infinity;
      const PADDING = 45;

      for (const [slotId, el] of slotRefsTeam1.current.entries()) {
        const rect = el.getBoundingClientRect();
        if (
          upEvent.clientX >= rect.left - PADDING &&
          upEvent.clientX <= rect.right + PADDING &&
          upEvent.clientY >= rect.top - PADDING &&
          upEvent.clientY <= rect.bottom + PADDING
        ) {
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(upEvent.clientX - centerX, upEvent.clientY - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            matchedSlotId = slotId;
          }
        }
      }

      if (!matchedSlotId) {
        for (const [slotId, el] of slotRefsTeam1.current.entries()) {
          const rect = el.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(upEvent.clientX - centerX, upEvent.clientY - centerY);
          if (dist < 110 && dist < minDistance) {
            minDistance = dist;
            matchedSlotId = slotId;
          }
        }
      }

      if (matchedSlotId && matchedSlotId === item.targetSlotId) {
        sound.playCorrect();
        launchConfetti(upEvent.clientX, upEvent.clientY, 40);
        setScoreTeam1((prev) => prev + 10);
        setTeam1CompletedSlots((prev) => ({ ...prev, [matchedSlotId!]: item }));
        setWrongSlotTeam1((prev) => (prev === matchedSlotId ? null : prev));
        if (Object.keys(team1CompletedSlots).length + 1 >= 4) {
          handleRoundComplete(teamAName);
        }
      } else if (matchedSlotId) {
        sound.playIncorrect();
        if (wrongTimeoutTeam1.current) clearTimeout(wrongTimeoutTeam1.current);
        setWrongSlotTeam1(matchedSlotId);
        wrongTimeoutTeam1.current = setTimeout(() => {
          setWrongSlotTeam1(null);
        }, 1500);
      } else {
        sound.playDrop();
      }
      setActiveDragTeam1(null);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleMouseDownTeam2 = (e: React.MouseEvent, item: ArenaItem) => {
    if (team2CompletedSlots[item.targetSlotId]) return;
    sound.playGrab();
    setActiveDragTeam2(item);
    setMouseDragPos({ x: e.clientX, y: e.clientY });

    let rafId: number | null = null;
    let lastX = e.clientX;
    let lastY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMouseDragPos({ x: lastX, y: lastY });
        });
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      let matchedSlotId: string | null = null;
      let minDistance = Infinity;
      const PADDING = 45;

      for (const [slotId, el] of slotRefsTeam2.current.entries()) {
        const rect = el.getBoundingClientRect();
        if (
          upEvent.clientX >= rect.left - PADDING &&
          upEvent.clientX <= rect.right + PADDING &&
          upEvent.clientY >= rect.top - PADDING &&
          upEvent.clientY <= rect.bottom + PADDING
        ) {
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(upEvent.clientX - centerX, upEvent.clientY - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            matchedSlotId = slotId;
          }
        }
      }

      if (!matchedSlotId) {
        for (const [slotId, el] of slotRefsTeam2.current.entries()) {
          const rect = el.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(upEvent.clientX - centerX, upEvent.clientY - centerY);
          if (dist < 110 && dist < minDistance) {
            minDistance = dist;
            matchedSlotId = slotId;
          }
        }
      }

      if (matchedSlotId && matchedSlotId === item.targetSlotId) {
        sound.playCorrect();
        launchConfetti(upEvent.clientX, upEvent.clientY, 40);
        setScoreTeam2((prev) => prev + 10);
        setTeam2CompletedSlots((prev) => ({ ...prev, [matchedSlotId!]: item }));
        setWrongSlotTeam2((prev) => (prev === matchedSlotId ? null : prev));
        if (Object.keys(team2CompletedSlots).length + 1 >= 4) {
          handleRoundComplete(teamBName);
        }
      } else if (matchedSlotId) {
        sound.playIncorrect();
        if (wrongTimeoutTeam2.current) clearTimeout(wrongTimeoutTeam2.current);
        setWrongSlotTeam2(matchedSlotId);
        wrongTimeoutTeam2.current = setTimeout(() => {
          setWrongSlotTeam2(null);
        }, 1500);
      } else {
        sound.playDrop();
      }
      setActiveDragTeam2(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      id="versus-battle-arena"
      className="relative w-full h-full flex flex-col justify-between bg-slate-950/80 p-2 md:p-3 overflow-hidden select-none"
    >
      {/* 1. Header Bar (Matching image.png exactly) */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-2 md:p-2.5 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Topic Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg flex-shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">
                  NHIỆM VỤ NHẢY DÙ CỦA PAULO 🪂
                </h1>
                <span className="hidden lg:inline text-xs text-amber-300">💡 🇧🇷</span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold">
                STEM Khoa học Lớp 3 • Đấu trường tương tác tay không
              </p>
            </div>
          </div>

          {/* Central Match Score & Timer (Matching image.png header) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Team 1 Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-sky-500/50 shadow-inner">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
              <div className="text-right">
                <div className="text-[10px] font-black text-cyan-300 uppercase">ĐỘI 1</div>
                <div className="text-lg md:text-2xl font-black text-cyan-200 leading-none">
                  {scoreTeam1}
                  <span className="text-xs text-slate-400 font-normal">/40</span>
                </div>
              </div>
            </div>

            {/* Pause / Resume Button */}
            <button
              type="button"
              id="versus-pause-btn"
              onClick={() => {
                sound.playButtonClick();
                setIsPaused(!isPaused);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs md:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              {isPaused ? <Play className="w-4 h-4 fill-slate-950" /> : <Pause className="w-4 h-4 fill-slate-950" />}
              <span className="hidden sm:inline">{isPaused ? 'TIẾP TỤC' : 'TẠM DỪNG'}</span>
            </button>

            {/* Chặng thi đấu Badge (Thay thế đồng hồ đếm ngược) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/50 shadow-inner">
              <span className="text-xl">🎯</span>
              <div className="text-center">
                <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest leading-none">
                  CHẶNG {currentRoundIdx + 1}/4
                </div>
                <div className="text-xs font-bold text-white line-clamp-1 max-w-[120px] md:max-w-[180px] mt-0.5">
                  {currentRound.title}
                </div>
              </div>
            </div>

            {/* Team 2 Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/50 shadow-inner">
              <div className="text-left">
                <div className="text-[10px] font-black text-amber-300 uppercase">ĐỘI 2</div>
                <div className="text-lg md:text-2xl font-black text-amber-200 leading-none">
                  {scoreTeam2}
                  <span className="text-xs text-slate-400 font-normal">/40</span>
                </div>
              </div>
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Sub-bar Control Buttons (Matching image.png: MÀN HÌNH CHÍNH, Camera tay, Camera, Âm thanh, Kiến thức, Hướng dẫn, Cài đặt, Chơi lại) */}
        <div className="flex items-center justify-between gap-1.5 border-t border-slate-800/80 pt-1.5 text-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="back-home-btn"
              onClick={() => {
                sound.playButtonClick();
                onBackToMain();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white font-bold flex items-center gap-1 shadow transition text-[11px]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MÀN HÌNH CHÍNH</span>
            </button>

            <button
              type="button"
              id="toggle-control-btn"
              onClick={() => {
                sound.playButtonClick();
                toggleControlMode();
              }}
              className={`px-2.5 py-1.5 rounded-xl border font-bold flex items-center gap-1 transition text-[11px] ${
                controlMode === 'gesture'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cameraStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              <span>{controlMode === 'gesture' ? 'Camera tay: OK' : 'Điều khiển Chuột'}</span>
            </button>

            <button
              type="button"
              id="toggle-camera-preview-btn"
              onClick={() => {
                sound.playButtonClick();
                setShowCameraPreview(!showCameraPreview);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-500/40 font-bold flex items-center gap-1 transition text-[11px]"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-300" />
              <span>Camera</span>
            </button>

            <button
              type="button"
              id="toggle-sound-btn"
              onClick={toggleSound}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundOn ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-knowledge-modal"
              onClick={() => {
                sound.playButtonClick();
                setShowKnowledgeModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>Kiến thức</span>
            </button>

            <button
              type="button"
              id="btn-guide-modal"
              onClick={() => {
                sound.playButtonClick();
                setShowGuideModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Hướng dẫn</span>
            </button>

            {onOpenTeacherSettings && (
              <button
                type="button"
                id="btn-settings-modal"
                onClick={() => {
                  sound.playButtonClick();
                  onOpenTeacherSettings();
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              id="btn-replay-round"
              onClick={() => {
                sound.playButtonClick();
                initRound(currentRoundIdx);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chơi lại</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Dual Split Arena (Matching image.png structure) */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 my-2 items-stretch min-h-0 relative">
        {/* Central VS Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex flex-col items-center justify-center">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-black text-xs shadow-2xl flex flex-col items-center">
            <span className="text-amber-400 text-sm">⚡ VS ⚡</span>
            <span className="text-[9px] tracking-widest uppercase">ĐỐI KHÁNG</span>
          </div>
        </div>

        {/* --- LEFT COLUMN: ĐỘI 1 (PAULO - CYAN / BLUE) --- */}
        <div
          id="team1-side-arena"
          className="bg-slate-900/80 backdrop-blur-md rounded-3xl border-2 border-cyan-500/50 p-3 md:p-4 flex flex-col justify-between gap-3 shadow-2xl relative"
        >
          {/* Team 1 Title Banner */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xl">🔵</span>
                <h2 className="text-base md:text-lg font-black text-cyan-300 uppercase tracking-tight">
                  {teamAName}
                </h2>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-950 border border-cyan-400 text-white font-black text-sm md:text-base">
                <span className="text-xs text-slate-400 mr-1.5 font-bold">ĐIỂM:</span>
                <span className="text-cyan-300">{scoreTeam1}</span>
                <span className="text-xs text-slate-500">/40</span>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 mb-3">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>4 Ô ĐÁP ÁN (✊ NẮM ĐỂ CHỌN → ✋ XOÈ TAY ĐỂ THẢ)</span>
              </span>
              <span className="text-emerald-400 font-black">+10 điểm / ô đúng</span>
            </div>

            {/* 4 Answer Drop Zones (Team 1) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2">
              {currentRound.slots.map((slot) => {
                const lockedItem = team1CompletedSlots[slot.id];
                const isWrong = wrongSlotTeam1 === slot.id;
                return (
                  <div
                    key={slot.id}
                    ref={(el) => {
                      if (el) slotRefsTeam1.current.set(slot.id, el);
                      else slotRefsTeam1.current.delete(slot.id);
                    }}
                    className={`rounded-2xl md:rounded-3xl p-3 md:p-3.5 border-2 transition-all flex flex-col justify-between min-h-[175px] md:min-h-[195px] text-center select-none shadow-lg relative overflow-hidden ${
                      isWrong
                        ? 'border-rose-500 bg-rose-950/70 shadow-rose-500/50 ring-2 ring-rose-500 animate-shake'
                        : lockedItem
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg'
                        : 'border-slate-700 bg-slate-950/80 hover:border-cyan-400/80'
                    }`}
                  >
                    {/* Header Slot Status */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-1.5 border shadow-sm transition-colors ${
                          isWrong
                            ? 'bg-rose-500/30 text-rose-300 border-rose-400 animate-pulse'
                            : lockedItem
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50'
                            : 'bg-slate-800 text-cyan-400 border-slate-700'
                        }`}
                      >
                        {isWrong ? (
                          <X className="w-6 h-6 text-rose-300 stroke-[3] animate-bounce" />
                        ) : lockedItem ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Download className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors ${
                          isWrong ? 'text-rose-300' : 'text-slate-300'
                        }`}
                      >
                        {isWrong ? 'CHƯA ĐÚNG!' : 'Ô ĐÁP ÁN'}
                      </span>
                    </div>

                    {/* Slot Name or Completed Item or Wrong Indicator */}
                    {isWrong ? (
                      <div className="py-2 flex-1 flex flex-col items-center justify-center animate-pulse">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-1.5 shadow-lg">
                          <X className="w-8 h-8 stroke-[3]" />
                        </div>
                        <div className="text-xs md:text-sm font-black text-rose-300">
                          SAI VỊ TRÍ!
                        </div>
                        <div className="text-[10px] text-rose-200/90 font-medium">
                          Thử chọn thẻ khác nhé
                        </div>
                      </div>
                    ) : lockedItem ? (
                      <div className="py-1.5 flex-1 flex flex-col items-center justify-center">
                        <span className="text-3xl md:text-4xl filter drop-shadow">{lockedItem.iconEmoji}</span>
                        <div className="text-xs md:text-sm font-black text-emerald-300 mt-1 line-clamp-1">
                          {lockedItem.label}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-200/90 mt-0.5">✓ HOÀN THÀNH</div>
                      </div>
                    ) : (
                      <div className="py-2 flex-1 flex flex-col items-center justify-center">
                        <div className="text-xs md:text-sm font-bold text-slate-200 leading-snug px-1 text-center">
                          {slot.description}
                        </div>
                      </div>
                    )}

                    <div className="pt-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wide transition-colors ${
                          isWrong
                            ? 'bg-rose-900/90 text-rose-100 border border-rose-400 shadow-md'
                            : lockedItem
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isWrong ? '✕ CHỌN LẠI' : lockedItem ? '+10 ĐIỂM' : 'THẢ VÀO ĐÂY'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shuffled Choice Items (Team 1) */}
          <div className="bg-slate-950/80 p-3 md:p-4 rounded-3xl border border-slate-800 shadow-xl">
            <div className="text-xs md:text-sm font-black text-cyan-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <span>CÁC THẺ LỰA CHỌN CỦA ĐỘI 1 (ĐÃ XÁO TRỘN):</span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                ✊ Nắm tay để kéo thẻ
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {team1ShuffledItems.map((item) => {
                const isLocked = Boolean(team1CompletedSlots[item.targetSlotId]);
                const isDragging = activeDragTeam1?.id === item.id;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) itemRefsTeam1.current.set(item.id, el);
                      else itemRefsTeam1.current.delete(item.id);
                    }}
                    onMouseDown={(e) => handleMouseDownTeam1(e, item)}
                    className={`p-3 md:p-3.5 rounded-2xl md:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing select-none min-h-[135px] md:min-h-[155px] ${
                      isLocked
                        ? 'opacity-30 border-emerald-500 bg-emerald-950/20 pointer-events-none'
                        : isDragging
                        ? 'opacity-40 border-dashed border-cyan-400 scale-95'
                        : 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:scale-105 shadow-md hover:shadow-cyan-500/20'
                    }`}
                  >
                    <span className="text-3xl md:text-4xl mb-1.5 filter drop-shadow">{item.iconEmoji}</span>
                    <span className="text-xs md:text-sm font-black text-white leading-tight">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-[10px] md:text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {item.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: ĐỘI 2 (LUCAS - AMBER / ORANGE) --- */}
        <div
          id="team2-side-arena"
          className="bg-slate-900/80 backdrop-blur-md rounded-3xl border-2 border-amber-500/50 p-3 md:p-4 flex flex-col justify-between gap-3 shadow-2xl relative"
        >
          {/* Team 2 Title Banner */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xl">🟠</span>
                <h2 className="text-base md:text-lg font-black text-amber-300 uppercase tracking-tight">
                  {teamBName}
                </h2>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-950 border border-amber-400 text-white font-black text-sm md:text-base">
                <span className="text-xs text-slate-400 mr-1.5 font-bold">ĐIỂM:</span>
                <span className="text-amber-300">{scoreTeam2}</span>
                <span className="text-xs text-slate-500">/40</span>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 mb-3">
              <span className="text-amber-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>4 Ô ĐÁP ÁN (✊ NẮM ĐỂ CHỌN → ✋ XOÈ TAY ĐỂ THẢ)</span>
              </span>
              <span className="text-emerald-400 font-black">+10 điểm / ô đúng</span>
            </div>

            {/* 4 Answer Drop Zones (Team 2) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2">
              {currentRound.slots.map((slot) => {
                const lockedItem = team2CompletedSlots[slot.id];
                const isWrong = wrongSlotTeam2 === slot.id;
                return (
                  <div
                    key={slot.id}
                    ref={(el) => {
                      if (el) slotRefsTeam2.current.set(slot.id, el);
                      else slotRefsTeam2.current.delete(slot.id);
                    }}
                    className={`rounded-2xl md:rounded-3xl p-3 md:p-3.5 border-2 transition-all flex flex-col justify-between min-h-[175px] md:min-h-[195px] text-center select-none shadow-lg relative overflow-hidden ${
                      isWrong
                        ? 'border-rose-500 bg-rose-950/70 shadow-rose-500/50 ring-2 ring-rose-500 animate-shake'
                        : lockedItem
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg'
                        : 'border-slate-700 bg-slate-950/80 hover:border-amber-400/80'
                    }`}
                  >
                    {/* Header Slot Status */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-1.5 border shadow-sm transition-colors ${
                          isWrong
                            ? 'bg-rose-500/30 text-rose-300 border-rose-400 animate-pulse'
                            : lockedItem
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50'
                            : 'bg-slate-800 text-amber-400 border-slate-700'
                        }`}
                      >
                        {isWrong ? (
                          <X className="w-6 h-6 text-rose-300 stroke-[3] animate-bounce" />
                        ) : lockedItem ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Download className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors ${
                          isWrong ? 'text-rose-300' : 'text-slate-300'
                        }`}
                      >
                        {isWrong ? 'CHƯA ĐÚNG!' : 'Ô ĐÁP ÁN'}
                      </span>
                    </div>

                    {/* Slot Name or Completed Item or Wrong Indicator */}
                    {isWrong ? (
                      <div className="py-2 flex-1 flex flex-col items-center justify-center animate-pulse">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-1.5 shadow-lg">
                          <X className="w-8 h-8 stroke-[3]" />
                        </div>
                        <div className="text-xs md:text-sm font-black text-rose-300">
                          SAI VỊ TRÍ!
                        </div>
                        <div className="text-[10px] text-rose-200/90 font-medium">
                          Thử chọn thẻ khác nhé
                        </div>
                      </div>
                    ) : lockedItem ? (
                      <div className="py-1.5 flex-1 flex flex-col items-center justify-center">
                        <span className="text-3xl md:text-4xl filter drop-shadow">{lockedItem.iconEmoji}</span>
                        <div className="text-xs md:text-sm font-black text-emerald-300 mt-1 line-clamp-1">
                          {lockedItem.label}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-200/90 mt-0.5">✓ HOÀN THÀNH</div>
                      </div>
                    ) : (
                      <div className="py-2 flex-1 flex flex-col items-center justify-center">
                        <div className="text-xs md:text-sm font-bold text-slate-200 leading-snug px-1 text-center">
                          {slot.description}
                        </div>
                      </div>
                    )}

                    <div className="pt-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wide transition-colors ${
                          isWrong
                            ? 'bg-rose-900/90 text-rose-100 border border-rose-400 shadow-md'
                            : lockedItem
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isWrong ? '✕ CHỌN LẠI' : lockedItem ? '+10 ĐIỂM' : 'THẢ VÀO ĐÂY'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shuffled Choice Items (Team 2) */}
          <div className="bg-slate-950/80 p-3 md:p-4 rounded-3xl border border-slate-800 shadow-xl">
            <div className="text-xs md:text-sm font-black text-amber-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <span>CÁC THẺ LỰA CHỌN CỦA ĐỘI 2 (ĐÃ XÁO TRỘN):</span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                ✊ Nắm tay để kéo thẻ
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {team2ShuffledItems.map((item) => {
                const isLocked = Boolean(team2CompletedSlots[item.targetSlotId]);
                const isDragging = activeDragTeam2?.id === item.id;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) itemRefsTeam2.current.set(item.id, el);
                      else itemRefsTeam2.current.delete(item.id);
                    }}
                    onMouseDown={(e) => handleMouseDownTeam2(e, item)}
                    className={`p-3 md:p-3.5 rounded-2xl md:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing select-none min-h-[135px] md:min-h-[155px] ${
                      isLocked
                        ? 'opacity-30 border-emerald-500 bg-emerald-950/20 pointer-events-none'
                        : isDragging
                        ? 'opacity-40 border-dashed border-amber-400 scale-95'
                        : 'bg-slate-900 border-slate-700 hover:border-amber-400 hover:scale-105 shadow-md hover:shadow-amber-500/20'
                    }`}
                  >
                    <span className="text-3xl md:text-4xl mb-1.5 filter drop-shadow">{item.iconEmoji}</span>
                    <span className="text-xs md:text-sm font-black text-white leading-tight">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-[10px] md:text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {item.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Ghost Element when Dragging for Team 1 */}
      {activeDragTeam1 && (
        <div
          className="fixed pointer-events-none z-[10000] will-change-transform transition-none"
          style={{
            transform: `translate3d(${controlMode === 'mouse' ? mouseDragPos.x : pointer1.x}px, ${controlMode === 'mouse' ? mouseDragPos.y : pointer1.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          <div className="bg-cyan-400 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl border-2 border-white scale-110 flex items-center gap-2.5 font-black text-sm">
            <span className="text-3xl">{activeDragTeam1.iconEmoji}</span>
            <div>
              <div className="leading-tight">{activeDragTeam1.label}</div>
              <div className="text-[10px] font-bold text-slate-900/80">✋ Xoè tay để thả vào ô</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Ghost Element when Dragging for Team 2 */}
      {activeDragTeam2 && (
        <div
          className="fixed pointer-events-none z-[10000] will-change-transform transition-none"
          style={{
            transform: `translate3d(${controlMode === 'mouse' ? mouseDragPos.x : pointer2.x}px, ${controlMode === 'mouse' ? mouseDragPos.y : pointer2.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          <div className="bg-amber-400 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl border-2 border-white scale-110 flex items-center gap-2.5 font-black text-sm">
            <span className="text-3xl">{activeDragTeam2.iconEmoji}</span>
            <div>
              <div className="leading-tight">{activeDragTeam2.label}</div>
              <div className="text-[10px] font-bold text-slate-900/80">✋ Xoè tay để thả vào ô</div>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal when 1 student/team completes 4 slots */}
      {roundWinner && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <FireworksCanvas />
          <div className="relative z-10 bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl animate-scale-up space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-4xl shadow-xl animate-bounce">
              🏆
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-widest">
                {currentRoundIdx < VERSUS_ROUNDS.length - 1
                  ? `HOÀN THÀNH CHẶNG ${currentRoundIdx + 1}/4!`
                  : 'HOÀN THÀNH TOÀN BỘ 4 CHẶNG!'}
              </div>
              <h3 className="text-2xl font-black text-white mt-1 uppercase">
                🎉 {roundWinner} XUẤT SẮC VỀ ĐÍCH!
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2 font-medium">
                Đã hoàn thành xuất sắc 4 ô đáp án STEM của <strong>{currentRound.title}</strong>!
              </p>
            </div>

            {/* Score Comparison */}
            <div className="flex items-center justify-center gap-6 py-3 border-y border-slate-800 bg-slate-950/50 rounded-2xl">
              <div className="text-center">
                <div className="text-xs text-cyan-300 font-extrabold uppercase">{teamAName}</div>
                <div className="text-2xl font-black text-white">{scoreTeam1} điểm</div>
                {roundWinner === teamAName && (
                  <span className="inline-block mt-1 text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    👑 VỀ ĐÍCH TRƯỚC
                  </span>
                )}
              </div>
              <div className="text-slate-500 font-black text-lg">VS</div>
              <div className="text-center">
                <div className="text-xs text-amber-300 font-extrabold uppercase">{teamBName}</div>
                <div className="text-2xl font-black text-white">{scoreTeam2} điểm</div>
                {roundWinner === teamBName && (
                  <span className="inline-block mt-1 text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    👑 VỀ ĐÍCH TRƯỚC
                  </span>
                )}
              </div>
            </div>

            {/* Auto-advance banner */}
            {currentRoundIdx < VERSUS_ROUNDS.length - 1 && autoAdvanceCountdown !== null && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center gap-2 animate-pulse">
                <span className="text-lg">🚀</span>
                <span className="text-xs md:text-sm font-black text-amber-300">
                  Tự động qua Chặng {currentRoundIdx + 2} sau {autoAdvanceCountdown}s...
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
                  setAutoAdvanceCountdown(null);
                  initRound(currentRoundIdx);
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Đấu lại chặng này
              </button>
              {currentRoundIdx < VERSUS_ROUNDS.length - 1 ? (
                <button
                  type="button"
                  onClick={goToNextRound}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs md:text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <span>Qua chặng mới ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBackToMain}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm transition shadow-lg active:scale-95"
                >
                  Kết thúc trận đấu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full text-white shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-amber-300 uppercase">
                HƯỚNG DẪN ĐẤU TRƯỜNG ĐỐI KHÁNG
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <p>• <strong>Bàn tay trái / Đội 1:</strong> Điều khiển nửa màn hình bên trái màu Xanh Cyan.</p>
              <p>• <strong>Bàn tay phải / Đội 2:</strong> Điều khiển nửa màn hình bên phải màu Vàng Cam.</p>
              <p>• <strong>3 Cử chỉ chuẩn:</strong> Nắm tay (✊) để chọn thẻ → Xoè tay (✋) để di chuyển thẻ → Giơ ngón cái Like (👍) vào ô để thả!</p>
              <p>• <strong>Chuột máy tính:</strong> Nhấn giữ chuột trái vào thẻ và kéo thả vào ô tương ứng.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}

      {/* Knowledge Modal */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full text-white shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-cyan-300 uppercase">
                KIẾN THỨC STEM: NHIỆM VỤ NHẢY DÙ PAULO
              </h3>
              <button
                type="button"
                onClick={() => setShowKnowledgeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <p>• <strong>Vấn đề:</strong> Quả capuaçu ở Brazil khi chín rơi từ trên cao xuống rất dễ bị dập nát.</p>
              <p>• <strong>Giải pháp STEM:</strong> Paulo thiết kế chiếc dù với tán dù rộng để tăng diện tích cản không khí, hãm tốc độ rơi giúp quả tiếp đất êm ái.</p>
              <p>• <strong>Trọng lực:</strong> Kéo quả rơi xuống Trái Đất. <strong>Lực cản không khí:</strong> Hướng ngược lên làm quả rơi chậm.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowKnowledgeModal(false)}
              className="w-full py-2.5 bg-cyan-400 text-slate-950 font-black rounded-xl text-xs uppercase"
            >
              ĐÓNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
