<script>
  import Navbar from './Navbar.svelte';
  import Content from './Content.svelte';
  export let data;

  let isOpen = false;
</script>

<style>
  .container {
    width: 95%;
    max-width: 1300px;
    margin: auto;
    padding-left: 240px;
  }

  .links img {
    height: 30px;
  }

  main {
    padding: 50px;
    margin: 0 auto;
    margin-top: var(--header-height);
    background-color: var(--theme);
  }

  nav {
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    left: 0;
    width: 250px;
    padding: 20px;
    background-color: var(--theme);
    max-height: 100%;
    height: calc(100dvh - var(--header-height));
    overflow: auto;
    margin-right: 20px;
  }

  img {
    max-width: 100%;
  }

  header {
    display: flex;
    padding: 0 50px;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: var(--header-height);
    width: 100%;
    background-color: var(--theme);
    border-bottom: 1px solid var(--border);
  }

  header h2 {
    font-size: 20px;
    margin: 0;
    line-height: 1;
  }

  .navbar-btn {
    display: none;
  }

  @media (max-width: 900px) {
    nav {
      display: none;
    }

    header {
      justify-content: center;
    }

    header h2 {
      font-size: 16px;
    }

    nav.opened {
      display: block;
      box-shadow: 3px 0 6px rgba(154, 154, 154, 0.8);
    }

    header > .links {
      display: none;
    }

    main {
      padding: 15px;
    }

    .container {
      padding-left: initial;
    }

    .navbar-btn {
      display: block;
      border: none;
      background: transparent;
      margin: 0;
      cursor: pointer;
    }

    .navbar-btn > svg {
      width: 1em;
      height: 1em;
    }
  }
</style>

<svelte:head>
  <title>Build Your Own X</title>
  <meta property="og:url" content="https://build-your-own-x.now.sh" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Build Your Own X" />
  <meta
    property="description"
    content="This repo is forked from awesome anistefanovic/build-your-own-x ,
    site is created and maintained by Kalan which converted github README.md to
    website, and probably will add more opinionated resource. Follow me on
    Twitter or contrinute your article link on Github is always welcomed!" />
  <meta
    property="og:description"
    content="This repo is forked from awesome anistefanovic/build-your-own-x ,
    site is created and maintained by Kalan which converted github README.md to
    website, and probably will add more opinionated resource. Follow me on
    Twitter or contrinute your article link on Github is always welcomed!" />
  <meta property="twitter:card" content="summary" />
  <meta property="twitter:creator" content="@kalanyei" />
  <meta
    property="og:image"
    content="https://build-your-own-x.now.sh/feynman.png" />
  <meta property="og:image:alt" content="Feynman" />
</svelte:head>

<header>
  <h2>Build Your Own X</h2>
  <div class="links">
    <a href="https://github.com/kjj6198/build-your-own-x" title="Github">
      <img src="/github.png" alt="github-logo" />
    </a>
    <a href="https://twitter.com/kalanyei" title="Twitter">
      <img src="/twitter.png" alt="twitter-logo" />
    </a>
  </div>
  <button
    aria-controls="article-links"
    aria-expanded={isOpen}
    aria-label="Tab of content navigation toggle"
    type="button"
    class="navbar-btn"
    on:click={() => (isOpen = !isOpen)}>
    <svg
      width="24px"
      height="21px"
      viewBox="0 0 24 21"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Navigation Toggle</title>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="#5d5555">
          <g>
            <rect x="0" y="0" width="24" height="3" />
            <rect x="0" y="9" width="24" height="3" />
            <rect x="0" y="18" width="24" height="3" />
          </g>
        </g>
      </g>
    </svg>
  </button>
</header>
<nav
  aria-label="table of content navigation"
  class:opened={isOpen}
  id="article-links">
  <Navbar tableOfContent={data.tableOfContent} />
</nav>
<div class="container">
  <main>
    <img
      src="/feynman.png"
      alt="feyman: What I can not create, I do not understand" />
    <h2>Build Your Own X (insert technology here)</h2>

    <p>
      This repo is forked from awesome
      <a href="https://github.com/danistefanovic/build-your-own-x">
        anistefanovic/build-your-own-x
      </a>
      , site is created and maintained by
      <a href="https://github.com/kjj6198/build-your-own-x">Kalan</a>
      which converted github README.md to website, and probably will add more
      opinionated resource.
      <br />
      Follow me on
      <a href="twitter.com/kalanyei">Twitter</a>
      or contibute your article link on
      <a href="https://github.com/kjj6198/build-your-own-x">Github</a>
      is always welcomed!
    </p>

    <Content languages={data.languages} categories={data.categories} />
  </main>
</div>
