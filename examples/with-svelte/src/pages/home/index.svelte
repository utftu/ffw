<script lang="ts">
  import * as yup from 'yup'
  import AgeInput from 'src/pages/home/age-input.svelte';
  import NameInput from 'src/pages/home/name-input.svelte';
  import AgeListener from 'src/pages/home/age-listener.svelte';
  import {setFfwContext, initFFw} from 'ffw-s'
  const ffw = initFFw({
    initValues: {
      age: 42,
      name: "Robbin"
    },
    validateSchema: yup.object({
      age: yup.number().required(),
      name: yup.string().required()
    }),
  })
  globalThis.form = ffw

  setFfwContext(ffw)
  //
</script>

<AgeInput/>
<AgeListener/>
<NameInput/>


