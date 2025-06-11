export interface GameStats {
    isGameStarted: boolean,
    heroVictory: boolean,
    heroWinStreak: number,
    heroGiveUp: boolean,
    monsterVictory: boolean,
    turnCounter: number,
    isBgmActive: boolean,
    isSfxActive: boolean,
    isStatsActive: boolean,
    isMonsterStatActive: boolean        
}

export interface Sfx {
    id: string,
    src: string,
    htmlElement: HTMLAudioElement | null
}

