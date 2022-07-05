<script>
  export let field;

  const {value} = field.s;
</script>

<input on:blur={field.onBlur} bind:value={$value}/>
