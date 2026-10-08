<script lang="ts">
  import { countGuides, type LanguageCount } from '#lib/catalog.ts';
  import type { SvelteSet } from 'svelte/reactivity';

  const COLLAPSED_COUNT = 10;

  let {
    languages,
    selected,
  }: {
    languages: LanguageCount[];
    selected: SvelteSet<string>;
  } = $props();

  let expanded = $state(false);

  const shown = $derived(
    expanded
      ? languages
      : languages.filter(
          ({ name }, index) => index < COLLAPSED_COUNT || selected.has(name),
        ),
  );
  const hiddenCount = $derived(languages.length - shown.length);

  function toggle(name: string) {
    if (selected.has(name)) selected.delete(name);
    else selected.add(name);
  }
</script>

<div class="filter" role="group" aria-labelledby="language-filter-label">
  <span id="language-filter-label" class="label">Language</span>
  <div class="chips">
    {#each shown as { name, count } (name)}
      <button
        type="button"
        class="chip"
        aria-pressed={selected.has(name)}
        aria-label="{name}, {countGuides(count)}"
        onclick={() => toggle(name)}
      >
        {name}<span class="count">{count}</span>
      </button>
    {/each}
    {#if hiddenCount > 0 || expanded}
      <button
        type="button"
        class="more"
        aria-expanded={expanded}
        onclick={() => (expanded = !expanded)}
      >
        {expanded ? 'Show fewer' : `${hiddenCount} more`}
      </button>
    {/if}
  </div>
</div>

<style>
  .filter {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    align-items: baseline;
    gap: 0.75rem;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .chip,
  .more {
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
    min-height: 2rem;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--rule);
    border-radius: 999px;
    background: transparent;
    font-size: 0.875rem;
    line-height: 1.4;
    transition:
      background-color 150ms,
      border-color 150ms,
      color 150ms,
      scale 150ms var(--ease-out);
  }

  .chip:hover,
  .more:hover {
    border-color: var(--ink-soft);
  }

  .chip:active,
  .more:active {
    scale: 0.96;
  }

  .count {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: var(--ink-soft);
  }

  .chip[aria-pressed='true'] {
    border-color: var(--ink);
    background: var(--ink);
    color: var(--paper);
  }

  .chip[aria-pressed='true'] .count {
    color: color-mix(in oklch, var(--paper) 70%, transparent);
  }

  .more {
    border-style: dashed;
    color: var(--ink-soft);
  }

  @media (max-width: 40rem) {
    .filter {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }
</style>
