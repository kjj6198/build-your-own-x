<script lang="ts">
  import { goto } from '$app/navigation';
  import { filterCatalog } from '#lib/catalog.ts';
  import LanguageFilter from '#lib/components/LanguageFilter.svelte';
  import TopicIndex from '#lib/components/TopicIndex.svelte';
  import TopicSection from '#lib/components/TopicSection.svelte';
  import { onMount } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import GithubLogo from '~icons/ph/github-logo';
  import ListIcon from '~icons/ph/list';
  import MagnifyingGlass from '~icons/ph/magnifying-glass';
  import XIcon from '~icons/ph/x';
  import XLogo from '~icons/ph/x-logo';

  const DESCRIPTION =
    'Step-by-step guides to rebuilding the technology you use every day, from databases and shells to operating systems.';

  let { data } = $props();
  const catalog = $derived(data.catalog);

  let query = $state('');
  const selected = new SvelteSet<string>();
  const sections = $derived(
    filterCatalog(catalog, { query, languages: selected }),
  );
  const visibleCount = $derived(
    sections.reduce((sum, section) => sum + section.tutorials.length, 0),
  );
  const isFiltered = $derived(query.trim() !== '' || selected.size > 0);

  let activeId = $state<string>();
  let restoredFromUrl = $state(false);
  let guides: HTMLElement;
  let searchInput: HTMLInputElement;
  let topicsDialog: HTMLDialogElement;

  // Prerendered HTML has no query string, so filters from a shared link or a
  // history entry are applied after hydration to avoid a hydration mismatch.
  function restoreFiltersFromUrl() {
    const params = new URL(location.href).searchParams;
    query = params.get('q') ?? '';
    selected.clear();
    for (const language of params.getAll('lang')) selected.add(language);
    restoredFromUrl = true;
  }

  onMount(restoreFiltersFromUrl);

  $effect(() => {
    if (!restoredFromUrl) return;

    // `page.url` does not follow shallow navigations, so compare against the
    // address bar instead.
    const current = new URL(location.href);
    const url = new URL(current);
    url.searchParams.delete('q');
    url.searchParams.delete('lang');
    if (query.trim()) url.searchParams.set('q', query.trim());
    for (const language of selected) url.searchParams.append('lang', language);

    if (url.href !== current.href) {
      goto(url, { shallow: true, replace: true });
    }
  });

  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId = entry.target.id;
        }
      },
      { rootMargin: '-15% 0px -80% 0px' },
    );
    for (const section of guides.querySelectorAll('[data-topic]')) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  });

  function clearFilters() {
    query = '';
    selected.clear();
    searchInput.focus();
  }

  function onSearchInput() {
    // Typing deep in the list would otherwise leave the reader below the results.
    if (guides.getBoundingClientRect().top < 0) {
      guides.scrollIntoView({ behavior: 'instant' });
    }
  }

  function onSearchKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    if (query) query = '';
    else searchInput.blur();
  }

  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    if (
      (event.target as Element).closest('input, textarea, [contenteditable]')
    ) {
      return;
    }
    event.preventDefault();
    searchInput.focus();
  }
</script>

<svelte:window onkeydown={onWindowKeydown} onpopstate={restoreFiltersFromUrl} />

<svelte:head>
  <title>Build Your Own X</title>
  <meta name="description" content={DESCRIPTION} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://build-your-own-x.now.sh" />
  <meta property="og:title" content="Build Your Own X" />
  <meta property="og:description" content={DESCRIPTION} />
  <meta
    property="og:image"
    content="https://build-your-own-x.now.sh/feynman.png"
  />
  <meta
    property="og:image:alt"
    content="Richard Feynman: What I cannot create, I do not understand"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@kalanyei" />
</svelte:head>

<a class="skip-link" href="#guides">Skip to guides</a>

