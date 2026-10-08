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
  {#each sections.filter((section) => section.tutorials.length > 0) as { topic, number, tutorials } (topic.id)}
    <li>
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
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 150ms;
  }

  .number,
  .count {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  .entry:hover {
    background: var(--color-bg-sunken);
  }

  .entry[aria-current] {
    font-weight: 600;
  }

  .entry[aria-current] .number {
    color: var(--color-accent);
  }
</style>
