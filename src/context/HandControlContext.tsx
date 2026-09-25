import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ControlMode, HandPointerState, TeacherSettings, GestureType } from '../types';

interface HandControlContextType {
  pointer: HandPointerState;
  pointer1: HandPointerState;
  pointer2: HandPointerState;
  detectedHandsCount: number;
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  cameraStatus: 'idle' | 'requesting' | 'connected' | 'error' | 'denied';
  errorMessage: string | null;
  showCameraPreview: boolean;
  setShowCameraPreview: (show: boolean) => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleControlMode: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarksRef: React.RefObject<any[]>;
  landmarksList: any[];
  // Drag item registration helper
  activeDraggedId: string | null;
  setActiveDraggedId: (id: string | null) => void;
}

const defaultPointer1: HandPointerState = {
  x: typeof window !== 'undefined' ? window.innerWidth * 0.25 : 300,
  y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
  normalizedX: 0.25,
  normalizedY: 0.5,
  isGrabbing: false,
  gesture: 'none',
  confidence: 0,
  isDetected: false,
  lastDetectedTimestamp: 0,
  handIndex: 0,
  teamId: 'teamA',
};

const defaultPointer2: HandPointerState = {
  x: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 900,
  y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
  normalizedX: 0.75,
  normalizedY: 0.5,
  isGrabbing: false,
  gesture: 'none',
  confidence: 0,
  isDetected: false,
  lastDetectedTimestamp: 0,
  handIndex: 1,
  teamId: 'teamB',
};

const HandControlContext = createContext<HandControlContextType | null>(null);

