<script>
  import { cubicOut } from 'svelte/easing';
  export let href;
  export let isTitle = false;

  function performScroll(nextHash) {
    const element = document.querySelector(nextHash);
    if (!element) {
      return;
    }

    const targetY = element.offsetTop;
    const scrollY = window.scrollY || window.pageYOffset;

    const startTime = window.performance.now();
    // if user enalbe reduced motion, scroll it directly
    if (
      'matchMedia' in window &&
      window.matchMedia('(prefers-reduced-motion)').matches
    ) {
      scrollTo(0, scrollY + (targetY - scrollY));
      return;
    }

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

<a
  {href}
  on:click={(e) => {
    e.preventDefault();
    const nextHash = e.currentTarget.getAttribute('href');
    history.replaceState({}, '', nextHash);
    performScroll(nextHash);
  }}>
  <slot />
</a>
