

<script>
  export let field
  const {value, touched, error} = field.s
</script>

<div>
  {$value}
</div>
asdsad

<input bind:value={$value} on:input={field.onChange} on:blur={field.onBlur}/>
touched = {$touched}
{#if $error}
  {$error}
{/if}

