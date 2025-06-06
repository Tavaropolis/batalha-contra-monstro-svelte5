interface HeroStats {
    life: number,
    mana: number,
    manaRegen: number,
    maxHit: number,
    maxLife: number,
    maxMagic: number,
    maxMana: number
    maxHeal: number
}

interface MonsterStats {
    life: number,
    maxHit: number,
    maxMagic: number,
    maxHeal: number,
    maxLife: number
}

export type { HeroStats, MonsterStats };