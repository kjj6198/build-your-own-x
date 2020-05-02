<script>
  import Navbar from './Navbar.svelte';
  import Content from './Content.svelte';
  export let data;
</script>

<style>
  :root {
    --textColor: #463d3d;
    --bgColor: #f4f4f4;
    --highlight: #fece8e;
  }

  .container {
    width: 95%;
    max-width: 1300px;
    margin: auto;
    padding-left: 240px;
  }

  main {
    padding: 50px;
    margin: 0 auto;
    background-color: #fff;
  }

  nav {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    padding: 20px;
    background-color: #fff;
    max-height: 100%;
    height: 100%;
    overflow: auto;
    margin-right: 20px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  img {
    max-width: 100%;
  }
</style>

<nav>
  <Navbar tableOfContent={data.tableOfContent} />
</nav>
<div class="container">
  <main>
    <img src="/feynman.png" alt="feyman-quote" />
    <p>
      This repo is forked from awesome
      <a href="https://github.com/danistefanovic/build-your-own-x">
        anistefanovic/build-your-own-x
      </a>
      , site is created and maintained by
      <a href="https://github.com/kjj6198/build-your-own-x">Kalan</a>
      which converted github README.md to website, and probably will add more
      opinionated resource. Follow me on
      <a href="twitter.com/kalanyei">Twitter</a>
      or contrinute your article link on
      <a href="https://github.com/kjj6198/build-your-own-x">Github</a>
      is always welcomed!
    </p>

    <Content languages={data.languages} categories={data.categories} />
  </main>
</div>
