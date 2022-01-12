<script lang="ts">
  export let field;

  const {value} = field.s;
</script>

<input bind:value={$value}/>
