import type { HeroStats, MonsterStats } from "../interfaces/characters";

class UpgradeService {
    upgradeList: any = [ 
        {msg: "+10 HP"},
        {msg: "+10 MP"},
        {msg: "+4 Attack"},
        {msg: "+2 Magic"},
        {msg: "+2 Heal"},
        {msg: "+1 MP Regen"},
    ] 

    upgradeMonsterList: any = [
        {msg: "+10 HP"},
        {msg: "+4 Attack"},
        {msg: "+2 Magic"},
        {msg: "+2 Heal"},
    ]

    selectUpgrade(msg: String, charStats: HeroStats | MonsterStats): HeroStats | MonsterStats {
        switch(msg) {
            case "+10 HP":
                charStats = this.lifeUpgrade(charStats);
                break;
            case "+10 MP":
                charStats = this.manaUpgrade(charStats);
                break
            case "+4 Attack":
                charStats = this.attackUpgrade(charStats);
                break
            case "+2 Magic":
                charStats = this.magicUpgrade(charStats);
                break
            case "+2 Heal":
                charStats = this.healUpgrade(charStats);
                break
            case "+1 MP Regen":
                charStats = this.manaRegenUpgrade(charStats);
                break
        }

        charStats.life = charStats.maxLife; //Refill character's life
        if("mana" in charStats) charStats.mana = charStats.maxMana;

        return charStats;
    }

    lifeUpgrade(charStats: HeroStats | MonsterStats) {
        charStats.maxLife += 10;
        return charStats
    }

    manaUpgrade(charStats: HeroStats | MonsterStats) {
        if("maxMana" in charStats) charStats.maxMana += 10;
        return charStats;
    }

    attackUpgrade(charStats: HeroStats | MonsterStats) {
        charStats.maxHit += 4;
        return charStats;
    }

    magicUpgrade(charStats: HeroStats | MonsterStats) {
        charStats.maxMagic += 2;
        return charStats;
    }

    healUpgrade(charStats: HeroStats | MonsterStats) {
        charStats.maxHeal += 2;
        return charStats;
    }

    manaRegenUpgrade(charStats: HeroStats | MonsterStats) {
        if("manaRegen" in charStats) charStats.manaRegen += 1;
        return charStats;
    }
}

export const upgradeService = new UpgradeService();