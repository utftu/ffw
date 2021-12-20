<script lang="ts">
	import * as yup from 'yup'
	import {setContext, initForm} from '../../../packages/ffw-s/dist/esm/dev.js';
	const form = initForm(
		{
		initValues: {
			name: 'aleks'
		},
		validateSchema: yup.object({
			name: yup.number().required()
		})
	}
	)
	globalThis.form = form
	setContext(form)
	
	import Test from '../lib/test.svelte'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<Test/>
</section>
