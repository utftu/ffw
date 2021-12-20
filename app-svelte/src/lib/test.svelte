<script lang="ts">
  import Input from '../components/input.svelte'
  import {useFfw} from '../../../packages/ffw-s/dist/esm/dev.js'
  
  const form = useFfw(['name', 'age'])
  globalThis.form1 = form
  
  // const name = form.name;
  const {name} = form;
  console.log('-----', 'name', name)
  console.log($name)
</script>

<div>
  <Input field={form.name}/>
<!--  <input bind:value={$name}>-->
  <!--{$useName}-->
</div>