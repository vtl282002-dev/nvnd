import React, { useRef, useEffect } from 'react';
import { useHandControl } from '../context/HandControlContext';
import { Camera, Eye, EyeOff, Hand, AlertCircle } from 'lucide-react';

export const HandPointerOverlay: React.FC = () => {
  const {
    pointer1,
    pointer2,
    detectedHandsCount,
    controlMode,
    cameraStatus,
    errorMessage,
    showCameraPreview,
    setShowCameraPreview,
    toggleControlMode,
    videoRef,
    landmarksRef,
  } = useHandControl();

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render skeleton landmarks on mini webcam canvas (Continuous 60FPS RAF reading from ref)
  useEffect(() => {
    if (!showCameraPreview || controlMode !== 'gesture') return;

    let animId: number;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Palm
    ];

    let lastDrawTime = 0;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (time - lastDrawTime < 33) return; // 30 FPS cap for mini preview canvas
      lastDrawTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mirrored video frame if available
      if (videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Dark dim layer for nice contrast
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Read directly from landmarksRef to prevent React re-render thrashing
      const hands = landmarksRef.current || [];
      hands.forEach((landmarks: any[], handIdx: number) => {
        // Color: Team 1 (Left / Index 0) is Cyan, Team 2 (Right / Index 1) is Amber/Orange
        const isTeam1 = (1 - landmarks[9].x) < 0.5 || handIdx === 0;
        const colorPrimary = isTeam1 ? '#00e5ff' : '#ff9f00';
        const colorJoint = isTeam1 ? '#ffffff' : '#ffe066';

        // Draw bone links
        ctx.strokeStyle = colorPrimary;
        ctx.lineWidth = 2.5;
        CONNECTIONS.forEach(([i, j]) => {
          const p1 = landmarks[i];
          const p2 = landmarks[j];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo((1 - p1.x) * canvas.width, p1.y * canvas.height);
            ctx.lineTo((1 - p2.x) * canvas.width, p2.y * canvas.height);
            ctx.stroke();
          }
        });

        // Draw joints
        landmarks.forEach((p: any) => {
          ctx.beginPath();
          ctx.arc((1 - p.x) * canvas.width, p.y * canvas.height, 3, 0, 2 * Math.PI);
          ctx.fillStyle = colorJoint;
          ctx.fill();
        });
      });
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [showCameraPreview, controlMode, videoRef, landmarksRef]);

  // Render a cursor for a specific team (Ultra-low latency, no CSS transition delay)
  const renderCursor = (
    p: typeof pointer1,
    teamLabel: string,
    teamColor: 'blue' | 'amber'
  ) => {
    // In mouse mode, real mouse cursor is used. Only render in gesture mode when hand detected.
    if (controlMode !== 'gesture' || !p.isDetected) return null;

    const isBlue = teamColor === 'blue';
    const bgGradient = isBlue
      ? 'from-sky-500 via-cyan-500 to-blue-600'
      : 'from-amber-400 via-orange-500 to-yellow-500';
    const ringColor = isBlue ? 'border-cyan-300' : 'border-amber-300';
    const badgeBg = isBlue
      ? 'bg-sky-950/95 border-sky-400 text-sky-200'
      : 'bg-amber-950/95 border-amber-400 text-amber-200';

    return (
      <div
        key={teamLabel}
        className="fixed pointer-events-none z-[9999] transition-none will-change-transform"
        style={{
          transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {p.gesture === 'thumbs_up' ? (
          // Thumbs Up 👍
          <div className="relative flex flex-col items-center justify-center">
            <div className={`absolute w-14 h-14 rounded-full ${isBlue ? 'bg-cyan-400/25 ring-2 ring-cyan-300/40' : 'bg-amber-400/25 ring-2 ring-amber-300/40'}`} />
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-tr ${bgGradient} border-2 ${ringColor} shadow-2xl flex items-center justify-center text-white scale-125 transition-transform`}
            >
              <span className="text-2xl filter drop-shadow">👍</span>
            </div>
            <div
              className={`mt-1.5 px-3 py-1 rounded-full ${badgeBg} text-[11px] font-black tracking-wide whitespace-nowrap border shadow-xl flex items-center gap-1.5`}
            >
              <span>{isBlue ? '🔵' : '🟠'}</span>
              <span>{teamLabel}: 👍 THẢ VÀO Ô!</span>
            </div>
          </div>
        ) : p.gesture === 'fist' ? (
          // Fist ✊ (Grab)
          <div className="relative flex flex-col items-center justify-center">
            <div className={`absolute w-12 h-12 rounded-full ${isBlue ? 'bg-cyan-400/25 ring-2 ring-cyan-300/40' : 'bg-amber-400/25 ring-2 ring-amber-300/40'}`} />
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr ${bgGradient} border-2 ${ringColor} shadow-xl flex items-center justify-center text-white scale-110 transition-transform`}
            >
              <span className="text-xl filter drop-shadow">✊</span>
            </div>
            <div
              className={`mt-1.5 px-3 py-1 rounded-full ${badgeBg} text-[11px] font-black tracking-wide whitespace-nowrap border shadow-xl flex items-center gap-1.5`}
            >
              <span>{isBlue ? '🔵' : '🟠'}</span>
              <span>{teamLabel}: ✊ NẮM TAY (CHỌN)</span>
            </div>
          </div>
        ) : (
          // Open ✋ (Move / Drop)
          <div className="relative flex flex-col items-center justify-center">
            <div className={`absolute w-10 h-10 rounded-full ${isBlue ? 'bg-cyan-400/20' : 'bg-amber-400/20'}`} />
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${bgGradient} border-2 ${ringColor} shadow-lg flex items-center justify-center text-white transition-transform`}
            >
              <span className="text-lg filter drop-shadow">✋</span>
            </div>
            <div
              className={`mt-1.5 px-2.5 py-0.5 rounded-full ${badgeBg} text-[10px] font-black tracking-wide whitespace-nowrap border shadow flex items-center gap-1`}
            >
              <span>{isBlue ? '🔵' : '🟠'}</span>
              <span>{teamLabel}: ✋ XOÈ TAY (THẢ)</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Cursors for Hand 1 (Team 1) and Hand 2 (Team 2) */}
      {renderCursor(pointer1, 'Đội 1', 'blue')}
      {renderCursor(pointer2, 'Đội 2', 'amber')}

      {/* Floating Camera Widget (Matching image.png exactly) */}
      <div id="camera-control-widget" className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2">
        {/* Error notification if camera permission denied */}
        {errorMessage && (
          <div className="max-w-xs bg-amber-500/95 text-slate-900 px-3.5 py-2.5 rounded-xl shadow-xl border border-amber-300 flex items-start gap-2 text-xs font-semibold backdrop-blur animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-slate-900 mt-0.5" />
            <div className="flex-1">
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={toggleControlMode}
                className="mt-1.5 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition"
              >
                Chơi tiếp bằng Chuột
              </button>
            </div>
          </div>
        )}

        {/* Camera Preview HUD Box */}
        {controlMode === 'gesture' && showCameraPreview && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl w-52 overflow-hidden transition-all duration-300">
            {/* Top Bar of Camera Box */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-xs text-slate-300 font-bold px-1">
              <span className="flex items-center gap-1.5 text-white">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Camera</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowCameraPreview(false)}
                  title="Ẩn camera"
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Status Pill Badge (Matching image.png: "Đã nhận diện (1 tay)" or "(2 tay)") */}
            <div className="mb-1.5 flex justify-center">
              {detectedHandsCount > 0 ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ĐÃ NHẬN DIỆN ({detectedHandsCount} TAY)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>ĐƯA TAY VÀO CAMERA...</span>
                </div>
              )}
            </div>

            {/* Video Canvas Preview */}
            <div className="relative w-full aspect-4/3 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              <canvas
                ref={previewCanvasRef}
                width={240}
                height={180}
                className="w-full h-full object-cover"
              />

              {/* Hand Detection Guidance if none */}
              {detectedHandsCount === 0 && cameraStatus === 'connected' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 p-2 text-center pointer-events-none">
                  <Hand className="w-8 h-8 text-amber-400 animate-pulse mb-1" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Giơ 1 hoặc 2 bàn tay trước camera
                  </span>
                </div>
              )}
            </div>

            {/* Footer Tag */}
            <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="text-cyan-400">❖</span>
              <span>ĐẤU TRƯỜNG TƯƠNG TÁC TAY KHÔNG</span>
            </div>
          </div>
        )}

        {/* Small Toggle Button if Camera Box is hidden */}
        {controlMode === 'gesture' && !showCameraPreview && (
          <button
            type="button"
            onClick={() => setShowCameraPreview(true)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white shadow-xl hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <Eye className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </>
  );
};
