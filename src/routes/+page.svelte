<script lang="ts">
//Components
import Footer from "../components/Footer.svelte"

//Typescript interfaces
import type { HeroStats } from "../interfaces/hero.ts";
import type { GameStats } from "../interfaces/game.ts";

let heroStats: HeroStats = $state({
    heroLife: 100,
    heroMana: 100
})

let gameStats: GameStats = $state({
    heroVictory: false,
    heroGiveUp: false,
    monsterVictory: false,
    turnCounter: 1    
})

let monsterLife: number = $state(100);
let logsList: string[] = $state([]); 
let isHeroButtonsAble: boolean = $state(true);
let sfxList: any = [
    {id: "heroAttack", src: "/sfx/heroattack.wav", htmlElement: null},
    {id: "heroMagic", src: "/sfx/heromagic.wav", htmlElement: null},
    {id: "heroHeal", src: "/sfx/heroheal.wav", htmlElement: null},
    {id: "systemdenied", src: "/sfx/systemdenied.wav", htmlElement: null}
]

//HTML Elements
let mainPage: HTMLElement;
let logsContainer: HTMLElement;
let heroCard: HTMLElement;
let heroLifeBar: HTMLElement;
let heroManaBar: HTMLElement;
let heroSprite: HTMLElement;
let monsterCard: HTMLElement;
let monsterLifeBar: HTMLElement;
let monsterSprite: HTMLElement;

