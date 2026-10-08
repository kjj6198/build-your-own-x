<script lang="ts">
  import { countGuides, type Section } from '#lib/catalog.ts';
  import ArrowUpRight from '~icons/ph/arrow-up-right';

  let { section }: { section: Section } = $props();

  const { topic, number } = $derived(section);
</script>

<section
  id={topic.id}
  class="topic"
  data-topic
  aria-labelledby="{topic.id}-title"
  hidden={section.tutorials.length === 0}
>
  <header>
    <span class="number">{number}</span>
    <h2 id="{topic.id}-title">{topic.name}</h2>
    <span class="count">{countGuides(section.tutorials.length)}</span>
  </header>
  <ol role="list">
    {#each section.tutorials as tutorial}
      <li>
        <a href={tutorial.url} class="tutorial">
          <span class="title">{tutorial.title}</span>
          <span class="meta">
            {#if tutorial.languages.length > 0}
              <span class="languages">{tutorial.languages.join(' / ')}</span>
            {/if}
            <span>{tutorial.host}</span>
            {#if tutorial.format}
              <span class="format">{tutorial.format}</span>
            {/if}
          </span>
          <ArrowUpRight class="arrow" aria-hidden="true" />
        </a>
      </li>
    {/each}
  </ol>
</section>

<style>
  .topic {
    scroll-margin-top: calc(var(--toolbar-height) + 1rem);
  }

  header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: baseline;
    gap: 0.875rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid var(--ink);
  }

  .number {
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--accent);
  }

  h2 {
    font-family: var(--font-display);
    font-size: clamp(1.625rem, 1.2rem + 1.4vw, 2.25rem);
    font-weight: 450;
    line-height: 1.1;
    letter-spacing: -0.015em;
    text-wrap: balance;
  }

  .count {
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    color: var(--ink-soft);
    white-space: nowrap;
  }

  li {
    border-bottom: 1px solid var(--rule);
  }

  .tutorial {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 1rem;
    row-gap: 0.125rem;
    padding: 0.875rem 0.75rem;
    margin-inline: -0.75rem;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: background-color 150ms;
  }

  .title {
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.35;
    text-wrap: pretty;
  }

  .meta {
    grid-row: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.75rem;
    font-size: 0.8125rem;
    color: var(--ink-soft);
  }

  .languages {
    font-weight: 600;
    color: var(--accent);
  }

  .format {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.6875rem;
    font-weight: 600;
    align-self: center;
  }

  .tutorial :global(.arrow) {
    grid-row: 1 / span 2;
    grid-column: 2;
    align-self: center;
    width: 1.125rem;
    height: 1.125rem;
    color: var(--ink-soft);
    opacity: 0;
    translate: -0.25rem 0.25rem;
    transition:
      opacity 150ms,
      translate 200ms var(--ease-out);
  }

  @media (hover: hover) {
    .tutorial:hover {
      background: var(--paper-sunk);
    }

    .tutorial:hover .title {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.2em;
    }

    .tutorial:hover :global(.arrow) {
      opacity: 1;
      translate: 0 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tutorial :global(.arrow) {
      translate: 0 0;
    }
  }
</style>
