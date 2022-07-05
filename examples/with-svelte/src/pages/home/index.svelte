<script>
  import * as yup from 'yup'
  import AgeInput from 'src/pages/home/age-input.svelte';
  import NameInput from 'src/pages/home/name-input.svelte';
  import AgeListener from 'src/pages/home/age-listener.svelte';
  import {setFfwContext, initFFw} from 'ffw-s'
  import {setContext} from 'svelte'
  const ffw = initFFw({
    initValues: {
      // age: 42,
      name: "Robbin"
    },
    validateSchema: yup.object({
      age: yup.number().required(),
      name: yup.string().required()
    }),
  })
  globalThis.form = ffw
  ffw.addGlobalListener((field, type, event) => {
    console.log('-----', field.name, type, event)
  })
  
  ffw.emitter.on('*', (...args) => {
    console.log('here', args)
  })
  
  ffw.validate()

  setContext('ffw-s', ffw)
  
  ffw.s.valid.subscribe((valid) => {
    console.log('-----', 's valid', valid)
  })
  console.log('before')
  console.log('setFfwContext', setFfwContext)
  // setFfwContext(ffw)
  console.log('after')
  
  const valid = ffw.s.valid
  // console.log(valid.subscribe)
  // console.log($valid)
  // console.log('-----', 'ffw.s', valid)
  $: () => {
    console.log('$valid', $valid)
  }
</script>

{#if $valid}
  valid
{/if}
{#if !$valid}
  invalid
{/if}

<AgeInput/>
<AgeListener/>
<NameInput/>


