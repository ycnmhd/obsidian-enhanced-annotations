<script lang="ts">
	import { l } from "../../../lang/lang";
	import LabeledAnnotations from "../../../main";

	export let plugin: LabeledAnnotations;
	const enable = () => {
		plugin.idling.logActivity();
	};
</script>


<div class="plugin-idle">

	<div class="pane-empty">{l.PLUGIN_NAME + l.OUTLINE_PLUGIN_IS_IDLE}

	</div>
	<button on:click={enable}>{l.OUTLINE_ENABLE_PLUGIN}</button>
</div>

<style>
	.plugin-idle {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
