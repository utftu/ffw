<script lang="ts">
  import {getFfw} from 'ffw-s'
  const ffw = getFfw()

  const {value} = ffw.f.age.s
</script>

<div>
  <span>AgeListener: age = {$value}</span>
</div>
