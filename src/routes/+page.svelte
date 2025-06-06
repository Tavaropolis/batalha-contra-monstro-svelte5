<script lang="ts">
import { onMount } from 'svelte';

//Components
import Footer from "../components/Footer.svelte"

//Services
import { animationService } from '../service/AnimationService';
import { upgradeService } from '../service/UpgradeService';

//Typescript interfaces
import type { HeroStats, MonsterStats } from "../interfaces/characters";
import type { GameStats, Sfx } from "../interfaces/game.ts";

let heroStats: HeroStats = $state({
    life: 100,
    mana: 100,
    manaRegen: 5,
    maxHit: 11,
    maxLife: 100,
    maxMana: 100,
    maxMagic: 21,
    maxHeal: 21
})

let monsterStats: MonsterStats = $state({
    life: 100,
    maxHit: 11,
    maxMagic: 21,
    maxHeal: 21,
    maxLife: 100
})

let gameStats: GameStats = $state({
    isGameStarted: false,
    heroVictory: false,
    heroGiveUp: false,
    monsterVictory: false,
    turnCounter: 1,
    isBgmActive: true,
    isSfxActive: true        
})

let logsList: String[] = $state([]); 
let isHeroButtonsAble: boolean = $state(true);
let listUpgrade: String[] = $state([]);

let sfxList: Sfx[] = [
    {id: "heroAttack", src: "/sfx/heroattack.wav", htmlElement: null},
    {id: "heroMiss", src: "/sfx/heromiss.wav", htmlElement: null},
    {id: "heroMagic", src: "/sfx/heromagic.wav", htmlElement: null},
    {id: "heroHeal", src: "/sfx/heroheal.wav", htmlElement: null},
    {id: "monsterAttack", src: "/sfx/heroattack.wav", htmlElement: null},
    {id: "monsterMiss", src: "/sfx/heromiss.wav", htmlElement: null},
    {id: "monsterMagic", src: "/sfx/heromagic.wav", htmlElement: null},
    {id: "monsterHeal", src: "/sfx/heroheal.wav", htmlElement: null},
    {id: "systemdenied", src: "/sfx/systemdenied.wav", htmlElement: null}
]


//HTML Elements
let mainPage: HTMLElement
// svelte-ignore non_reactive_update
let logsContainer: HTMLElement;
let heroCard: HTMLElement;
let lifeBar: HTMLElement;
let manaBar: HTMLElement;
let heroSprite: HTMLElement;
let monsterCard: HTMLElement;
let monsterLifeBar: HTMLElement;
let monsterSprite: HTMLElement;
let bgmSong: HTMLAudioElement;

//Preload the sprites to avoid lag
onMount(() => {
    let imageList = []
    let imagePathList = ["/heroattack.png", "/heromagic.png", "/heroheal.png", "/herovictory.png", "herolost.png"]

    for(let img of imagePathList) {
        let newImg = new Image();
        newImg.src = img;
        imageList.push(newImg);
    }

    animationRegister();
})

let animationRegister = (() => {
    animationService.registerElements("mainPage", mainPage);
    animationService.registerElements("logsContainer", logsContainer);
    animationService.registerElements("heroCard", heroCard);
    animationService.registerElements("heroSprite", heroSprite);
    animationService.registerElements("monsterCard", monsterCard);
    animationService.registerElements("monsterSprite", monsterSprite);
    
    animationService.registerAudioElements(sfxList);
})

