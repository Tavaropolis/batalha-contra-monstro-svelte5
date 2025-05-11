<script lang="ts">
//Components
import Footer from "../../components/Footer.svelte"

</script>
<div class="about-page">
    <main>
        <h1>About the project</h1>
        <p>This project is a remake of my first project made at the beginning of my journey learning programming, back in 2022.  You can check out the original "Battle against the Monster" <a href="https://tavaropolis.github.io/luta-contra-monstro-vue/" target="_blank">here</a>.</p>
        <img src="/oldapp.png" alt="">
        <p>The idea here is to see how much I have been improving in these last 3 years. This time, I tried to make the game more challenging and more visually pleasing, with character sprites and animations.</p>
        <p>Feel free to contact me via: tavaropolisgithub@gmail.com</p>
    </main>
    <Footer/>
</div>

<style>
* {
    box-sizing: border-box;
}

.about-page {
    width: 100%;
    min-height: 100vh;
    background-color: black;
    color: yellow;
    font-family: runescape;
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

main p {
    font-size: 1.2rem;
}

img {
    width: 70%;
    height: auto;
}
</style>