import React, { useState, useEffect, useRef } from 'react';
import { HandControlProvider } from './context/HandControlContext';
import { BrazilianAtmosphere } from './components/BrazilianAtmosphere';
import { HandPointerOverlay } from './components/HandPointerOverlay';
import { HeaderBar } from './components/HeaderBar';
import { StartScreen } from './components/StartScreen';
import { Stage1Story } from './components/stages/Stage1Story';
import { Stage2Aerospace } from './components/stages/Stage2Aerospace';
import { Stage3Physics } from './components/stages/Stage3Physics';
import { Stage4ParachuteDesign } from './components/stages/Stage4ParachuteDesign';
import { StageSummaryModal } from './components/StageSummaryModal';
import { VictoryScreen } from './components/VictoryScreen';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { VersusBattleArena } from './components/VersusBattleArena';
import { StageId, TeacherSettings, GamePlayMode, TeamId, TeamInfo, ControlMode } from './types';
import { sound } from './utils/audio';

const defaultSettings: TeacherSettings = {
  timedMode: false,
  timerMinutes: 10,
  soundEnabled: true,
  cameraEnabled: true,
  isMuted: false,
  controlMode: 'mouse',
  gestureSensitivity: 'medium',
  basePointsFirstTry: 10,
  shuffleItems: true,
};

const STAGE_TITLES: Record<StageId, string> = {
  1: 'Chặng 1: Câu chuyện của Paulo',
  2: 'Chặng 2: Khám phá hàng không vũ trụ',
  3: 'Chặng 3: Trọng lực và lực cản không khí',
  4: 'Chặng 4: Thiết kế chiếc dù cứu quả capuaçu',
};

