<script lang="ts">
	import NavButton from '../controls-bar/components/clickable-icon.svelte';
	import { l } from '../../../../lang/lang';
	import { fontSize, isReading, POSSIBLE_FONT_SIZES, showStylesSettings } from '../controls-bar/controls-bar.store';
	import { tts } from '../controls-bar/helpers/tts';
	import { Paintbrush } from 'lucide-svelte';
	import LabeledAnnotations from '../../../../main';
	import { onDestroy } from 'svelte';
	import {
		Annotation
	} from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
	import { filteredBySearchAndCategory } from '../annotations-list/annotations-list.store';
	import { annotationsToText } from '../../../../clipboard/helpers/annotations-to-text';
	import { clipboard } from 'electron';
	import { Notice } from 'obsidian';

	export let plugin: LabeledAnnotations;


	const state: { annotations: Annotation[] } = { annotations: undefined as any };

	const unsubscribe = filteredBySearchAndCategory.subscribe((v) => {
		state.annotations = Object.values(v.labels)
			.flat()
			.sort((a, b) => a.position.from - b.position.from);
	});
	onDestroy(unsubscribe);

	export const copyAnnotationsToClipboard = () => {
		const outline = plugin.outline;
		const f = outline.getValue().view?.file;
		if (f) {
			const path = f.parent?.path as string;
			const name = f.basename;

			const text = annotationsToText(
				[{ path, name, annotations: state.annotations }],
				plugin.settings.getValue().clipboard.templates,
				path
			);
			clipboard.writeText(text);
			new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
		} else {
			new Notice(l.OUTLINE_NOTICE_COULD_NOT_COPY);

		}
	};


	const increaseFontSize = () => {
		const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) + 1;
		fontSize.set(
			POSSIBLE_FONT_SIZES[Math.min(i, POSSIBLE_FONT_SIZES.length - 1)]
		);
	};
	const decreaseFontSize = () => {
		const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) - 1;
		fontSize.set(POSSIBLE_FONT_SIZES[Math.max(i, 0)]);
	};
	const read = () => {
		if (!tts.isReading) {
			tts.read();
		} else {
			tts.stop();
		}
	};

	const toggleShowStylesSettings = () => {
		showStylesSettings.update((v) => !v);
	};
</script>

<div class="nav-buttons-container">
	<NavButton
		isActive={$isReading}
		label={l.OUTLINE_READ_ANNOTATIONS}
		onClick={read}
	>
		{#if $isReading}
			<svg
				class="svg-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<rect width="6" height="6" x="9" y="9" />
			</svg>
		{:else}
			<svg
				class="svg-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"
				/>
				<polyline points="14 2 14 8 20 8" />
				<path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" />
				<path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" />
				<path d="M2 19v-3a6 6 0 0 1 12 0v3" />
			</svg>
		{/if}
	</NavButton>
	<NavButton
		label={l.OUTLINE_COPY_ANNOTATIONS_TO_CLIPBOARD}
		onClick={copyAnnotationsToClipboard}
	>
		<svg
			class="svg-icon lucide lucide-clipboard-copy"
			fill="none"
			height="18"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			viewBox="0 0 24 24"
			width="18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
			<path
				d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
			/>
			<path d="M16 4h2a2 2 0 0 1 2 2v4" />
			<path d="M21 14H11" />
			<path d="m15 10-4 4 4 4" />
		</svg>
	</NavButton>
	<NavButton
		disabled={POSSIBLE_FONT_SIZES.indexOf($fontSize) === 0}
		label={l.OUTLINE_DECREASE_FONT_SIZE}
		onClick={decreaseFontSize}
	>
		<svg
			class="svg-icon lucide lucide-case-sensitive"
			fill="none"
			height="24"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="m 3,17 4,-8 4,8" id="path1" />
			<path d="m 4,15 h 6" id="path2" />
			<circle cx="18" cy="14" id="circle2" r="3" />
			<path d="m 21,11 v 6" id="path3" />
			<rect
				height="3.880337"
				style="stroke-width:1.58341"
				transform="rotate(90)"
				width="0.064672284"
				x="5.3965225"
				y="-20.387436"
			/>
		</svg>
	</NavButton>
	<NavButton
		disabled={POSSIBLE_FONT_SIZES.indexOf($fontSize) ===
            POSSIBLE_FONT_SIZES.length - 1}
		label={l.OUTLINE_INCREASE_FONT_SIZE}
		onClick={increaseFontSize}
	>
		<svg
			class="svg-icon lucide lucide-case-sensitive"
			fill="none"
			height="24"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="m 3,17 4,-8 4,8" id="path1" />
			<path d="m 4,15 h 6" id="path2" />
			<circle cx="18" cy="14" id="circle2" r="3" />
			<path d="m 21,11 v 6" id="path3" />
			<rect
				height="3.880337"
				style="stroke-width:1.58341"
				transform="rotate(90)"
				width="0.064672284"
				x="5.3965225"
				y="-20.387436"
			/>
			<rect
				height="3.880337"
				style="stroke-width:1.58341"
				transform="scale(-1)"
				width="0.064672284"
				x="-18.479605"
				y="-7.3690276"
			/>
		</svg>
	</NavButton>
	<NavButton
		isActive={$showStylesSettings}
		label={l.OUTLINE_TOGGLE_STYLES_SETTINGS}
		onClick={toggleShowStylesSettings}
	>
		<Paintbrush class="svg-icon" />
	</NavButton>
</div>

<style>
	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
