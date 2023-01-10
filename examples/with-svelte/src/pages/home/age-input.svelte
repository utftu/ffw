<script>
  import {getFfwContext} from 'ffw-svelte';
  import FfwInput from 'src/components/ffw-input.svelte';
  const ffw = getFfwContext();
</script>

<div>
  <span>
    AgeInput: age = {''}

    <FfwInput field={ffw.fields.age} />
  </span>
</div>
