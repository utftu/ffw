<script>
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
  // ffw.addGlobalListener((field, type, event) => {
  //   console.log('-----', field.name, type, event)
  // })
  
  // ffw.emitter.on('*', (field, ...args) => {
  //   console.log(field, args)
  // })
  setFfwContext(ffw)
  const valid = ffw.s.valid
  
  // ffw.f.age.s.errorTouched.subscribe((value) => {
  //   console.log('-----', 's errorTouched', value)
  // })

  // ffw.f.age.subscribe('errorTouched', (...args) => {
  //   console.log('-----', 'errorTouched', args)
  // })
  //
  // console.log('-----', 'ffw.f.age', ffw.f.age)
  const ageErrorTouched = ffw.f.age.s.errorTouched
  //
  // $: {
  //   console.log('-----', 'ageErrorTouched', $ageErrorTouched)
  // }
</script>

{$ageErrorTouched}

{#if $valid}
  valid
{/if}
{#if !$valid}
  invalid
{/if}

<AgeInput/>
<AgeListener/>
<NameInput/>


