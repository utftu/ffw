<script>
  import {getFfw} from 'ffw-svelte';
  const ffw = getFfw();

  const {value} = ffw.f.age.s;
</script>

<div>
  <span>AgeListener: age = {$value}</span>
</div>
