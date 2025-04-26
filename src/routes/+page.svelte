<script lang="ts">
let monsterLife: number = $state(100);
let heroLife: number = $state(100);
let heroMana: number = $state(100);
let logsList: string[] = $state([]); 
let isHeroButtonsAble: boolean = $state(true);
let heroVictory: boolean = $state(false);
let heroGiveUp: boolean = $state(false);
let monsterVictory: boolean = $state(false);

//HTML Elements
let mainPage: HTMLElement;
let logsContainer: HTMLElement;
let monsterLifeBar: HTMLElement;
let heroLifeBar: HTMLElement;
let monsterCard: HTMLElement;
let heroCard: HTMLElement;

//Defining the attack of the hero
let heroAttack = (() => {
    ableDisableButtons(); // Deactivate player buttons
    let playerDamage = Math.floor(Math.random() * 11);

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
        heroVictory = true;
        return;
    } else {
        monsterLife -= playerDamage;
    }
    monsterLifeBar.style.width = `${monsterLife}%`; //Changes the lifebar size

    setTimeout(monsterAttack, 1000);

    if (heroLife <= 0) return; //Checking if monster kill the player

    setTimeout(ableDisableButtons, 2000); // Activate player buttons
})

let heroGiveUpAction = (() => {
    ableDisableButtons();
    heroGiveUp = true;
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
    
    if(heroLife - monsterDamage <= 0) {
        heroLife = 0;
        monsterVictory = true;
        return;
    } else {
        heroLife -= monsterDamage;
    }

    heroLifeBar.style.width = `${heroLife}%`; //Changes the lifebar size
})

let heroAttackAnimation = (() => {
    monsterCard?.classList.remove("box-hit");
    void monsterCard?.offsetWidth;
    monsterCard?.classList.add("box-hit");
})

let monsterAttackAnimation = (() => {
    heroCard?.classList.remove("box-hit");
    void heroCard?.offsetWidth;
    heroCard?.classList.add("box-hit"); 
})

let heroCriticAnimations = (() => {
    heroAttackAnimation();
    
    mainPage?.classList.remove("hero-critic-background");
    void mainPage?.offsetWidth;
    mainPage?.classList.add("hero-critic-background");

    logsContainer?.classList.remove("critic-box");
    void logsContainer?.offsetWidth;
    logsContainer?.classList.add("critic-box");
})

let monsterCriticAnimations = (() => {
    monsterAttackAnimation();

    mainPage?.classList.remove("monster-critic-background");
    void mainPage?.offsetWidth;
    mainPage?.classList.add("monster-critic-background");

    logsContainer?.classList.remove("critic-box");
    void logsContainer?.offsetWidth;
    logsContainer?.classList.add("critic-box");
})

let ableDisableButtons = (() => {
    isHeroButtonsAble = !isHeroButtonsAble;
})

$effect(() => {
    if(monsterLife <= 25) {
        monsterLifeBar.style.backgroundColor = "red";
    } else {
        monsterLifeBar.style.backgroundColor = "greenyellow";
    }
})

$effect(() => {
    if(heroLife <= 25) {
        heroLifeBar.style.backgroundColor = "red";
    } else {
        heroLifeBar.style.backgroundColor = "greenyellow";
    }
})

</script>
<div bind:this={ mainPage } class="main-page">
    <main>
        <h1>Battle against the Monster</h1>
        <p>Use your skills to defeat the monster</p>
        <section id="characters">
            <div class="character-container">
                <div bind:this={monsterCard} class="character-card" id="monster">
                    <img src="/monster.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={monsterLifeBar} class="internal-bar"><span>{ monsterLife }</span></div>
                </div>
            </div>
            <div class="character-container">
                <div bind:this= {heroCard} class="character-card" id="hero">
                    <img src="/hero.png" alt="">
                </div>
                <div class="external-bar">
                    <div bind:this={heroLifeBar} class="internal-bar"><span>{ heroLife }</span></div>
                </div>
                <div class="external-bar">
                    <div class="internal-mana-bar"><span>{ heroMana }</span></div>
                </div>
                <div class="buttons-row">
                    <button onclick="{heroAttack}" disabled={!isHeroButtonsAble}>Attack</button>
                    <button disabled={!isHeroButtonsAble}>Magic</button>
                    <button disabled={!isHeroButtonsAble}>Heal</button>
                    <button onclick="{heroGiveUpAction}" disabled={!isHeroButtonsAble}>Give Up</button>
                </div>
            </div>
        </section>
        <div bind:this={ logsContainer } class="logs-container">
            <div class="logs">
            {#if !heroVictory && !monsterVictory && !heroGiveUp}
                <ul>
                    {#each logsList as log, index (index)}
                        <li>{ log }</li>
                    {/each}
                </ul>
            {:else if heroVictory}
                <h2>VICTORY!</h2>
            {:else if monsterVictory}
                <h2>GAME OVER</h2>
            {:else if heroGiveUp}
                <h2>YOU GAVE UP THE BATTLE</h2>
            {/if}
            </div>
        </div>
    </main>
    <footer>
        <address>
            &#169Gabriel Tavares, <a href="http://github.com/Tavaropolis" target="_blank">github.com/Tavaropolis</a>, 2025
        </address>
    </footer>
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
    object-fit: cover;
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

@keyframes hero-critic-background {
    0%   {background-color: black; }
    25%  {background-color:greenyellow;}
    50%  {background-color: black;}
    75%  {background-color:greenyellow;}
    100% {background-color: black;}
}

:global(.hero-critic-background) {
    animation: hero-critic-background 1s linear;
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

@keyframes monster-critic-background {
    0%   {background-color: black; }
    25%  {background-color:red;}
    50%  {background-color: black;}
    75%  {background-color:red;}
    100% {background-color: black;}
}

:global(.monster-critic-background) {
    animation: monster-critic-background 1s linear;
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
</style>