<script>
  import * as yup from 'yup';
  import AgeInput from 'src/pages/home/age-input.svelte';
  import NameInput from 'src/pages/home/name-input.svelte';
  import AgeListener from 'src/pages/home/age-listener.svelte';
  import {setFfwContext, initFFw, prepareYup} from 'ffw-svelte';

  const ffw = initFFw({
    initValues: {
      age: 42,
      name: 'Robbin',
    },
    validateSchema: prepareYup({
      age: yup.number().required(),
      name: yup.string().required(),
    }),
  });
  globalThis.form = ffw;

  setFfwContext(ffw);
  const valid = ffw.s.valid;
</script>

{#if $valid}
  valid
{/if}
{#if !$valid}
  invalid
{/if}

<AgeInput />
<AgeListener />
<NameInput />
