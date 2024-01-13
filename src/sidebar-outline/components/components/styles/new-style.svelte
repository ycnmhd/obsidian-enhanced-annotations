<script lang="ts">
	import { l } from '../../../../lang/lang';
	import SquareButton from './square-button.svelte';
	import LabeledAnnotations from '../../../../main';
	import { Plus } from 'lucide-svelte';

	export let plugin: LabeledAnnotations;
	const newStyle = () => {
		plugin.settings.dispatch({
			type: 'NEW_GROUP',
			payload: { pattern: '' }
		});
	};


</script>

<div style="display: flex; align-items: center; justify-content: end">
	<SquareButton label={l.SETTINGS_LABELS_STYLES_NEW} onClick={newStyle}>
		<Plus class="svg-icon" />
	</SquareButton>
</div>
