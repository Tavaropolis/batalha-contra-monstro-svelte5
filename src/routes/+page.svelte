<script lang=ts>
let monsterLifeBar: number = $state(100);
let heroLifeBar: number = $state(100);

</script>
<div class="main-page">
    <main>
        <h1>Battle against the Monster</h1>
        <p>Use your skills to defeat the monster</p>
        <section id="characters">
            <div class="character-container">
                <div class="character-card" id="monster">
                    <img src="../../assets/monster.png" alt="">
                </div>
                <div class="external-bar">
                    <div class="internal-bar">{ monsterLifeBar }</div>
                </div>
            </div>
            <div class="character-container">
                <div class="character-card" id="hero">
                    <img src="../../assets/hero.png" alt="">
                </div>
                <div class="external-bar">
                    <div class="internal-bar">{ heroLifeBar }</div>
                </div>
                <div class="external-bar">
                    <div class="internal-mana-bar">{ heroLifeBar }</div>
                </div>
                <div class="buttons-row">
                    <button>Atacar</button>
                    <button>Magia</button>
                    <button>Curar</button>
                    <button>Desistir</button>
                </div>
            </div>
        </section>
        <div class="logs-container">
            <div class="logs"></div>
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
    color: white;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
}

button:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>