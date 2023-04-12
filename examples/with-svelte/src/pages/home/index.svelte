<script>
  import * as yup from 'yup';
  import AgeInput from 'src/pages/home/age-input.svelte';
  import NameInput from 'src/pages/home/name-input.svelte';
  import AgeListener from 'src/pages/home/age-listener.svelte';
  import {setFfwContext, addSveltePlugin} from 'ffw-svelte';
  import {FfwForm, prepareYup} from 'ffw';
  import NameListener from './name-listener.svelte';

  const ffw = new FfwForm({
    initValues: {
      age: 42,
      name: 'Robbin',
    },
    plugins: [addSveltePlugin()],
    validateSchema: prepareYup({
      age: yup.number().required(),
      name: yup.string().required(),
    }),
  });
  globalThis.form = ffw;

  setFfwContext(ffw);
  const valid = ffw.svelte.valid;
</script>

<AgeInput />
<AgeListener />
<NameInput />
<NameListener />
{#if $valid}
  valid
{/if}
{#if !$valid}
  invalid
{/if}
