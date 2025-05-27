import type { Sfx } from "../interfaces/game";

class AnimationService {
    pageElements:Map<string, HTMLElement> = new Map();
    sfxElements: Map<string, HTMLAudioElement> = new Map();

    registerElements(key: string, value: HTMLElement) {
        this.pageElements.set(key, value); //Load HTMLElements in service
    }

    registerAudioElements(sfxList: Sfx[]) {
        for (let sfx of sfxList) {
            this.sfxElements.set(sfx.id, sfx.htmlElement!); //Load audio elements in service
        }
    }

    //Hero animations section
    heroAttackAnimation(damage: number) {
        this.pageElements.get("heroSprite")?.setAttribute("src", "/heroattack.png");

        this.pageElements.get("monsterCard")?.classList.add("box-hit");
        damage? this.sfxElements.get('heroAttack')?.play() : this.sfxElements.get('heroMiss')?.play();

        this.pageElements.get("monsterCard")?.addEventListener('animationend', () => {
            this.pageElements.get("monsterCard")?.classList.remove("box-hit");
            if(this.pageElements.get("heroSprite")?.getAttribute("src") != '/herovictory.png' && this.pageElements.get("heroSprite")?.getAttribute("src") != '/herolost.png') {
                this.pageElements.get("heroSprite")?.setAttribute("src", "/hero.png");
            }
        }, { once: true })
    }

    heroCriticAnimations(damage: number): void {
        this.heroAttackAnimation(damage);

        this.pageElements.get("mainPage")?.classList.add("green-spark");
        this.pageElements.get("mainPage")?.addEventListener('animationend', () => {
            this.pageElements.get("mainPage")?.classList.remove("green-spark");
        }, { once: true })

        this.pageElements.get("logsContainer")?.classList.add("critic-box");
        this.pageElements.get("logsContainer")?.addEventListener('animationend', () => {
            this.pageElements.get("logsContainer")?.classList.remove("critic-box");
        }, { once: true })
    }

    heroMagicAnimation(): void {
        this.pageElements.get("heroSprite")?.setAttribute("src", "/heromagic.png");

        this.pageElements.get("heroCard")?.classList.add("blue-spark");
        this.sfxElements.get('heroMagic')?.play();
        
        this.pageElements.get("heroCard")?.addEventListener('animationend', () => {
            this.pageElements.get("heroCard")?.classList.remove("blue-spark");

            if(this.pageElements.get("heroSprite")?.getAttribute("src") != '/herovictory.png' && this.pageElements.get("heroSprite")?.getAttribute("src") != '/herolost.png') {
                this.pageElements.get("heroSprite")?.setAttribute("src", "/hero.png");
            }
        }, { once: true })
    }

    heroHealAnimation(): void {
        this.pageElements.get("heroSprite")?.setAttribute("src", "/heroheal.png");

        this.pageElements.get("heroCard")?.classList.add("green-spark");
        this.sfxElements.get('heroHeal')?.play();

        this.pageElements.get("heroCard")?.addEventListener('animationend', () => {
            this.pageElements.get("heroCard")?.classList.remove("green-spark");
            if(this.pageElements.get("heroSprite")?.getAttribute("src") != '/herovictory.png' && this.pageElements.get("heroSprite")?.getAttribute("src") != '/herolost.png') {
                this.pageElements.get("heroSprite")?.setAttribute("src", "/hero.png");
            }
        }, { once: true })
    }

    //Monster animations section
    monsterAttackAnimation(damage: number): void {
        this.pageElements.get("monsterSprite")?.setAttribute("src", "/monsterattack.png");

        this.pageElements.get("heroCard")?.classList.add("box-hit");
        damage? this.sfxElements.get('monsterAttack')?.play() : this.sfxElements.get('monsterMiss')?.play();

        this.pageElements.get("heroCard")?.addEventListener('animationend', () => {
            this.pageElements.get("heroCard")?.classList.remove("box-hit");
            if(this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monstervictory.png' && this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monsterlost.png') {
                this.pageElements.get("monsterSprite")?.setAttribute("src", "/monster.png");
            }
        }, { once: true })
    }
    
    monsterCriticAnimations(damage: number): void {
        this.monsterAttackAnimation(damage);

        this.pageElements.get("mainPage")?.classList.add("red-spark");
        this.pageElements.get("mainPage")?.addEventListener('animationend', () => {
            this.pageElements.get("mainPage")?.classList.remove("red-spark");
        }, { once: true })

        this.pageElements.get("logsContainer")?.classList.add("critic-box");
        this.pageElements.get("logsContainer")?.addEventListener('animationend', () => {
            this.pageElements.get("logsContainer")?.classList.remove("critic-box");
        }, { once: true })
    }

    monsterMagicAnimation(): void {
        this.pageElements.get("monsterSprite")?.setAttribute("src", "/monstermagic.png");

        this.pageElements.get("monsterCard")?.classList.add("blue-spark");
        this.sfxElements.get('monsterMagic')?.play();

        this.pageElements.get("monsterCard")?.addEventListener('animationend', () => {
            this.pageElements.get("monsterCard")?.classList.remove("blue-spark");
            if(this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monstervictory.png' && this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monsterlost.png') {
                this.pageElements.get("monsterSprite")?.setAttribute("src", "/monster.png");
            }
        }, { once: true })
    }

    monsterHealAnimation() {
        this.pageElements.get("monsterSprite")?.setAttribute("src", "/monsterheal.png");

        this.pageElements.get("monsterCard")?.classList.add("green-spark");
        this.sfxElements.get('monsterHeal')?.play();

        this.pageElements.get("monsterCard")?.addEventListener('animationend', () => {
            this.pageElements.get("monsterCard")?.classList.remove("green-spark");
            if(this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monstervictory.png' && this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monsterlost.png') {
                this.pageElements.get("monsterSprite")?.setAttribute("src", "/monster.png");
            }
        }, { once: true }) 
    }
}

export const animationService = new AnimationService();