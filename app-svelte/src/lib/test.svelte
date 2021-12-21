<script lang="ts">
  import Input from '../components/input.svelte'
  import {useFfw} from '../../../packages/ffw-s/dist/esm/dev.js'
  
  const form = useFfw(['name', 'age'])
  globalThis.form1 = form
</script>

<div>
  <Input field={form.f.name}/>
<!--  <input bind:value={$name}>-->
  <!--{$useName}-->
</div>