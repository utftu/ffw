<script>
  export let field;

  const {value} = field.svelte;
</script>

<input on:blur={field.onBlur} bind:value={$value} />
