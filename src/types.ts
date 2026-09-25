export type ControlMode = 'mouse' | 'gesture';

export type StageId = 1 | 2 | 3 | 4;

export type GestureType = 'open' | 'fist' | 'thumbs_up' | 'none';

export type GamePlayMode = 'single' | 'versus';

export type TeamId = 'teamA' | 'teamB';

export interface TeamInfo {
  id: TeamId;
  name: string;
  score: number;
  correctCount: number;
  color: 'emerald' | 'amber';
}

export interface DragItem {
  id: string;
  label: string;
  category?: string;
  iconType?: string;
  imageAlt?: string;
  isDistractor?: boolean;
  assignedTargetId?: string | null;
  targetId?: string; // correct target ID
  initialPosition?: { x: number; y: number };
}

export interface DropZone {
  id: string;
  title: string;
  description?: string;
  expectedItemId?: string | string[]; // Single ID or any of acceptable IDs
  acceptedItemIds?: string[];
  currentAcceptedItemIds: string[];
  maxItems?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface TeacherSettings {
  timedMode: boolean;
  timerMinutes: number;
  soundEnabled: boolean;
  isMuted?: boolean;
  cameraEnabled: boolean;
  controlMode: ControlMode;
  basePointsFirstTry: number;
  basePointsSecondTry?: number;
  basePointsThirdTry?: number;
  stageBonus?: number;
  parachuteBonus?: number;
  shuffleItems: boolean;
  gestureSensitivity: 'low' | 'medium' | 'high';
}

export interface HandPointerState {
  x: number; // screen pixel x
  y: number; // screen pixel y
  normalizedX: number; // 0 to 1
  normalizedY: number; // 0 to 1
  isGrabbing: boolean;
  gesture: GestureType; // 'open' | 'fist' | 'thumbs_up' | 'none'
  confidence: number;
  isDetected: boolean;
  lastDetectedTimestamp: number;
  handIndex?: number; // 0 for Hand 1 (Team 1), 1 for Hand 2 (Team 2)
  teamId?: TeamId;
}

export interface VersusSlot {
  id: string;
  title: string;
  description: string;
  expectedItemId: string;
  completedItem?: DragItem | null;
}

export interface VersusChallengeRound {
  roundId: number;
  topicTitle: string;
  subtitle: string;
  slots: {
    id: string;
    title: string;
    description: string;
    expectedItemId: string;
  }[];
  items: {
    id: string;
    label: string;
    subtitle?: string;
    iconEmoji: string;
    targetSlotId: string;
  }[];
}
