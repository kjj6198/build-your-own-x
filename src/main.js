import App from './App.svelte';

const app = new App({
  target: document.querySelector('#app'),
  props: {
    data: window.__BUILD_YOUR_OWN_DATA__,
  },
  hydrate: true,
});

export default app;
