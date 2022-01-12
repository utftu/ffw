<script lang="ts">
  import {getFfw} from 'ffw-s'
  import FfwInput from 'src/components/ffw-input.svelte'
  const ffw = getFfw()
</script>

<div>
  <span>
    NameInput: name = {""}

    <FfwInput field={ffw.fields.name}/>
  </span>
</div>
