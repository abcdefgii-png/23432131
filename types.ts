export type AppStep = 'mood' | 'vent' | 'select' | 'reveal';

export type MoodType = 'tired' | 'annoyed' | 'low' | 'empty' | 'confused' | 'okay';

export type ToneType = 'gentle' | 'sober' | 'light';

export interface CardContent {
  id: string;
  tag: string;
  empathy: string; // The "catching" phrase
  response: {
    gentle: string;
    sober: string;
    light: string;
  };
  action: {
    gentle: string;
    sober: string;
    light: string;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  cardId: string;
  mood: MoodType;
  tone: ToneType;
  userNote?: string;
}

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}