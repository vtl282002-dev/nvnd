import { useState, useRef, useEffect, useCallback } from 'react';
import { useHandControl } from '../context/HandControlContext';
import { sound } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

export interface DragItemData {
  id: string;
  label: string;
  category?: string;
  icon?: React.ReactNode;
  correctTargetId: string | string[]; // Can accept one target or multiple targets (e.g., character tray)
  isLocked?: boolean;
  isDistractor?: boolean;
}

export interface DropZoneData {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  lockedItem?: DragItemData | null;
  // Multi-item target support (e.g. "NHÂN VẬT CỦA CÂU CHUYỆN" holds 3 characters)
  maxItems?: number;
  acceptedItems?: DragItemData[];
}

interface UseDragSystemProps {
  initialItems: DragItemData[];
  dropZones: DropZoneData[];
  onCorrectDrop: (itemId: string, targetId: string, attempts: number) => void;
  onIncorrectDrop?: (itemId: string, targetId: string) => void;
  onAllCompleted?: () => void;
}

export function useDragSystem({
  initialItems,
  dropZones: initialDropZones,
  onCorrectDrop,
  onIncorrectDrop,
  onAllCompleted,
}: UseDragSystemProps) {
  const { pointer, controlMode } = useHandControl();

  const [items, setItems] = useState<DragItemData[]>(initialItems);
  const [dropZones, setDropZones] = useState<DropZoneData[]>(initialDropZones);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentDragPos, setCurrentDragPos] = useState<{ x: number; y: number } | null>(null);
  const [shakingTargetId, setShakingTargetId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Track attempts per item for scoring calculation (10 pts for 1st, 7 pts for 2nd, 5 pts for 3rd+)
  const attemptsRef = useRef<Record<string, number>>({});
  const dropZoneRefs = useRef<Map<string, HTMLElement>>(new Map());
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const prevItemsKeyRef = useRef<string>('');

  // Reset or update only when initial items or zones structural IDs actually change (e.g. stage change)
  useEffect(() => {
    const itemIds = initialItems.map((i) => i.id).join(',');
    const zoneIds = initialDropZones.map((z) => z.id).join(',');
    const newKey = `${itemIds}:::${zoneIds}`;

    if (newKey !== prevItemsKeyRef.current) {
      prevItemsKeyRef.current = newKey;
      setItems(initialItems);
      setDropZones(initialDropZones);
      setActiveDragId(null);
      setCurrentDragPos(null);
      attemptsRef.current = {};
    }
  }, [initialItems, initialDropZones]);

  // Check if item matches target
  const isMatch = useCallback((item: DragItemData, targetId: string) => {
    if (Array.isArray(item.correctTargetId)) {
      return item.correctTargetId.includes(targetId);
    }
    return item.correctTargetId === targetId;
  }, []);

  // Handle successful drop
  const handleDropValidation = useCallback(
    (itemId: string, dropX: number, dropY: number) => {
      const item = items.find((i) => i.id === itemId);
      if (!item || item.isLocked) {
        setActiveDragId(null);
        setCurrentDragPos(null);
        return;
      }

      const itemAttempts = (attemptsRef.current[itemId] || 0) + 1;
      attemptsRef.current[itemId] = itemAttempts;

      // Find dropzone under the drop coordinates with generous tolerance padding
      let matchedZoneId: string | null = null;
      let minDistance = Infinity;
      const PADDING = 50; // 50px tolerance padding on all sides for easy dropping

      // 1. First pass: bounding box with padding + distance to center
      for (const [zoneId, element] of dropZoneRefs.current.entries()) {
        const rect = element.getBoundingClientRect();
        if (
          dropX >= rect.left - PADDING &&
          dropX <= rect.right + PADDING &&
          dropY >= rect.top - PADDING &&
          dropY <= rect.bottom + PADDING
        ) {
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(dropX - centerX, dropY - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            matchedZoneId = zoneId;
          }
        }
      }

      // 2. Second pass: fallback nearest zone within 120px radius
      if (!matchedZoneId) {
        for (const [zoneId, element] of dropZoneRefs.current.entries()) {
          const rect = element.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;
          const dist = Math.hypot(dropX - centerX, dropY - centerY);
          if (dist < 120 && dist < minDistance) {
            minDistance = dist;
            matchedZoneId = zoneId;
          }
        }
      }

      if (!matchedZoneId) {
        // Dropped outside any valid zone: return safely
        sound.playDrop();
        setActiveDragId(null);
        setCurrentDragPos(null);
        return;
      }

      const targetZone = dropZones.find((z) => z.id === matchedZoneId);
      if (!targetZone) {
        sound.playDrop();
        setActiveDragId(null);
        setCurrentDragPos(null);
        return;
      }

      const isCorrect = isMatch(item, matchedZoneId);

      if (isCorrect) {
        // Correct drop! Push item content into drop slot!
        sound.playCorrect();
        launchConfetti(dropX, dropY, 40);

        // Praise messages
        const praises = ['Chính xác!', 'Em làm rất tốt!', 'Tuyệt vời!', 'Chuẩn xác!'];
        setFeedbackMessage(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setFeedbackMessage(null), 2000);

        // Update drop zone & lock item into the slot immediately
        setDropZones((prev) =>
          prev.map((zone) => {
            if (zone.id === matchedZoneId) {
              const prevAccepted = zone.acceptedItems || [];
              const accepted = [...prevAccepted, { ...item, isLocked: true }];
              return {
                ...zone,
                lockedItem: { ...item, isLocked: true },
                acceptedItems: accepted,
              };
            }
            return zone;
          })
        );

        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, isLocked: true } : i))
        );

        onCorrectDrop(itemId, matchedZoneId, itemAttempts);
      } else {
        // Incorrect drop: Protect existing locked items!
        sound.playIncorrect();
        setShakingTargetId(matchedZoneId);
        setTimeout(() => setShakingTargetId(null), 800);

        const hints = ['Hãy thử lại nhé!', 'Chưa đúng vị trí rồi!', 'Kiểm tra lại xem sao!'];
        setFeedbackMessage(hints[Math.floor(Math.random() * hints.length)]);
        setTimeout(() => setFeedbackMessage(null), 2000);

        if (onIncorrectDrop) {
          onIncorrectDrop(itemId, matchedZoneId);
        }
      }

      setActiveDragId(null);
      setCurrentDragPos(null);
    },
    [items, dropZones, isMatch, onCorrectDrop, onIncorrectDrop]
  );

  // Monitor Hand Gesture: Fist to Select, Release/Open hand to Drop
  const grabStartTimeRef = useRef<number>(0);
  const prevGestureRef = useRef<string>('none');
  const prevGrabbingRef = useRef(false);

  useEffect(() => {
    // Only listen to hand gestures if gesture mode is active!
    if (controlMode !== 'gesture') return;

    const gesture = pointer.gesture;
    const isFist = gesture === 'fist';
    const isThumbsUp = gesture === 'thumbs_up';
    const isOpen = gesture === 'open';

    // 1. SELECT: Fist (✊) gesture detected over an available item and no item currently held
    if (isFist && !activeDragId) {
      for (const [id, el] of itemRefs.current.entries()) {
        const item = items.find((i) => i.id === id);
        if (item && !item.isLocked) {
          const rect = el.getBoundingClientRect();
          // generous hit area for 3rd graders
          const padding = 25;
          if (
            pointer.x >= rect.left - padding &&
            pointer.x <= rect.right + padding &&
            pointer.y >= rect.top - padding &&
            pointer.y <= rect.bottom + padding
          ) {
            sound.playGrab();
            setActiveDragId(id);
            grabStartTimeRef.current = Date.now();
            setDragOffset({ x: pointer.x - (rect.left + rect.width / 2), y: pointer.y - (rect.top + rect.height / 2) });
            setCurrentDragPos({ x: pointer.x, y: pointer.y });
            break;
          }
        }
      }
    }

    // 2. MOVE: If currently holding an item, follow pointer position (filter micro-jitter < 3px)
    if (activeDragId) {
      setCurrentDragPos((prev) => {
        if (prev && Math.abs(prev.x - pointer.x) < 3 && Math.abs(prev.y - pointer.y) < 3) return prev;
        return { x: pointer.x, y: pointer.y };
      });
    }

    // 3. DROP: Open hand (✋), Thumbs Up (👍), or release of fist while holding item -> Drop into slot!
    const isReleaseGesture = isOpen || isThumbsUp || !pointer.isGrabbing || gesture !== 'fist';
    if (isReleaseGesture && activeDragId) {
      // Ensure at least 120ms elapsed since grab to avoid instant jitter drop
      if (Date.now() - grabStartTimeRef.current > 120) {
        handleDropValidation(activeDragId, pointer.x, pointer.y);
      }
    }

    prevGestureRef.current = gesture;
    prevGrabbingRef.current = pointer.isGrabbing;
  }, [controlMode, pointer, activeDragId, items, handleDropValidation]);

  // Mouse handlers for desktop click & drag (Throttled with requestAnimationFrame for 60-144 FPS smooth movement)
  const handleMouseDownItem = (e: React.MouseEvent, itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.isLocked) return;

    sound.playGrab();
    setActiveDragId(itemId);
    setCurrentDragPos({ x: e.clientX, y: e.clientY });

    let rafId: number | null = null;
    let lastX = e.clientX;
    let lastY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setCurrentDragPos({ x: lastX, y: lastY });
        });
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      handleDropValidation(itemId, upEvent.clientX, upEvent.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
  };

  const registerDropZoneRef = (id: string, el: HTMLElement | null) => {
    if (el) dropZoneRefs.current.set(id, el);
    else dropZoneRefs.current.delete(id);
  };

  const registerItemRef = (id: string, el: HTMLElement | null) => {
    if (el) itemRefs.current.set(id, el);
    else itemRefs.current.delete(id);
  };

  return {
    items,
    dropZones,
    activeDragId,
    currentDragPos,
    shakingTargetId,
    feedbackMessage,
    handleMouseDownItem,
    registerDropZoneRef,
    registerItemRef,
  };
}