//Defining the attack of the hero
let heroAttack = (async () => {
    ableDisableButtons(); // Deactivate player buttons
    let playerDamage = Math.floor(Math.random() * 11); //Calculate damage (0 to 10)

    //checking if it's a critical attack
    if(playerDamage == 10) {
        playerDamage += Math.floor(Math.random() * 4);
        heroCriticAnimations();
        logsList.unshift(`Hero hits the monster with ${playerDamage} critical damage`)
    } else {
        heroAttackAnimation();
        logsList.unshift(`Hero hits the monster with ${playerDamage} damage`)
    }
    
    if(monsterLife - playerDamage <= 0) {
        monsterLife = 0;
        gameStats.heroVictory = true;
        return;
    } else {
        monsterLife -= playerDamage;
    }

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.heroLife <= 0) return; //Checking if monster kill the player

    changeTurn();
    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

//Defining the magic attack of the hero
let heroMagic = (async () => {
    if(heroStats.heroMana < 25) {
        logsList.unshift(`Not enough mana`);
        playSfx("systemdenied");
        return
    }

    ableDisableButtons();

    let playerMagic = Math.floor(Math.random() * (21 - 10)) + 10; //Calculate damage (10 to 20)
    heroStats.heroMana -= 25;
    heroMagicAnimation();
    logsList.unshift(`Hero hits the monster with ${playerMagic} magic damage`);
    
    if(monsterLife - playerMagic <= 0) {
        monsterLife = 0;
        gameStats.heroVictory = true;
        return;
    } else {
        monsterLife -= playerMagic;
    }

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.heroLife <= 0) return; //Checking if monster kill the player

    changeTurn();
    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

let heroHeal = (async() => {
    if(heroStats.heroMana < 25) {
        logsList.unshift(`Not enough mana`);
        playSfx("systemdenied");
        return
    }

    ableDisableButtons(); // Deactivate player buttons

    let playerHealing = Math.floor(Math.random() * (21 - 10)) + 10;
    heroStats.heroMana -= 25;
    heroStats.heroLife = (heroStats.heroLife + playerHealing >= 100) ? 100 : heroStats.heroLife += playerHealing;
    logsList.unshift(`Hero has healing ${playerHealing} HP`)
    heroHealAnimation();

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.heroLife <= 0) return; //Checking if monster kill the player

    changeTurn();
    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

let heroGiveUpAction = (() => {
    ableDisableButtons();
    gameStats.heroGiveUp = true;
})

let monsterTurn = (() => {
    let monsterAction = Math.floor(Math.random() * 101);

    if(monsterAction <= 65) {
        monsterAttack();
    } else if (monsterAction >= 66 && monsterAction <= 85) {
        monsterMagic();
    } else {
        monsterHeal();
    }
})

//Defining the attack of the monster
let monsterAttack = (() => {
    let monsterDamage = Math.floor(Math.random() * 11);

    //checking if it's a critical attack
    if(monsterDamage == 10) {
        monsterDamage += Math.floor(Math.random() * 4);
        monsterCriticAnimations() 
        logsList.unshift(`Monster hits the hero with ${monsterDamage} critical damage`)
    } else {
        monsterAttackAnimation();
        logsList.unshift(`Monster hits the hero with ${monsterDamage} damage`)
    }
    
    if(heroStats.heroLife - monsterDamage <= 0) {
        heroStats.heroLife = 0;
        gameStats.monsterVictory = true;
        return;
    } else {
        heroStats.heroLife -= monsterDamage;
    }
})

let monsterMagic = (() => {
    let monsterMagic = Math.floor(Math.random() * (21 - 10)) + 10;
    monsterMagicAnimation();
    logsList.unshift(`Monster hits the hero with ${monsterMagic} magic damage`);
    
    if(heroStats.heroLife - monsterMagic <= 0) {
        heroStats.heroLife = 0;
        gameStats.monsterVictory = true;
        return;
    } else {
        heroStats.heroLife -= monsterMagic;
    }
})

let monsterHeal = (() => {
    let monsterHealing = Math.floor(Math.random() * (21 - 10)) + 10;
    monsterLife = (monsterLife + monsterHealing >= 100) ? 100 : monsterLife += monsterHealing;
    logsList.unshift(`Monster has healing ${monsterHealing} HP`)
    monsterHealAnimation();
})

let heroAttackAnimation = (() => {
    heroSprite.setAttribute("src", "/heroattack.png");

    monsterCard?.classList.add("box-hit");
    playSfx('heroAttack');

    monsterCard?.addEventListener('animationend', () => {
        monsterCard?.classList.remove("box-hit");
        if(heroSprite.getAttribute("src") != '/herovictory.png' && heroSprite.getAttribute("src") != '/herolost.png') {
            heroSprite.setAttribute("src", "/hero.png");
        }
    }, { once: true })
})

let heroMagicAnimation = (() => {
    heroSprite.setAttribute("src", "/heromagic.png");

    heroCard?.classList.add("blue-spark");
    playSfx("heroMagic");
    
    heroCard?.addEventListener('animationend', () => {
        heroCard?.classList.remove("blue-spark");
        if(heroSprite.getAttribute("src") != '/herovictory.png' && heroSprite.getAttribute("src") != '/herolost.png') {
            heroSprite.setAttribute("src", "/hero.png");
        }
    }, { once: true })
})

let heroHealAnimation = (() => {
    heroSprite.setAttribute("src", "/heroheal.png");

    heroCard?.classList.add("green-spark");
    playSfx('heroHeal');

    heroCard?.addEventListener('animationend', () => {
        heroCard?.classList.remove("green-spark");
        if(heroSprite.getAttribute("src") != '/herovictory.png' && heroSprite.getAttribute("src") != '/herolost.png') {
            heroSprite.setAttribute("src", "/hero.png");
        }
    }, { once: true })
})

let heroCriticAnimations = (() => {
    heroAttackAnimation();
    
    mainPage?.classList.add("green-spark");
    mainPage?.addEventListener('animationend', () => {
        mainPage?.classList.remove("green-spark");
    }, { once: true })

    logsContainer?.classList.add("critic-box");
    logsContainer?.addEventListener('animationend', () => {
        logsContainer?.classList.remove("critic-box");
    }, { once: true })
})

let monsterAttackAnimation = (() => {
    monsterSprite.setAttribute("src", "/monsterattack.png");

    heroCard?.classList.add("box-hit"); 
    heroCard?.addEventListener('animationend', () => {
        heroCard?.classList.remove("box-hit");
        if(monsterSprite.getAttribute("src") != '/monstervictory.png' && monsterSprite.getAttribute("src") != '/monsterlost.png') {
            monsterSprite.setAttribute("src", "/monster.png");
        }
    }, { once: true })
})

let monsterMagicAnimation = (() => {
    monsterSprite.setAttribute("src", "/monstermagic.png");

    monsterCard?.classList.add("blue-spark");
    monsterCard?.addEventListener('animationend', () => {
        monsterCard?.classList.remove("blue-spark");
        if(monsterSprite.getAttribute("src") != '/monstervictory.png' && monsterSprite.getAttribute("src") != '/monsterlost.png') {
            monsterSprite.setAttribute("src", "/monster.png");
        }
    }, { once: true })
})

let monsterHealAnimation = (() => {
    monsterSprite.setAttribute("src", "/monsterheal.png");

    monsterCard?.classList.add("green-spark");
    monsterCard?.addEventListener('animationend', () => {
        monsterCard?.classList.remove("green-spark");
        if(monsterSprite.getAttribute("src") != '/monstervictory.png' && monsterSprite.getAttribute("src") != '/monsterlost.png') {
            monsterSprite.setAttribute("src", "/monster.png");
        }
    }, { once: true })    
})

let monsterCriticAnimations = (() => {
    monsterAttackAnimation();

    mainPage?.classList.add("red-spark");
    mainPage?.addEventListener('animationend', () => {
        mainPage?.classList.remove("red-spark");
    }, { once: true })

    logsContainer?.classList.add("critic-box");
    logsContainer?.addEventListener('animationend', () => {
        logsContainer?.classList.remove("critic-box");
    }, { once: true })

})

let playSfx = ((id: String) => {
    for(let sfx of sfxList) {
        if(sfx.id === id) {
            sfx.htmlElement.play();
            break;
        }      
    }
})

let ableDisableButtons = (() => {
    isHeroButtonsAble = !isHeroButtonsAble;
})

// Fills 5 mana per turn
let changeTurn = (() => {
    gameStats.turnCounter++
    if(heroStats.heroMana + 5 < 100) {
        heroStats.heroMana += 5;
    }
})

$effect(() => {
    monsterLifeBar.style.width = `${monsterLife}%`; //Changes the lifebar size

    if(monsterLife <=0 ) {
        heroSprite.setAttribute("src", "/herovictory.png");
    }

    //For health bar color
    if(monsterLife <= 25) {
        monsterLifeBar.style.backgroundColor = "red";
    } else {
        monsterLifeBar.style.backgroundColor = "greenyellow";
    }
})

$effect(() => {
    heroLifeBar.style.width = `${heroStats.heroLife}%`; //Changes the lifebar size

    //For defeated hero sprite
    if(heroStats.heroLife <=0 ) {
        heroSprite.setAttribute("src", "/herolost.png");
    }
    
    //For health bar color
    if(heroStats.heroLife <= 25) {
        heroLifeBar.style.backgroundColor = "red";
    } else {
        heroLifeBar.style.backgroundColor = "greenyellow";
    }
})

$effect(() => {
    heroManaBar.style.width = `${heroStats.heroMana}%`; //Changes the manabar size
})

</script>
<div bind:this={ mainPage } class="main-page">
    <main>
        <h1>Battle against the Monster</h1>
        <p>Use your skills to defeat the monster</p>
        <section id="characters">
            <div class="character-container">
                <div bind:this={monsterCard} class="character-card" id="monster">
                    <img bind:this={monsterSprite} src="/monster.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={monsterLifeBar} class="internal-bar"><span>{ monsterLife }</span></div>
                </div>
            </div>
            <div class="character-container">
                <div bind:this= {heroCard} class="character-card" id="hero">
                    <img bind:this={heroSprite} src="/hero.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={heroLifeBar} class="internal-bar"><span>{ heroStats.heroLife }</span></div>
                </div>
                <div class="external-bar">
                    <div bind:this={heroManaBar} class="internal-mana-bar"><span>{ heroStats.heroMana }</span></div>
                </div>
                <div class="buttons-row">
                    <button onclick="{heroAttack}" disabled={!isHeroButtonsAble}>Attack</button>
                    <button onclick="{heroMagic}" disabled={!isHeroButtonsAble}>Magic</button>
                    <button onclick="{heroHeal}" disabled={!isHeroButtonsAble}>Heal</button>
                    <button onclick="{heroGiveUpAction}" disabled={!isHeroButtonsAble}>Give Up</button>
                </div>
            </div>
        </section>
        <div bind:this={ logsContainer } class="logs-container">
            <div class="logs">
            {#if !gameStats.heroVictory && !gameStats.monsterVictory && !gameStats.heroGiveUp}
                <ul>
                    {#each logsList as log, index (index)}
                        <li>{ log }</li>
                    {/each}
                </ul>
            {:else if gameStats.heroVictory}
                <h2 class="text-spark">VICTORY!</h2>
            {:else if gameStats.monsterVictory}
                <h2 class="text-spark">GAME OVER</h2>
            {:else if gameStats.heroGiveUp}
                <h2 class="text-spark">YOU GAVE UP THE BATTLE</h2>
            {/if}
            </div>
        </div>
    </main>
    <Footer/>
    {#each sfxList as sfx, index (index)}
        <audio id={sfx.id} src={sfx.src} bind:this={sfx.htmlElement} preload="auto"></audio>
    {/each}
</div>

<style>
* {
    box-sizing: border-box;
}

.main-page {
    width: 100%;
    min-height: 100vh;
    background-color: black;
    font-family: runescape;
    color: yellow;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
}

main {
    flex: 1;
}

main h1 {
    font-size: 3rem;
}

section#characters{
    min-width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.character-container {
    display: flex;
    flex-direction: column; 
    align-items: center;
}

.character-card {
    width: 15vw;
    height: 30vh;
    border: 10px double white;
    margin: 20px;
}

.character-card img {
    width: 85%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
}

.external-bar {
    width: 15vw;
    height: 3vh;
    border: 1px solid white;
    margin: 2px 12px;
}

.internal-bar {
    width: 100%;
    height: 100%;
    background-color: greenyellow;
}

.internal-mana-bar {
    width: 100%;
    height: 100%;
    background-color: blue;
}

.internal-bar span, .internal-mana-bar span {
    color: white;
}

.internal-bar, .internal-mana-bar {
  transition: width 0.3s ease-out, background-color 0.3s ease;
}

.logs-container {
    width: 100vw;
    display: flex;
    justify-content: center;
}

.logs {
    width: 60vw;
    height: 40vh;
    border: 10px double white;
    margin: 10px;
    overflow-y: scroll;
}

.logs li:nth-child(1) {
    font-size: 3.5rem;
    margin: 5px;
}

h2 {
    margin: 20px;
    font-size: 5rem;
}

.buttons-row {
    margin: 5px;
}

button {
    width: 5vw;
    height: 3vh;
    outline: none;
    border: double 2px black;
    box-shadow: none;
    border-radius: 0px;
    background-color: white;
    font-family: 'runescape';
    overflow: hidden;
}

button:hover {
    cursor: pointer;
    text-decoration: underline;
}

/*Animations*/
@keyframes box-hit {
    20% { transform: translateX(-20px);}
    40% { transform: translateX(20px);}
    60% { transform: translateX(-10px);}
    80% { transform: translateX(10px);}
    100% { transform: translateX(0px);}
}

:global(.box-hit) {
    animation: box-hit 0.5s linear;
}

@keyframes green-spark {
    0%   {background-color: black;}
    25%  {background-color:greenyellow;}
    50%  {background-color: black;}
    75%  {background-color:greenyellow;}
    100% {background-color: black;}
}

:global(.green-spark) {
    animation: green-spark 1s linear;
}

@keyframes critic-box {
    20% { transform: translateX(-20px);}
    40% { transform: translateX(20px);}
    60% { transform: translateX(-10px);}
    80% { transform: translateX(10px);}
    100% { transform: translateX(0px);}
}

:global(.critic-box) {
    animation: critic-box 1s linear;
}

@keyframes red-spark{
    0%   {background-color: black;}
    25%  {background-color:red;}
    50%  {background-color: black;}
    75%  {background-color:red;}
    100% {background-color: black;}
}

:global(.red-spark) {
    animation: red-spark 1s linear;
}

@keyframes blue-spark {
    0%   {background-color: black;}
    25%  {background-color:blue;}
    50%  {background-color: black;}
    75%  {background-color:blue;}
    100% {background-color: black;}
}

:global(.blue-spark) {
    animation: blue-spark 1s linear;
}

@keyframes text-spark {
    0%   {opacity: 0;}
    25%  {opacity: 1;}
    50%  {opacity: 0;}
    75%  {opacity: 1;}
    100% {opacity: 0;}
}

:global(.text-spark) {
    animation: text-spark 2s linear;
    animation-iteration-count: infinite;
}

/*Scrollbar and webkit*/ 
::-webkit-scrollbar {
    width: 12px; /* Largura da barra de rolagem */
}

::-webkit-scrollbar-track {
    background: #888; /* Cor do fundo da barra de rolagem */
}

::-webkit-scrollbar-thumb {
    background: #f1f1f1; /* Cor da parte que você arrasta */
    border-radius: 6px; /* Arredonda as bordas da parte que você arrasta */
}

::-webkit-scrollbar-thumb:hover {
    background: #555; /* Cor da parte que você arrasta quando está em foco */
}

/* Estilo do botão superior e inferior da barra de rolagem (setas) */
::-webkit-scrollbar-button {
display: none; /* Ocultar as setas de rolagem (opcional) */
}

/* Responsivity */
@media (max-width: 1024px) {
  main h1 {
    font-size: 2.5rem;
  }
  
  .character-card {
    width: 20vw;
    height: 25vh;
  }
  
  .external-bar {
    width: 20vw;
  }
  
  .logs {
    width: 80vw;
  }
  
  button {
    width: 8vw;
  }
}

@media (max-width: 768px) {
  main h1 {
    font-size: 2rem;
  }
  
  section#characters {
    flex-direction: column;
  }
  
  .character-card {
    width: 30vw;
    height: 20vh;
    margin: 10px;
  }
  
  .external-bar {
    width: 30vw;
  }
  
  .logs {
    width: 90vw;
    height: 30vh;
  }
  
  .buttons-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  button {
    width: 25vw;
  }
}

@media (max-width: 480px) {
  main h1 {
    font-size: 1.8rem;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  
  main p {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .character-card {
    width: 45vw;
    height: 15vh;
    border-width: 5px;
    margin: 5px;
  }
  
  .external-bar {
    width: 45vw;
    height: 2vh;
  }
  
  .logs {
    height: 25vh;
    border-width: 5px;
  }
  
  .logs li:nth-child(1) {
    font-size: 2rem;
  }
  
  button {
    width: 40vw;
  }
  
  h2 {
    font-size: 3rem;
  }
}

@media (max-width: 320px) {
  main h1 {
    font-size: 1.5rem;
  }
  
  .character-card {
    width: 60vw;
  }
  
  .external-bar {
    width: 60vw;
  }
  
  button {
    width: 70vw;
    margin-bottom: 5px;
  }
  
  .buttons-row {
    flex-direction: column;
  }
}
</style>