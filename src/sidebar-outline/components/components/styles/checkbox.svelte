<script lang="ts">
	export let enabled: boolean;
	export let label: string;
	export let onClick: (enabled: boolean) => void;
	let _enabled = enabled;
</script>

<div
	aria-label={label}
	class={'checkbox-container' + (_enabled ? ' is-enabled' : '')}
>
	<input
		checked={_enabled}
		on:change={() => {
            _enabled = !_enabled;
            onClick(_enabled);
        }}
		type="checkbox"
	/>
</div>