const STAGE_TAKEAWAYS: Record<StageId, string> = {
  1: 'Trong quy trình kỹ thuật STEM, chúng ta luôn bắt đầu bằng việc xác định rõ VẤN ĐỀ cần giải quyết và tìm kiếm GIẢI PHÁP kỹ thuật sáng tạo!',
  2: 'Kỹ sư hàng không vũ trụ chế tạo ra các sản phẩm như máy bay, tên lửa, vệ tinh và luôn phải thiết kế, thử nghiệm cẩn thận trước khi sử dụng!',
  3: 'Tán dù rộng làm tăng diện tích tiếp xúc với không khí, tăng lực cản không khí đẩy lên, giúp vật rơi chầm chậm và tiếp đất an toàn!',
  4: 'Chiếc dù hoàn chỉnh cần có tán dù rộng nguyên vẹn, dây dù bền chắc và giá đỡ vững chãi để bảo vệ an toàn cho quả capuaçu!',
};

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'victory'>('start');
  const [currentStage, setCurrentStage] = useState<StageId>(1);
  const [studentName, setStudentName] = useState<string>('Học sinh lớp 3');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [stageScoreEarned, setStageScoreEarned] = useState<number>(0);
  const [totalCorrectTasks, setTotalCorrectTasks] = useState<number>(0);

  // Versus Mode State
  const [gamePlayMode, setGamePlayMode] = useState<GamePlayMode>('single');
  const [teamA, setTeamA] = useState<TeamInfo>({
    id: 'teamA',
    name: 'Đội Xanh (Paulo)',
    score: 0,
    correctCount: 0,
    color: 'emerald',
  });
  const [teamB, setTeamB] = useState<TeamInfo>({
    id: 'teamB',
    name: 'Đội Vàng (Lucas)',
    score: 0,
    correctCount: 0,
    color: 'amber',
  });
  const [currentTeamTurn, setCurrentTeamTurn] = useState<TeamId>('teamA');
  const [turnNotification, setTurnNotification] = useState<{
    teamName: string;
    color: string;
  } | null>(null);

  // Settings
  const [settings, setSettings] = useState<TeacherSettings>(defaultSettings);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // Timing
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(settings.timerMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const elapsedSecondsRef = useRef<number>(0);

  // Stage Summary Modal State
  const [summaryModalStage, setSummaryModalStage] = useState<StageId | null>(null);

  // Audio mute sync
  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setSettings((prev) => ({ ...prev, isMuted: nextMuted }));
  };

  // Timer loop when playing
  useEffect(() => {
    if (gameState !== 'playing' || summaryModalStage !== null || isTeacherModalOpen) return;

    const timer = setInterval(() => {
      elapsedSecondsRef.current += 1;

      if (settings.timedMode) {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, summaryModalStage, isTeacherModalOpen, settings.timedMode]);

  // Handle Start Game
  const handleStartGame = (
    name: string,
    mode: ControlMode,
    playMode: GamePlayMode = 'single',
    teamAName?: string,
    teamBName?: string
  ) => {
    setStudentName(name);
    setSettings((prev) => ({ ...prev, controlMode: mode }));
    setGamePlayMode(playMode);

    if (teamAName) {
      setTeamA((prev) => ({ ...prev, name: teamAName, score: 0, correctCount: 0 }));
    } else {
      setTeamA((prev) => ({ ...prev, score: 0, correctCount: 0 }));
    }

    if (teamBName) {
      setTeamB((prev) => ({ ...prev, name: teamBName, score: 0, correctCount: 0 }));
    } else {
      setTeamB((prev) => ({ ...prev, score: 0, correctCount: 0 }));
    }

    setCurrentTeamTurn('teamA');
    setGameState('playing');
    setCurrentStage(1);
    setTotalScore(0);
    setStageScoreEarned(0);
    setTotalCorrectTasks(0);
    elapsedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setTimeRemainingSeconds(settings.timerMinutes * 60);

    if (playMode === 'versus') {
      showTurnNotification(teamAName || teamA.name, '#009c3b');
    }
  };

  const showTurnNotification = (name: string, color: string) => {
    setTurnNotification({ teamName: name, color });
    setTimeout(() => {
      setTurnNotification(null);
    }, 2200);
  };

  const handleSwitchTeamTurn = () => {
    const nextTurn: TeamId = currentTeamTurn === 'teamA' ? 'teamB' : 'teamA';
    setCurrentTeamTurn(nextTurn);
    const activeTeam = nextTurn === 'teamA' ? teamA : teamB;
    showTurnNotification(activeTeam.name, activeTeam.color);
  };

  // Subtask score increment
  const handleSubtaskComplete = (subtaskId: string, points: number) => {
    setTotalScore((prev) => prev + points);
    setStageScoreEarned((prev) => prev + points);
    setTotalCorrectTasks((prev) => prev + 1);

    if (gamePlayMode === 'versus') {
      if (currentTeamTurn === 'teamA') {
        setTeamA((prev) => ({
          ...prev,
          score: prev.score + points,
          correctCount: prev.correctCount + 1,
        }));
      } else {
        setTeamB((prev) => ({
          ...prev,
          score: prev.score + points,
          correctCount: prev.correctCount + 1,
        }));
      }

      // Switch turn after completing subtask in versus mode
      const nextTurn: TeamId = currentTeamTurn === 'teamA' ? 'teamB' : 'teamA';
      setCurrentTeamTurn(nextTurn);
      const nextTeam = nextTurn === 'teamA' ? teamA : teamB;
      setTimeout(() => {
        showTurnNotification(nextTeam.name, nextTeam.color);
      }, 800);
    }
  };

  // Stage complete trigger -> Show StageSummaryModal
  const handleStageComplete = (completedStageId: StageId) => {
    sound.playStageClear();
    setSummaryModalStage(completedStageId);
  };

  // Continue from summary modal to next stage
  const handleContinueNextStage = () => {
    if (summaryModalStage === null) return;

    const next = (summaryModalStage + 1) as StageId;
    setSummaryModalStage(null);
    setStageScoreEarned(0);

    if (next <= 4) {
      setCurrentStage(next);
      if (gamePlayMode === 'versus') {
        // Announce turn for new stage
        const activeTeam = currentTeamTurn === 'teamA' ? teamA : teamB;
        showTurnNotification(activeTeam.name, activeTeam.color);
      }
    } else {
      setElapsedSeconds(elapsedSecondsRef.current);
      setGameState('victory');
    }
  };

  // Stage 4 parachute test success -> Victory screen
  const handleParachuteTestSuccess = () => {
    setElapsedSeconds(elapsedSecondsRef.current);
    setGameState('victory');
  };

  // Reset & Play Again
  const handlePlayAgain = () => {
    setGameState('start');
    setCurrentStage(1);
    setTotalScore(0);
    setStageScoreEarned(0);
    setTotalCorrectTasks(0);
    elapsedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setSummaryModalStage(null);
    setTeamA((prev) => ({ ...prev, score: 0, correctCount: 0 }));
    setTeamB((prev) => ({ ...prev, score: 0, correctCount: 0 }));
    setCurrentTeamTurn('teamA');
  };

  return (
    <HandControlProvider settings={settings}>
      <BrazilianAtmosphere>
        {/* Hand Gesture Camera Pointer & Webcam HUD */}
        <HandPointerOverlay />

        {/* Global Navigation Header (for single player stages) */}
        {gameState !== 'start' && gamePlayMode !== 'versus' && (
          <HeaderBar
            currentStage={currentStage}
            totalScore={totalScore}
            timeRemainingSeconds={timeRemainingSeconds}
            timedMode={settings.timedMode}
            isMuted={settings.isMuted}
            onToggleMute={toggleMute}
            onOpenTeacherSettings={() => setIsTeacherModalOpen(true)}
            studentName={studentName}
            gamePlayMode={gamePlayMode}
            teamA={teamA}
            teamB={teamB}
            currentTeamTurn={currentTeamTurn}
            onSwitchTeamTurn={handleSwitchTeamTurn}
          />
        )}

        {/* Versus Turn Announcement Banner */}
        {turnNotification && gamePlayMode !== 'versus' && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
            <div className="px-6 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400 text-white shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
              <span className="text-xl">⚔️</span>
              <div>
                <div className="text-[10px] text-amber-300 font-black uppercase tracking-widest">
                  LƯỢT THỬ THÁCH TIẾP THEO
                </div>
                <div className="text-sm md:text-base font-black text-white">
                  Đến lượt: <span className="text-amber-300 underline">{turnNotification.teamName}</span>
                </div>
              </div>
              <span className="text-xl">🪂</span>
            </div>
          </div>
        )}

        {/* View Routing */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {gameState === 'start' && (
            <StartScreen
              studentName={studentName}
              setStudentName={setStudentName}
              controlMode={settings.controlMode}
              setControlMode={(m) => setSettings((s) => ({ ...s, controlMode: m }))}
              soundEnabled={settings.soundEnabled}
              setSoundEnabled={(e) => setSettings((s) => ({ ...s, soundEnabled: e }))}
              onStartGame={handleStartGame}
              onOpenTeacherSettings={() => setIsTeacherModalOpen(true)}
            />
          )}

          {gameState === 'playing' && gamePlayMode === 'versus' && (
            <VersusBattleArena
              onBackToMain={() => setGameState('start')}
              onOpenTeacherSettings={() => setIsTeacherModalOpen(true)}
              teamAName={teamA.name}
              teamBName={teamB.name}
            />
          )}

          {gameState === 'playing' && gamePlayMode === 'single' && (
            <div className="w-full h-full p-2 md:p-4">
              {currentStage === 1 && (
                <Stage1Story
                  onSubtaskComplete={handleSubtaskComplete}
                  onStageComplete={() => handleStageComplete(1)}
                />
              )}
              {currentStage === 2 && (
                <Stage2Aerospace
                  onSubtaskComplete={handleSubtaskComplete}
                  onStageComplete={() => handleStageComplete(2)}
                />
              )}
              {currentStage === 3 && (
                <Stage3Physics
                  onSubtaskComplete={handleSubtaskComplete}
                  onStageComplete={() => handleStageComplete(3)}
                />
              )}
              {currentStage === 4 && (
                <Stage4ParachuteDesign
                  onSubtaskComplete={handleSubtaskComplete}
                  onParachuteTestSuccess={handleParachuteTestSuccess}
                />
              )}
            </div>
          )}

          {gameState === 'victory' && (
            <VictoryScreen
              studentName={studentName}
              totalScore={totalScore}
              completionTimeSeconds={elapsedSeconds}
              totalCorrectTasks={totalCorrectTasks}
              gamePlayMode={gamePlayMode}
              teamA={teamA}
              teamB={teamB}
              onPlayAgain={handlePlayAgain}
            />
          )}
        </div>

        {/* Stage Summary Modal (between stages) */}
        {summaryModalStage !== null && (
          <StageSummaryModal
            isOpen={true}
            stageName={STAGE_TITLES[summaryModalStage]}
            stageScoreEarned={stageScoreEarned}
            totalScore={totalScore}
            correctCount={totalCorrectTasks}
            keyTakeaway={STAGE_TAKEAWAYS[summaryModalStage]}
            onContinue={handleContinueNextStage}
          />
        )}

        {/* Teacher Settings Modal */}
        <TeacherSettingsModal
          isOpen={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          settings={settings}
          onUpdateSettings={(newVals) => {
            setSettings((prev) => ({ ...prev, ...newVals }));
            if (newVals.timerMinutes !== undefined) {
              setTimeRemainingSeconds(newVals.timerMinutes * 60);
            }
          }}
          currentStage={currentStage}
          onSelectStage={(stg) => {
            setCurrentStage(stg);
            setGameState('playing');
          }}
          onResetScore={() => {
            setTotalScore(0);
            setStageScoreEarned(0);
            setTotalCorrectTasks(0);
            setTeamA((prev) => ({ ...prev, score: 0, correctCount: 0 }));
            setTeamB((prev) => ({ ...prev, score: 0, correctCount: 0 }));
          }}
        />
      </BrazilianAtmosphere>
    </HandControlProvider>
  );
}
