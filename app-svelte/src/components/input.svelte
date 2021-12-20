

<script>
  export let field
  let value = field.getField().value
  let error = field.getField().error
  let touched = field.getField().touched
  field.getField().subscribe((field) => {
    value = field.value
    error = field.error
    touched = field.touched
  })
  console.log('-----', 'here')
  console.dir(value)
</script>

<input bind:value={value} on:input={field.getField().onChange} on:blur={field.getField().onBlur}/>
touched = {touched}
{#if error}
  {error}
{/if}

