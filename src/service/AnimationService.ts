import type { Sfx } from "../interfaces/game";

class AnimationService {
    pageElements:Map<string, HTMLElement> = new Map();
    sfxList: Sfx[] = [];

    registerElements(key: string, value: HTMLElement) {
        this.pageElements.set(key, value)
    }

    heroAttackAnimation() {
        this.pageElements.get("heroSprite")?.setAttribute("src", "/heroattack.png");

        this.pageElements.get("monsterCard")?.classList.add("box-hit");
        // damage? playSfx('heroAttack') : playSfx('heroMiss');

        this.pageElements.get("monsterCard")?.addEventListener('animationend', () => {
            this.pageElements.get("monsterCard")?.classList.remove("box-hit");
            if(this.pageElements.get("heroSprite")?.getAttribute("src") != '/herovictory.png' && this.pageElements.get("heroSprite")?.getAttribute("src") != '/herolost.png') {
                this.pageElements.get("heroSprite")?.setAttribute("src", "/hero.png");
            }
        }, { once: true })
    }

    heroCriticAnimations(): void {
        this.heroAttackAnimation();

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
        // this.playSfx('heroHeal');

        this.pageElements.get("heroCard")?.addEventListener('animationend', () => {
            this.pageElements.get("heroCard")?.classList.remove("green-spark");
            if(this.pageElements.get("heroSprite")?.getAttribute("src") != '/herovictory.png' && this.pageElements.get("heroSprite")?.getAttribute("src") != '/herolost.png') {
                this.pageElements.get("heroSprite")?.setAttribute("src", "/hero.png");
            }
        }, { once: true })
    }

    monsterAttackAnimation(): void {
        this.pageElements.get("monsterSprite")?.setAttribute("src", "/monsterattack.png");

        this.pageElements.get("heroCard")?.classList.add("box-hit");

        this.pageElements.get("heroCard")?.addEventListener('animationend', () => {
            this.pageElements.get("heroCard")?.classList.remove("box-hit");
            if(this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monstervictory.png' && this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monsterlost.png') {
                this.pageElements.get("monsterSprite")?.setAttribute("src", "/monster.png");
            }
        }, { once: true })
    }
    
    monsterCriticAnimations(): void {
        this.monsterAttackAnimation();

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

        this.pageElements.get("monsterCard")?.addEventListener('animationend', () => {
            this.pageElements.get("monsterCard")?.classList.remove("green-spark");
            if(this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monstervictory.png' && this.pageElements.get("monsterSprite")?.getAttribute("src") != '/monsterlost.png') {
                this.pageElements.get("monsterSprite")?.setAttribute("src", "/monster.png");
            }
        }, { once: true }) 
    }
    // playSfx(id: String) {
    //     for(let sfx of sfxList) {
    //         if(sfx.id === id) {
    //             sfx.htmlElement?.play();
    //             break;
    //         }      
    //     }
    // }
}

export const animationService = new AnimationService();