<div class="page">
  <header class="masthead">
    <a href="/" class="wordmark">Build your own <em>X</em></a>
    <nav aria-label="Elsewhere" class="elsewhere">
      <a
        href="https://github.com/kjj6198/build-your-own-x"
        aria-label="Source on GitHub"
      >
        <GithubLogo aria-hidden="true" />
      </a>
      <a href="https://x.com/kalanyei" aria-label="Kalan on X">
        <XLogo aria-hidden="true" />
      </a>
    </nav>
  </header>

  <div class="hero">
    <img
      class="feynman"
      src="/feynman.png"
      alt="Richard Feynman at a blackboard: What I cannot create, I do not understand"
      width="1123"
      height="629"
      fetchpriority="high"
    />
    <p class="lede">
      {catalog.tutorialCount} guides to rebuilding the technology you use every day,
      from databases and shells to operating systems. Pick a topic and a language,
      then build it from scratch.
    </p>
  </div>

  <nav class="sidebar" aria-labelledby="sidebar-title">
    <h2 id="sidebar-title" class="sidebar-title">Topics</h2>
    <TopicIndex {sections} {activeId} />
  </nav>

  <main id="guides" bind:this={guides}>
    <div class="toolbar">
      <button
        type="button"
        class="topics-button"
        aria-haspopup="dialog"
        onclick={() => topicsDialog.showModal()}
      >
        <ListIcon aria-hidden="true" />
        Topics
      </button>
      <label class="search">
        <MagnifyingGlass class="search-icon" aria-hidden="true" />
        <span class="visually-hidden">Search guides</span>
        <input
          type="search"
          placeholder="Search guides"
          autocomplete="off"
          spellcheck="false"
          bind:value={query}
          bind:this={searchInput}
          oninput={onSearchInput}
          onkeydown={onSearchKeydown}
        />
        <kbd aria-hidden="true">/</kbd>
      </label>
      <p class="status" role="status">
        {#if isFiltered}
          <strong>{visibleCount}</strong> of {catalog.tutorialCount} guides
        {:else}
          {catalog.tutorialCount} guides
        {/if}
      </p>
    </div>

    <LanguageFilter languages={catalog.languages} {selected} />

    {#if visibleCount === 0}
      <div class="empty">
        <p class="empty-title">
          No guides match
          {#if query.trim()}“{query.trim()}”{/if}
          {#if selected.size > 0}in {[...selected].join(', ')}{/if}
        </p>
        <p>Try fewer words, or another language.</p>
        <button type="button" class="clear" onclick={clearFilters}>
          Clear search and filters
        </button>
      </div>
    {/if}

    <div class="topics">
      {#each sections as section (section.topic.id)}
        <TopicSection {section} />
      {/each}
    </div>
  </main>

  <footer class="colophon">
    <p>
      Know a tutorial that belongs here?
      <a href="https://github.com/kjj6198/build-your-own-x">Add it on GitHub</a
      >.
    </p>
    <p>
      The list is dedicated to the public domain under
      <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>. It
      was started by
      <a href="https://github.com/danistefanovic">Daniel Stefanovic</a>
      and is maintained by
      <a href="https://github.com/codecrafters-io/build-your-own-x"
        >CodeCrafters</a
      >. This site is by <a href="https://github.com/kjj6198">Kalan</a>.
    </p>
  </footer>
</div>

<dialog
  bind:this={topicsDialog}
  class="sheet"
  aria-labelledby="sheet-title"
  closedby="any"
>
  <div class="sheet-header">
    <h2 id="sheet-title" class="sidebar-title">Topics</h2>
    <button
      type="button"
      class="close"
      aria-label="Close topics"
      onclick={() => topicsDialog.close()}
    >
      <XIcon aria-hidden="true" />
    </button>
  </div>
  <TopicIndex {sections} {activeId} onnavigate={() => topicsDialog.close()} />
</dialog>

<style>
  .skip-link {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 10;
    padding: 0.5rem 0.875rem;
    border-radius: 0.375rem;
    background: var(--color-bg-inverse);
    color: var(--color-text-inverse);
    translate: 0 -200%;
  }

  .skip-link:focus-visible {
    translate: 0 0;
  }

  .page {
    display: grid;
    grid-template-columns: 14rem minmax(0, 46rem);
    grid-template-areas:
      'masthead masthead'
      'hero hero'
      'sidebar main'
      '. colophon';
    column-gap: clamp(2.5rem, 6vw, 5rem);
    justify-content: center;
    padding-inline: var(--gutter);
  }

  .masthead {
    grid-area: masthead;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  .wordmark {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    text-decoration: none;
  }

  .wordmark em {
    color: var(--color-accent);
  }

  .elsewhere {
    display: flex;
    gap: 0.25rem;
  }

  .elsewhere a {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    color: var(--color-text-secondary);
    transition:
      color 150ms,
      background-color 150ms;
  }

  .elsewhere a:hover {
    color: var(--color-text);
    background: var(--color-bg-sunken);
  }

  .elsewhere :global(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }

  .hero {
    grid-area: hero;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: 1.75rem;
    padding-block: clamp(1.5rem, 4vw, 3rem) clamp(2.5rem, 6vw, 4.5rem);
  }

  .feynman {
    grid-column: 1 / -1;
    width: 100%;
    height: auto;
  }

  .lede {
    grid-column: 2;
    max-width: 34rem;
    font-size: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
    line-height: 1.5;
    text-wrap: pretty;
  }

  .sidebar {
    grid-area: sidebar;
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100dvh;
    overflow-y: auto;
    padding-block: 1.25rem 2rem;
    scrollbar-width: thin;
  }

  .sidebar-title {
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  main {
    grid-area: main;
    display: grid;
    align-content: start;
    gap: 1.5rem;
    min-height: 100dvh;
  }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    height: var(--toolbar-height);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .search {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .search :global(.search-icon) {
    position: absolute;
    left: 0.875rem;
    width: 1.125rem;
    height: 1.125rem;
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 2.75rem;
    padding: 0 2.75rem 0 2.625rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 0.5rem;
    background: var(--color-bg-sunken);
    font-size: 1rem;
    transition:
      border-color 150ms,
      background-color 150ms;
  }

  input::placeholder {
    color: var(--color-text-secondary);
  }

  input:focus-visible {
    outline: none;
    border-color: var(--color-accent);
    background: var(--color-bg);
  }

  input::-webkit-search-cancel-button {
    display: none;
  }

  kbd {
    position: absolute;
    right: 0.75rem;
    display: grid;
    place-items: center;
    min-width: 1.5rem;
    height: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    font-family: inherit;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  input:focus + kbd,
  input:not(:placeholder-shown) + kbd {
    display: none;
  }

  @media (hover: none) {
    kbd {
      display: none;
    }
  }

  .status {
    min-width: 7.5rem;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--color-text-secondary);
  }

  .status strong {
    color: var(--color-text);
  }

  .topics-button,
  .close,
  .clear {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.75rem;
    padding-inline: 0.875rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 0.5rem;
    background: transparent;
    font-size: 0.9375rem;
    font-weight: 500;
    transition:
      background-color 150ms,
      scale 150ms var(--ease-out);
  }

  .topics-button:hover,
  .close:hover,
  .clear:hover {
    background: var(--color-bg-sunken);
  }

  .topics-button:active,
  .close:active,
  .clear:active {
    scale: 0.97;
  }

  .topics-button {
    display: none;
  }

  .topics-button :global(svg),
  .close :global(svg) {
    width: 1.125rem;
    height: 1.125rem;
  }

  .topics {
    display: grid;
    gap: clamp(3rem, 6vw, 4.5rem);
    padding-block: 1.5rem 2rem;
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 0.5rem;
    padding: 3rem 0;
    color: var(--color-text-secondary);
  }

  .empty-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    line-height: 1.2;
    color: var(--color-text);
  }

  .clear {
    margin-top: 1rem;
  }

  .colophon {
    grid-area: colophon;
    display: grid;
    gap: 0.5rem;
    max-width: 38rem;
    margin-top: 3rem;
    padding-block: 2rem 4rem;
    border-top: 1px solid var(--color-border-strong);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .colophon a {
    color: var(--color-text);
    text-underline-offset: 0.2em;
  }

  .sheet {
    width: min(22rem, 100vw);
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 1rem 1.25rem 2rem;
    border: none;
    border-right: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .sheet::backdrop {
    background: var(--color-overlay);
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .sheet-header .sidebar-title {
    margin: 0;
  }

  .close {
    width: 2.75rem;
    justify-content: center;
    padding: 0;
    border-color: transparent;
  }

  @media (prefers-reduced-motion: no-preference) {
    .sheet,
    .sheet::backdrop {
      transition:
        translate 300ms var(--ease-out),
        opacity 300ms var(--ease-out),
        overlay 300ms allow-discrete,
        display 300ms allow-discrete;
    }

    .sheet:not([open]) {
      translate: -100% 0;
    }

    .sheet:not([open])::backdrop {
      opacity: 0;
    }

    @starting-style {
      .sheet[open] {
        translate: -100% 0;
      }

      .sheet[open]::backdrop {
        opacity: 0;
      }
    }
  }

  @media (max-width: 64rem) {
    .page {
      grid-template-columns: minmax(0, 46rem);
      grid-template-areas:
        'masthead'
        'hero'
        'main'
        'colophon';
    }

    .sidebar {
      display: none;
    }

    .topics-button {
      display: inline-flex;
    }

    .lede {
      grid-column: 1;
    }
  }

  @media (max-width: 40rem) {
    .status {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    .topics-button {
      padding-inline: 0.75rem;
    }
  }
</style>