export const useHandControl = () => {
  const context = useContext(HandControlContext);
  if (!context) {
    throw new Error('useHandControl must be used within HandControlProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  settings?: TeacherSettings;
}

declare global {
  interface Window {
    Hands?: any;
    Camera?: any;
  }
}

export const HandControlProvider: React.FC<ProviderProps> = ({ children, settings }) => {
  const [controlMode, setControlMode] = useState<ControlMode>(settings?.controlMode || 'mouse');
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'requesting' | 'connected' | 'error' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCameraPreview, setShowCameraPreview] = useState<boolean>(true);
  const [activeDraggedId, setActiveDraggedId] = useState<string | null>(null);
  const [detectedHandsCount, setDetectedHandsCount] = useState<number>(0);

  const landmarksRef = useRef<any[]>([]);

  const [pointer1, setPointer1] = useState<HandPointerState>(defaultPointer1);
  const [pointer2, setPointer2] = useState<HandPointerState>(defaultPointer2);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraInstanceRef = useRef<any>(null);
  const handsInstanceRef = useRef<any>(null);
  const isProcessingRef = useRef<boolean>(false);
  const lastInferenceTimeRef = useRef<number>(0);

  // Smoothing refs for Hand 1 & Hand 2
  const smoothedPos1 = useRef<{ x: number; y: number }>({
    x: window.innerWidth * 0.25,
    y: window.innerHeight * 0.5,
  });
  const smoothedPos2 = useRef<{ x: number; y: number }>({
    x: window.innerWidth * 0.75,
    y: window.innerHeight * 0.5,
  });

  const gestureRef1 = useRef<GestureType>('open');
  const gestureRef2 = useRef<GestureType>('open');

  const fistCounterRef1 = useRef<number>(0);
  const thumbsUpCounterRef1 = useRef<number>(0);
  const openCounterRef1 = useRef<number>(0);

  const fistCounterRef2 = useRef<number>(0);
  const thumbsUpCounterRef2 = useRef<number>(0);
  const openCounterRef2 = useRef<number>(0);

  const lossGraceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with settings controlMode if updated by teacher
  useEffect(() => {
    if (settings?.controlMode) {
      setControlMode(settings.controlMode);
    }
  }, [settings?.controlMode]);

  // Mouse mode requires zero background listeners, eliminating hundreds of useless React renders/sec
  useEffect(() => {
    // In mouse mode, we do not attach global mousemove listeners.
    // Mouse clicks and drags are handled directly by native DOM events on items.
  }, [controlMode]);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch {
        // safe
      }
      cameraInstanceRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStatus('idle');
    setDetectedHandsCount(0);
    landmarksRef.current = [];
  }, []);

  const getDist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // Helper to classify gesture from landmarks
  const classifyGesture = (landmarks: any[]) => {
    const wrist = landmarks[0];
    const distThumb = getDist(landmarks[4], wrist);
    const distIndex = getDist(landmarks[8], wrist);
    const distMiddle = getDist(landmarks[12], wrist);
    const distRing = getDist(landmarks[16], wrist);
    const distPinky = getDist(landmarks[20], wrist);

    const distIndexPip = getDist(landmarks[6], wrist);
    const distMiddlePip = getDist(landmarks[10], wrist);
    const distRingPip = getDist(landmarks[14], wrist);
    const distPinkyPip = getDist(landmarks[18], wrist);
    const distThumbMcp = getDist(landmarks[2], wrist);

    const pinchDist = getDist(landmarks[4], landmarks[8]);

    let curledCount = 0;
    if (distIndex < distIndexPip * 1.05) curledCount++;
    if (distMiddle < distMiddlePip * 1.05) curledCount++;
    if (distRing < distRingPip * 1.05) curledCount++;
    if (distPinky < distPinkyPip * 1.05) curledCount++;

    // 1. Thumbs-Up (Like 👍)
    const isThumbPointingUp =
      landmarks[4].y < landmarks[3].y &&
      landmarks[3].y < landmarks[2].y &&
      landmarks[4].y < landmarks[8].y - 0.025 &&
      distThumb > distThumbMcp * 1.1;

    const isThumbsUp = curledCount >= 3 && isThumbPointingUp;

    // 2. Fist (✊)
    const isFist =
      !isThumbsUp &&
      (curledCount >= 3 || (curledCount >= 2 && pinchDist < 0.08) || pinchDist < 0.065);

    // 3. Open (✋)
    const isOpen = !isThumbsUp && curledCount <= 1;

    let gesture: GestureType = 'open';
    if (isThumbsUp) gesture = 'thumbs_up';
    else if (isFist) gesture = 'fist';
    else if (isOpen) gesture = 'open';

    return { gesture, isThumbsUp, isFist, isOpen };
  };

  // Start MediaPipe Hands camera with maxNumHands: 2
  const startCamera = useCallback(async () => {
    if (controlMode !== 'gesture') return;

    setCameraStatus('requesting');
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('error');
        setErrorMessage('Trình duyệt không hỗ trợ truy cập camera. Tự động chuyển sang chế độ chuột.');
        setControlMode('mouse');
        return;
      }

      let retries = 0;
      while ((!window.Hands || !window.Camera) && retries < 25) {
        await new Promise((r) => setTimeout(r, 200));
        retries++;
      }

      if (!window.Hands || !window.Camera) {
        setCameraStatus('error');
        setErrorMessage('Không thể tải thư viện nhận diện cử chỉ. Vui lòng chơi bằng chuột!');
        setControlMode('mouse');
        return;
      }

      if (!videoRef.current) {
        const video = document.createElement('video');
        video.playsInline = true;
        video.muted = true;
        videoRef.current = video;
      }

      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      // ModelComplexity 0 (Lite) is 3x-4x faster than 1, runs smoothly on any laptop/Chromebook
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        const now = Date.now();
        const multiHands = results.multiHandLandmarks || [];
        
        // Store in ref to avoid triggering full React component tree re-renders
        landmarksRef.current = multiHands;
        setDetectedHandsCount((prev) => (prev !== multiHands.length ? multiHands.length : prev));

        if (lossGraceTimeoutRef.current) {
          clearTimeout(lossGraceTimeoutRef.current);
          lossGraceTimeoutRef.current = null;
        }

        if (multiHands.length === 0) {
          if (!lossGraceTimeoutRef.current) {
            lossGraceTimeoutRef.current = setTimeout(() => {
              setPointer1((prev) => ({ ...prev, isDetected: false, gesture: 'none', isGrabbing: false }));
              setPointer2((prev) => ({ ...prev, isDetected: false, gesture: 'none', isGrabbing: false }));
              landmarksRef.current = [];
              setDetectedHandsCount(0);
            }, 400);
          }
          return;
        }

        // Map hands to Team 1 (left side) and Team 2 (right side)
        // MediaPipe mirrored x: (1 - landmarks[9].x)
        const parsedHands = multiHands.map((landmarks: any[], idx: number) => {
          const rawNormX = 1 - landmarks[9].x;
          const rawNormY = landmarks[9].y;
          const rawX = rawNormX * window.innerWidth;
          const rawY = rawNormY * window.innerHeight;
          const { gesture, isThumbsUp, isFist } = classifyGesture(landmarks);
          return { landmarks, rawNormX, rawNormY, rawX, rawY, gesture, isThumbsUp, isFist, originalIdx: idx };
        });

        // Sort by rawNormX ascending: leftmost hand -> Team 1, rightmost hand -> Team 2
        parsedHands.sort((a: any, b: any) => a.rawNormX - b.rawNormX);

        if (parsedHands.length === 1) {
          const h = parsedHands[0];

          // Dynamic lerp: fast movement gets high alpha (zero-lag tracking), slight movements stay jitter-free
          const dist1 = Math.hypot(h.rawX - smoothedPos1.current.x, h.rawY - smoothedPos1.current.y);
          const alpha1 = dist1 > 50 ? 0.88 : dist1 > 15 ? 0.76 : 0.60;
          smoothedPos1.current.x += (h.rawX - smoothedPos1.current.x) * alpha1;
          smoothedPos1.current.y += (h.rawY - smoothedPos1.current.y) * alpha1;

          if (h.isThumbsUp) {
            thumbsUpCounterRef1.current++;
            fistCounterRef1.current = 0;
            openCounterRef1.current = 0;
            if (thumbsUpCounterRef1.current >= 2) gestureRef1.current = 'thumbs_up';
          } else if (h.isFist) {
            fistCounterRef1.current++;
            thumbsUpCounterRef1.current = 0;
            openCounterRef1.current = 0;
            if (fistCounterRef1.current >= 2) gestureRef1.current = 'fist';
          } else {
            openCounterRef1.current++;
            fistCounterRef1.current = 0;
            thumbsUpCounterRef1.current = 0;
            if (openCounterRef1.current >= 2) gestureRef1.current = 'open';
          }

          const targetX1 = Math.round(smoothedPos1.current.x);
          const targetY1 = Math.round(smoothedPos1.current.y);
          const gesture1 = gestureRef1.current;
          const isGrabbing1 = gesture1 === 'fist';

          setPointer1((prev) => {
            if (
              prev.isDetected &&
              prev.gesture === gesture1 &&
              prev.isGrabbing === isGrabbing1 &&
              Math.abs(prev.x - targetX1) < 4 &&
              Math.abs(prev.y - targetY1) < 4
            ) {
              return prev;
            }
            return {
              x: targetX1,
              y: targetY1,
              normalizedX: targetX1 / window.innerWidth,
              normalizedY: targetY1 / window.innerHeight,
              isGrabbing: isGrabbing1,
              gesture: gesture1,
              confidence: 0.95,
              isDetected: true,
              lastDetectedTimestamp: now,
              handIndex: 0,
              teamId: 'teamA',
            };
          });

          // In Versus mode, if the single hand is on the right half, also update pointer2
          if (h.rawNormX >= 0.5) {
            const dist2 = Math.hypot(h.rawX - smoothedPos2.current.x, h.rawY - smoothedPos2.current.y);
            const alpha2 = dist2 > 50 ? 0.88 : dist2 > 15 ? 0.76 : 0.60;
            smoothedPos2.current.x += (h.rawX - smoothedPos2.current.x) * alpha2;
            smoothedPos2.current.y += (h.rawY - smoothedPos2.current.y) * alpha2;
            gestureRef2.current = gestureRef1.current;

            const targetX2 = Math.round(smoothedPos2.current.x);
            const targetY2 = Math.round(smoothedPos2.current.y);

            setPointer2((prev) => {
              if (
                prev.isDetected &&
                prev.gesture === gesture1 &&
                prev.isGrabbing === isGrabbing1 &&
                Math.abs(prev.x - targetX2) < 4 &&
                Math.abs(prev.y - targetY2) < 4
              ) {
                return prev;
              }
              return {
                x: targetX2,
                y: targetY2,
                normalizedX: targetX2 / window.innerWidth,
                normalizedY: targetY2 / window.innerHeight,
                isGrabbing: isGrabbing1,
                gesture: gesture1,
                confidence: 0.95,
                isDetected: true,
                lastDetectedTimestamp: now,
                handIndex: 1,
                teamId: 'teamB',
              };
            });
          } else {
            setPointer2((prev) => (prev.isDetected ? { ...prev, isDetected: false } : prev));
          }
        } else if (parsedHands.length >= 2) {
          // Hand 1 (Leftmost -> Team 1)
          const h1 = parsedHands[0];
          const dist1 = Math.hypot(h1.rawX - smoothedPos1.current.x, h1.rawY - smoothedPos1.current.y);
          const alpha1 = dist1 > 50 ? 0.88 : dist1 > 15 ? 0.76 : 0.60;
          smoothedPos1.current.x += (h1.rawX - smoothedPos1.current.x) * alpha1;
          smoothedPos1.current.y += (h1.rawY - smoothedPos1.current.y) * alpha1;

          if (h1.isThumbsUp) {
            gestureRef1.current = 'thumbs_up';
          } else if (h1.isFist) {
            gestureRef1.current = 'fist';
          } else {
            gestureRef1.current = 'open';
          }

          const targetX1 = Math.round(smoothedPos1.current.x);
          const targetY1 = Math.round(smoothedPos1.current.y);
          const gesture1 = gestureRef1.current;
          const isGrabbing1 = gesture1 === 'fist';

          setPointer1((prev) => {
            if (
              prev.isDetected &&
              prev.gesture === gesture1 &&
              prev.isGrabbing === isGrabbing1 &&
              Math.abs(prev.x - targetX1) < 4 &&
              Math.abs(prev.y - targetY1) < 4
            ) {
              return prev;
            }
            return {
              x: targetX1,
              y: targetY1,
              normalizedX: targetX1 / window.innerWidth,
              normalizedY: targetY1 / window.innerHeight,
              isGrabbing: isGrabbing1,
              gesture: gesture1,
              confidence: 0.95,
              isDetected: true,
              lastDetectedTimestamp: now,
              handIndex: 0,
              teamId: 'teamA',
            };
          });

          // Hand 2 (Rightmost -> Team 2)
          const h2 = parsedHands[1];
          const dist2 = Math.hypot(h2.rawX - smoothedPos2.current.x, h2.rawY - smoothedPos2.current.y);
          const alpha2 = dist2 > 50 ? 0.88 : dist2 > 15 ? 0.76 : 0.60;
          smoothedPos2.current.x += (h2.rawX - smoothedPos2.current.x) * alpha2;
          smoothedPos2.current.y += (h2.rawY - smoothedPos2.current.y) * alpha2;

          if (h2.isThumbsUp) {
            gestureRef2.current = 'thumbs_up';
          } else if (h2.isFist) {
            gestureRef2.current = 'fist';
          } else {
            gestureRef2.current = 'open';
          }

          const targetX2 = Math.round(smoothedPos2.current.x);
          const targetY2 = Math.round(smoothedPos2.current.y);
          const gesture2 = gestureRef2.current;
          const isGrabbing2 = gesture2 === 'fist';

          setPointer2((prev) => {
            if (
              prev.isDetected &&
              prev.gesture === gesture2 &&
              prev.isGrabbing === isGrabbing2 &&
              Math.abs(prev.x - targetX2) < 4 &&
              Math.abs(prev.y - targetY2) < 4
            ) {
              return prev;
            }
            return {
              x: targetX2,
              y: targetY2,
              normalizedX: targetX2 / window.innerWidth,
              normalizedY: targetY2 / window.innerHeight,
              isGrabbing: isGrabbing2,
              gesture: gesture2,
              confidence: 0.95,
              isDetected: true,
              lastDetectedTimestamp: now,
              handIndex: 1,
              teamId: 'teamB',
            };
          });
        }
      });

      handsInstanceRef.current = hands;

      // Frame dropping guard & ~28 FPS cap with 320x240 resolution to eliminate CPU heat and lag
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (!videoRef.current || !handsInstanceRef.current) return;
          if (isProcessingRef.current) return; // Drop frame if inference in progress

          const now = performance.now();
          if (now - lastInferenceTimeRef.current < 36) return; // Cap at ~28 FPS

          isProcessingRef.current = true;
          lastInferenceTimeRef.current = now;
          try {
            await handsInstanceRef.current.send({ image: videoRef.current });
          } catch {
            // safe ignore transient frame errors
          } finally {
            isProcessingRef.current = false;
          }
        },
        width: 320,
        height: 240,
      });

      await camera.start();
      cameraInstanceRef.current = camera;
      setCameraStatus('connected');
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
        setErrorMessage('Bạn đã từ chối quyền camera. Không sao, bạn có thể chơi tiếp bằng chuột!');
      } else {
        setCameraStatus('error');
        setErrorMessage('Không thể mở camera. Vui lòng sử dụng chuột để điều khiển!');
      }
      setControlMode('mouse');
    }
  }, [controlMode]);

  // Handle switching modes
  useEffect(() => {
    if (controlMode === 'gesture' && cameraStatus === 'idle') {
      startCamera();
    } else if (controlMode === 'mouse' && cameraStatus === 'connected') {
      stopCamera();
    }
  }, [controlMode, cameraStatus, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (lossGraceTimeoutRef.current) {
        clearTimeout(lossGraceTimeoutRef.current);
      }
    };
  }, [stopCamera]);

  const toggleControlMode = () => {
    if (controlMode === 'mouse') {
      setControlMode('gesture');
      startCamera();
    } else {
      setControlMode('mouse');
      stopCamera();
    }
  };

  // Primary pointer defaults to pointer1 if detected, otherwise pointer2
  const primaryPointer = pointer1.isDetected ? pointer1 : pointer2.isDetected ? pointer2 : pointer1;

  return (
    <HandControlContext.Provider
      value={{
        pointer: primaryPointer,
        pointer1,
        pointer2,
        detectedHandsCount,
        controlMode,
        setControlMode,
        cameraStatus,
        errorMessage,
        showCameraPreview,
        setShowCameraPreview,
        startCamera,
        stopCamera,
        toggleControlMode,
        videoRef,
        landmarksRef,
        landmarksList: landmarksRef.current,
        activeDraggedId,
        setActiveDraggedId,
      }}
    >
      {children}
    </HandControlContext.Provider>
  );
};
