<script lang="ts">
    let { charStats } = $props();
</script>
<div class="char-stats">
    <h1>Player Status</h1>
    <div class="internal-container">
        <ul>
            <li>HP: {charStats.maxLife}</li>
            <li>MP: {charStats.maxMana}</li>
            <li>MP Regen: {charStats.manaRegen}</li>
            <li>Attack: {charStats.maxHit-1}</li>
            <li>Magic: {charStats.maxMagic-1}</li>
            <li>Heal: {charStats.maxHeal-1}</li>
        </ul>
    </div>
    <p>Aperte "C" para sair</p>
</div>

<style>
.char-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: white;
    font-size: 1.5rem;
    color: black;
    font-family: 'runescape';
    width: 45vw;
    height: 35vh;
    position: absolute;
    margin: 0 auto;
    border: double 15px black;
}

.internal-container {
    width: 100%;
    column-count: 2;
}
</style>