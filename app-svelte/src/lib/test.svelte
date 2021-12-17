<script lang="ts">
  import {useFfw} from '../../../packages/ffw-s/dist/esm/dev.js'
  
  const form = useFfw(['name', 'age'])
  console.log('-----', 'form', form)
  
  $: useName = form.name;
  console.log('-----', 'name', useName)
</script>

<div>
  <!--{$form.name}-->
</div>