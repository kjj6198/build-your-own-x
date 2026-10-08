<script lang="ts">
  import { countGuides, type Section } from '#lib/catalog.ts';

  let {
    sections,
    activeId,
    onnavigate,
  }: {
    sections: Section[];
    activeId?: string;
    onnavigate?: () => void;
  } = $props();
</script>

<ol class="index" role="list">
  {#each sections as { topic, number, tutorials } (topic.id)}
    <li>
      {#if tutorials.length > 0}
        <a
          href="#{topic.id}"
          class="entry"
          aria-label="{topic.name}, {countGuides(tutorials.length)}"
          aria-current={topic.id === activeId ? 'location' : undefined}
          onclick={onnavigate}
        >
          <span class="number">{number}</span>
          <span class="name">{topic.name}</span>
          <span class="count">{tutorials.length}</span>
        </a>
      {:else}
        <span class="entry" aria-disabled="true">
          <span class="number">{number}</span>
          <span class="name">{topic.name}</span>
          <span class="count">0</span>
        </span>
      {/if}
    </li>
  {/each}
</ol>

<style>
  .entry {
    display: grid;
    grid-template-columns: 1.75rem 1fr auto;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    margin-inline: -0.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.35;
    color: var(--ink-soft);
    text-decoration: none;
    transition:
      color 150ms,
      background-color 150ms;
  }

  .number,
  .count {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  a.entry:hover {
    color: var(--ink);
    background: var(--paper-sunk);
  }

  a.entry[aria-current] {
    color: var(--ink);
    font-weight: 600;
  }

  a.entry[aria-current] .number {
    color: var(--accent);
  }

  .entry[aria-disabled] {
    opacity: 0.4;
  }
</style>
