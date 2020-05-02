<script>
  export let tableOfContent;
  import ScrollAnchor from './ScrollAnchor.svelte';
</script>

<style>
  ul.list {
    list-style-type: none;
    padding-left: 0;
  }

  li:not(:last-child) {
    margin-bottom: 10px;
  }
</style>

<h3>Table Of Content</h3>
<ul class="list">
  {#each tableOfContent as { title, id } (id)}
    <li class="item">
      <ScrollAnchor href={id}>
        {title.replace(/Build your own /, '')}
      </ScrollAnchor>
    </li>
  {/each}
</ul>
