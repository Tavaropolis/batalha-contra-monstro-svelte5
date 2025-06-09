<script lang="ts">
    let { monsterStats } = $props();
</script>
<div class="char-stats">
    <h1>Monster Status</h1>
    <div class="internal-container">
        <ul>
            <li>HP: {monsterStats.maxLife}</li>
            <li>Attack: {monsterStats.maxHit-1}</li>
            <li>Magic: {monsterStats.maxMagic-1}</li>
            <li>Heal: {monsterStats.maxHeal-1}</li>
        </ul>
    </div>
    <p>Aperte "X" para sair</p>
</div>

<style>
.char-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: red;
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