//Defining the attack of the hero
let heroAttack = (async () => {
    ableDisableButtons(); // Deactivate player buttons
    let heroDamage = Math.floor(Math.random() * heroStats.maxHit);

    //checking if it's a critical attack
    if(heroDamage === heroStats.maxHit-1) {
        heroDamage += Math.floor(Math.random() * 4);
        animationService.heroCriticAnimations(heroDamage);
        logsList.unshift(`Hero hits the monster with ${heroDamage} critical damage`);
    } else {
        animationService.heroAttackAnimation(heroDamage);
        logsList.unshift(`Hero hits the monster with ${heroDamage} damage`);
    }
    
    if(monsterStats.life - heroDamage <= 0) {
        monsterStats.life = 0;
        gameStats.heroVictory = true;
        randomizeUpgrade();

        return;
    } else {
        monsterStats.life -= heroDamage;
    }

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.life <= 0) return; //Checking if monster kill the player

    changeTurn();
    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

//Defining the magic attack of the hero
let heroMagic = (async () => {
    if(heroStats.mana < 25) {
        logsList.unshift(`Not enough mana`);
        playSfx("systemdenied");
        return
    }

    ableDisableButtons();

    let playerMagic = Math.floor(Math.random() * (heroStats.maxMagic - 10)) + 10; //Calculate damage (10 to 20)
    heroStats.mana -= 25;
    animationService.heroMagicAnimation();
    logsList.unshift(`Hero hits the monster with ${playerMagic} magic damage`);
    
    if(monsterStats.life - playerMagic <= 0) {
        monsterStats.life = 0;
        gameStats.heroVictory = true;
        randomizeUpgrade();
        
        return;
    } else {
        monsterStats.life -= playerMagic;
    }

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.life <= 0) return; //Checking if monster kill the player

    changeTurn();
    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

let heroHeal = (async() => {
    if(heroStats.mana < 25) {
        logsList.unshift(`Not enough mana`);
        playSfx("systemdenied");
        return
    }

    ableDisableButtons(); // Deactivate player buttons

    let playerHealing = Math.floor(Math.random() * (heroStats.maxHeal - 10)) + 10;
    heroStats.mana -= 25;
    heroStats.life = (heroStats.life + playerHealing >= 100) ? 100 : heroStats.life += playerHealing;
    logsList.unshift(`Hero has healing ${playerHealing} HP`)
    animationService.heroHealAnimation();

    await new Promise<void> (resolve => setTimeout(() => {
        monsterTurn();
        resolve();
    }, 2000));

    if (heroStats.life <= 0) return; //Checking if monster kill the player

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
    let monsterDamage = Math.floor(Math.random() * monsterStats.maxHit);

    //checking if it's a critical attack
    if(monsterDamage === monsterStats.maxHit-1) {
        monsterDamage += Math.floor(Math.random() * 4);
        animationService.monsterCriticAnimations(monsterDamage); 
        logsList.unshift(`Monster hits the hero with ${monsterDamage} critical damage`)
    } else {
        animationService.monsterAttackAnimation(monsterDamage);
        logsList.unshift(`Monster hits the hero with ${monsterDamage} damage`)
    }
    
    if(heroStats.life - monsterDamage <= 0) {
        heroStats.life = 0;
        gameStats.monsterVictory = true;
        return;
    } else {
        heroStats.life -= monsterDamage;
    }
})

let monsterMagic = (() => {
    let monsterMagic = Math.floor(Math.random() * (monsterStats.maxMagic - 10)) + 10;
    animationService.monsterMagicAnimation();
    logsList.unshift(`Monster hits the hero with ${monsterMagic} magic damage`);
    
    if(heroStats.life - monsterMagic <= 0) {
        heroStats.life = 0;
        gameStats.monsterVictory = true;
        return;
    } else {
        heroStats.life -= monsterMagic;
    }
})

let monsterHeal = (() => {
    let monsterHealing = Math.floor(Math.random() * (monsterStats.maxHeal - 10)) + 10;
    monsterStats.life = (monsterStats.life + monsterHealing >= 100) ? 100 : monsterStats.life += monsterHealing;
    logsList.unshift(`Monster has healing ${monsterHealing} HP`)
    animationService.monsterHealAnimation();
})

let gameStart = (() => {
    gameStats.isGameStarted = !gameStats.isGameStarted;
    bgmSong.play();
})

let bgmVolume = (() => {
    gameStats.isBgmActive = !gameStats.isBgmActive;
    gameStats.isBgmActive? bgmSong.volume = 1.0 : bgmSong.volume = 0.0;
})

let sfxVolume = (() => {
    gameStats.isSfxActive = !gameStats.isSfxActive;

    if(gameStats.isSfxActive) {
        for(let sfx of sfxList) sfx.htmlElement!.volume = 1.0;
    } else {
        for(let sfx of sfxList) sfx.htmlElement!.volume = 0.0;
    }
})

let playSfx = ((id: String) => {
    for(let sfx of sfxList) {
        if(sfx.id === id) {
            sfx.htmlElement?.play();
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
    if(heroStats.mana + heroStats.manaRegen < 100) {
        heroStats.mana += heroStats.manaRegen;
    }
})

let randomizeUpgrade = (() => {
    listUpgrade = [];
    while(listUpgrade.length < 3) {
        let msg = upgradeService.upgradeList[Math.floor(Math.random() * upgradeService.upgradeList.length)].msg;
        if(!listUpgrade.includes(msg)) {
            listUpgrade.push(msg);
        }
    }
})

let newBattle = ((msg: String) => {
    try {
        heroStats = upgradeService.selectUpgrade(msg, heroStats) as HeroStats;
        monsterStats = upgradeService.selectUpgrade(upgradeService.upgradeMonsterList[Math.floor(Math.random() * upgradeService.upgradeMonsterList.length+1)].msg, monsterStats)
        gameStats.heroVictory = false;
        gameStats.isGameStarted = true;
        isHeroButtonsAble = true;
        logsList = [];
        heroSprite?.setAttribute("src", "/hero.png");
    } catch {

    }
})

$effect(() => {
    $inspect(heroStats);
    $inspect(monsterStats);
})

$effect(() => {
    monsterLifeBar.style.width = `${monsterStats.life}%`; //Changes the lifebar size

    if(monsterStats.life <=0 ) {
        heroSprite.setAttribute("src", "/herovictory.png");
    }

    //For health bar color
    if(monsterStats.life <= 25) {
        monsterLifeBar.style.backgroundColor = "red";
    } else {
        monsterLifeBar.style.backgroundColor = "greenyellow";
    }
})

$effect(() => {
    if(heroStats.life > 100) {
        lifeBar.style.width = `100%`
    } else {
        lifeBar.style.width = `${heroStats.life}%`; //Changes the lifebar size
    }

    //For defeated hero sprite
    if(heroStats.life <=0 ) {
        heroSprite.setAttribute("src", "/herolost.png");
    }
    
    //For health bar color
    if(heroStats.life <= 25) {
        lifeBar.style.backgroundColor = "red";
    } else {
        lifeBar.style.backgroundColor = "greenyellow";
    }
})

$effect(() => {
    if(heroStats.mana > 100) {
        manaBar.style.width = `100%`
    } else {
        manaBar.style.width = `${heroStats.mana}%`; //Changes the manabar size
    } 
})

</script>
<div bind:this={ mainPage } class="main-page">
    <nav>
        <button onclick="{bgmVolume}" class:button-inactive={!gameStats.isBgmActive}>BGM</button>
        <button onclick="{sfxVolume}" class:button-inactive={!gameStats.isSfxActive}>SFX</button>
    </nav>
    <main>
        <h1>Battle against the Monster</h1>
        <p>Use your skills to defeat the monster</p>
        <section id="characters">
            <div class="character-container">
                <div bind:this={monsterCard} class="character-card" id="monster">
                    <img bind:this={monsterSprite} src="/monster.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={monsterLifeBar} class="internal-bar"><span>{ monsterStats.life }</span></div>
                </div>
            </div>
            <div class="character-container">
                <div bind:this= {heroCard} class="character-card" id="hero">
                    <img bind:this={heroSprite} src="/hero.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={lifeBar} class="internal-bar"><span>{ heroStats.life }</span></div>
                </div>
                <div class="external-bar">
                    <div bind:this={manaBar} class="internal-mana-bar"><span>{ heroStats.mana }</span></div>
                </div>
                {#if gameStats.isGameStarted}
                <div class="buttons-row">
                    <button onclick="{heroAttack}" disabled={!isHeroButtonsAble}>Attack</button>
                    <button onclick="{heroMagic}" disabled={!isHeroButtonsAble}>Magic</button>
                    <button onclick="{heroHeal}" disabled={!isHeroButtonsAble}>Heal</button>
                    <button onclick="{heroGiveUpAction}" disabled={!isHeroButtonsAble}>Give Up</button>
                </div>
                {/if}
            </div>
        </section>
        {#if !gameStats.isGameStarted}
        <div class="start-container">
            <button onclick="{gameStart}">START</button>
        </div>
        {/if}
        {#if gameStats.heroVictory}
        <div class="start-container">
            <button onclick="{() => newBattle(listUpgrade[0])}">{listUpgrade[0]}</button>
            <button onclick="{() => newBattle(listUpgrade[1])}">{listUpgrade[1]}</button>
            <button onclick="{() => newBattle(listUpgrade[2])}">{listUpgrade[2]}</button>
        </div>
        {/if}
        {#if gameStats.isGameStarted}
        <div bind:this={ logsContainer } class="logs">
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
        {/if}
    </main>
    <Footer/>
    {#each sfxList as sfx, index (index)}
        <audio id={sfx.id} src={sfx.src} bind:this={sfx.htmlElement} preload="auto"></audio>
    {/each}
    <audio src="/bgm/thechameleon.wav" bind:this={bgmSong} loop></audio>
</div>

<style>
@font-face {
  font-family: "runescape";
  src: url(../../fonts/runescape_uf.woff) format('woff');
}

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

nav {
    position: absolute;
    top: 3px;
    left: 3px
}

nav button {
    color: white;
    background-color: black;
    border: 3px double white;  
}

.button-inactive {
    color: grey;
    border: 3px double grey;  
}

main h1 {
    font-size: 3rem;
}

section#characters{
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.character-container {
    display: flex;
    flex-direction: column; 
    align-items: center;
    min-width: 22vw;
}

.character-card {
    width: 15vw;
    height: 30vh;
    border: 10px double white;  
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

.start-container { 
    width: 60vw;
    height: 6vh;
    padding: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 10px double white;
}

.start-container > button {
    width: 8vw;
    height: 3.5vh
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

  nav {
    position: static;
    align-self: flex-start
  }
  
  nav button {
    width: 15vw;
    height: 5vh;
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