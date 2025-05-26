export interface GameStats {
    isGameStarted: boolean,
    heroVictory: boolean,
    heroGiveUp: boolean,
    monsterVictory: boolean,
    turnCounter: number,
    isBgmActive: boolean,
    isSfxActive: boolean        
}

export interface Sfx {
    id: string,
    src: string,
    htmlElement: HTMLAudioElement | null
}

export interface AnimationResult {
  spriteUrl: string;
  cssClasses: string[];
  sfxId: string;
  elements: string[];
}
// export type { GameStats, Sfx };