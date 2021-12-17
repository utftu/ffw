<script lang="ts">
	import {setContext, initForm} from '../../../packages/ffw-s/dist/esm/dev.js';
	const form = initForm(
		{
		initValues: {
			name: 'aleks'
		}
	}
	)
	setContext(form)
	
	import Test from '../lib/test.svelte'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<Test/>
</section>
