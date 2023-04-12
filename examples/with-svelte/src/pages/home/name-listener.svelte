<script>
  import {getFfwContext} from 'ffw-svelte';
  const ffw = getFfwContext();

  const {value} = ffw.fields.name.svelte;
</script>

<div>
  <span>NameListener: name = {$value}</span>
</div>
