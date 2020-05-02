<script>
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import { crossfade, fade } from 'svelte/transition';
  import ScrollAnchor from './ScrollAnchor.svelte';
  export let categories;
  export let languages;

  let selected = [];

  const [send, receive] = crossfade({
    fallback(node) {}
  });

  function handleLangToggle(lang) {
    if (selected.includes(lang)) {
      selected = selected.filter((l) => l !== lang);
    } else {
      selected = [...selected, lang];
    }
  }

  function performScroll() {
    const hash = location.hash;
    const element = document.querySelector(`${hash}`);
    const targetY = element.offsetTop;
    const scrollY = window.scrollY || window.pageYOffset;

    const startTime = window.performance.now();
    function move(currentTime = startTime) {
      const tFraction = Math.min(1, (currentTime - startTime) / 250);
      const p = cubicOut(tFraction);

      scrollTo(0, scrollY + (targetY - scrollY) * p);
      if (p < 1) {
        requestAnimationFrame(move);
      }
    }

    move();
  }
</script>

<style>
  .title {
    display: inline-block;
    font-weight: bold;
    font-size: 20px;
    color: var(--textColor);
    background-position: 10% 15px;
    background-repeat: no-repeat;
    background-size: 87% 1em;
    background-image: linear-gradient(
      to right,
      var(--highlight) 100%,
      transparent
    );
  }

  .list {
    font-size: 18px;
    padding-left: 25px;
  }
  .list a {
    display: inline-block;
    color: #7b8788;
  }

  .lang {
    font-size: 15px;
    color: #fff;
    display: inline-block;
    padding: 5px;
    line-height: 1;
    background-color: #786d70;
    border: 0;
    border-radius: 2px;
    box-shadow: 0 1px 0 #413335;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .lang.tag {
    font-size: 12px;
    cursor: initial;
  }
</style>

<div>
  <h2>Languages</h2>
  {#each languages.filter((lang) => !selected.includes(lang)) as lang (lang)}
    <button
      out:send={{ key: lang }}
      in:receive={{ key: lang }}
      class="lang"
      on:click={() => handleLangToggle(lang)}>
      {lang}
    </button>
  {/each}
</div>
<div>
  <h2>Selected</h2>
  {#each selected as lang (lang)}
    <button
      animate:flip={{ duration: 200 }}
      in:receive={{ key: lang }}
      class="lang"
      on:click={() => handleLangToggle(lang)}>
      {lang}
    </button>
  {/each}
</div>

{#each categories as category (category.id)}
  <div>
    <ScrollAnchor href="#{category.id}">
      <h2 class="title" id={category.id}>{category.text}</h2>
    </ScrollAnchor>
  </div>
  <div class="list">
    {#each category.posts.filter((p) =>
      selected.length ? selected.includes(p.language) : true
    ) as p (p.title)}
      <p>
        <a href={p.href}>{p.title.replace(p.language + ':', '')}</a>
        {#if p.language}
          <span class="lang tag">{p.language}</span>
        {/if}
      </p>
    {/each}
  </div>
{/each}

<ScrollAnchor href="#how-to-contribute">
  <h2 id="how-to-contribute" class="title">How to contribute</h2>
</ScrollAnchor>
<p>
  <li>Contributions are very welcome: Submit tutorial</li>
  <li>
    Help me to review pending submissions by leaving comments and reactions
  </li>
</p>

<ScrollAnchor href="#license">
  <h2 id="license" class="title">LICENSE</h2>
</ScrollAnchor>
<p>
  <a href="https://creativecommons.org/publicdomain/zero/1.0/">
    <img
      alt="License-CC0"
      src="http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg" />
  </a>
</p>
