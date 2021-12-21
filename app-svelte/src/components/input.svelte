

<script>
  export let field
  const {value} = field.s
  
  console.log('-----', '', value)
  
  value.subscribe(() => console.log('-----', 'sub'))

  // console.log(value.subscribe(() => {}))
  
  // let value = field.getField().value
  // let error = field.getField().error
  // let touched = field.getField().touched
  // field.getField().subscribe((field) => {
  //   value = field.value
  //   error = field.error
  //   touched = field.touched
  // })
  // console.log('-----', 'here')
  // console.dir(value)
</script>

<div>
  {$value}
</div>
asdsad

<!--<input bind:value={value} on:input={field.getField().onChange} on:blur={field.getField().onBlur}/>-->
<!--touched = {touched}-->
<!--{#if error}-->
<!--  {error}-->
<!--{/if}-->

