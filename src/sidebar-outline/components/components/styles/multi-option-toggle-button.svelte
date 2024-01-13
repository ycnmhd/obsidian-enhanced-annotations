<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import { Notice } from 'obsidian';
	import { CaseLowerIcon, CaseSensitiveIcon, CaseUpperIcon } from 'lucide-svelte';

	const icons = {
		'case-lower': CaseLowerIcon,
		'case-upper': CaseUpperIcon,
		'case-sensitive': CaseSensitiveIcon
	};

	type Option<T extends string | number> = {
		name?: string;
		value: T;
	} & ({ iconName: keyof typeof icons } | { iconHtml: string });

	type Props<T extends string | number> = {
		options: Option<T>[];
		value?: T;
		onChange: (value?: T) => void;
		name: string;
	};
	export let props: Props<string | number>;

	const defaultOption: Option<string | number> = {
		...props.options[0],
		name: props.name
	};

	let option = props.options.find((o) => o.value === props.value);
	let iconOption: Option<string | number>;
	$: iconOption = option || defaultOption;

	let notice: Notice;
	const onClick = () => {
		let i = option ? props.options.indexOf(option) + 1 : 0;
		if (i >= props.options.length) i = -1;
		const newOption = props.options[i];
		const value = newOption ? newOption.value : undefined;
		option = newOption;
		props.onChange(value);
		if (notice) notice.hide();
		notice = new Notice(`'${props.name}' set to '${value || 'default'}'`);
	};
</script>

<button
	aria-label={option
        ? `${props.name}: ${option.value}`
        : `${props.name}: default`}
	class={'toggle-button' + (option ? ' toggle-button--enabled' : '')}
	on:click={onClick}
>
	{#if 'iconHtml' in iconOption}
		{@html iconOption.iconHtml}
	{:else}
		<svelte:component this={icons[iconOption.iconName]} class="svg-icon" />
	{/if}
</button>

<style>
	.toggle-button {
		cursor: pointer;
		color: var(--icon-color);
		opacity: 30%;
		width: 30px;
		height: 30px;
		padding: 2px;
		border-bottom: 2px solid var(--tab-outline-color);
	}

	.toggle-button--enabled {
		/*color: var(--color-accent);*/
		opacity: 100%;
	}
</style>
