interface GameStats {
    isGameStarted: boolean,
    heroVictory: boolean,
    heroGiveUp: boolean,
    monsterVictory: boolean,
    turnCounter: number,
    isBgmActive: boolean,
    isSfxActive: boolean        
}

interface Sfx {
    id: string,
    src: string,
    htmlElement: HTMLAudioElement | null
}
export type { GameStats, Sfx };