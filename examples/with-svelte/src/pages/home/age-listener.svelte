<script>
  import {getFfwContext} from 'ffw-svelte';
  const ffw = getFfwContext();

  const {value} = ffw.f.age.svelte;
</script>

<div>
  <span>AgeListener: age = {$value}</span>
</div>
