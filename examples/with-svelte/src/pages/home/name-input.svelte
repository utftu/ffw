<script>
  import {getFfwContext} from 'ffw-svelte';
  import FfwInput from 'src/components/ffw-input.svelte';
  const ffw = getFfwContext();
</script>

<div>
  <span>
    NameInput: name = {''}

    <FfwInput field={ffw.fields.name} />
  </span>
</div>
