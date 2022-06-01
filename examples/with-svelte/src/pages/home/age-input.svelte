<script>
  import {getFfw} from 'ffw-s'
  import FfwInput from 'src/components/ffw-input.svelte'
  const ffw = getFfw()
</script>

<div>
  <span>
    AgeInput: age = {""}

    <FfwInput field={ffw.fields.age}/>
  </span>
</div>
