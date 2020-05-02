import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    data: window.__BUILD_YOUR_OWN_DATA__,
  },
  hydrate: true,
});

export default app;
