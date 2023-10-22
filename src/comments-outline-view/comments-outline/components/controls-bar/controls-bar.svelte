<script>

	import { copyCommentsToClipboard } from "./helpers/copy-comments-to-clipboard";
	import TabsFilter from "./components/tabs-filter/tabs-filter.svelte";
	import SearchInput from "./components/search-input/search-input.svelte";
	import {
		fontSize,
		isReading,
		POSSIBLE_FONT_SIZES,
		showAllButtons,
		showLabelsFilter,
		showSearchInput
	} from "./controls-bar.store";
	import { tts } from "./helpers/tts";
	import NavButton from "./components/clickable-icon.svelte";
	import { l } from "../../../../lang/lang";
	import { searchTerm } from "./components/search-input/search-input.store";

	import { filteredHiddenLabels } from "../comments-list/comments-list.store";

	const toggleFontSize = (e) => {
		const delta = e.shiftKey ? -1 : 1;
		const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) + delta;
		fontSize.set(POSSIBLE_FONT_SIZES[i] ? POSSIBLE_FONT_SIZES[i] : POSSIBLE_FONT_SIZES[i < 0 ? POSSIBLE_FONT_SIZES.length - 1 : 0]);
	};

	const toggleLabelsFilter = () => {
		showLabelsFilter.set(!$showLabelsFilter);
	};
	const toggleShowSearchInput = () => {
		showSearchInput.set(!$showSearchInput);
	};

	const read = () => {
		if (!tts.isReading) {
			tts.read();
		} else {
			tts.stop();
		}
	};
	const toggleShowAllButtons = () => {
		showAllButtons.set(true);
	};

</script>

<div class="nav-header outline-controls">

	<div class="nav-buttons-container">

		<NavButton
			isActive={$showLabelsFilter}
			label={l.OUTLINE_FILTER_LABELS}
			onClick={toggleLabelsFilter}
			hasEnabledItems={$filteredHiddenLabels.size>0}
		>
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
				<path d="M3 6h18" />
				<path d="M7 12h10" />
				<path d="M10 18h4" />
			</svg>
		</NavButton>

		<NavButton label={l.OUTLINE_FILTER_COMMENTS} onClick={toggleShowSearchInput} isActive={$showSearchInput}
				   hasEnabledItems={$searchTerm}>
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
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>

		</NavButton>
		{#if !$showAllButtons}
			<NavButton label={l.OUTLINE_SHOW_ALL_CONTROLS} onClick={toggleShowAllButtons}>
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
					<circle cx="12" cy="12" r="1" />
					<circle cx="19" cy="12" r="1" />
					<circle cx="5" cy="12" r="1" />
				</svg>
			</NavButton>

		{:else}

			<NavButton label={l.OUTLINE_READ_COMMENTS} onClick={read} isActive={$isReading}>
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
				{:else }
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
							d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
						<polyline points="14 2 14 8 20 8" />
						<path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" />
						<path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" />
						<path d="M2 19v-3a6 6 0 0 1 12 0v3" />
					</svg>
				{/if}
			</NavButton>
			<NavButton label={l.OUTLINE_COPY_COMMENTS_TO_CLIPBOARD}
					   onClick={copyCommentsToClipboard}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
					 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
					 class="svg-icon lucide lucide-clipboard-copy">
					<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
					<path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
					<path d="M16 4h2a2 2 0 0 1 2 2v4" />
					<path d="M21 14H11" />
					<path d="m15 10-4 4 4 4" />
				</svg>
			</NavButton>
			<NavButton label={l.OUTLINE_TOGGLE_FONT_SIZE} onClick={toggleFontSize}>
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
					<path d="m3 15 4-8 4 8" />
					<path d="M4 13h6" />
					<circle cx="18" cy="12" r="3" />
					<path d="M21 9v6" />
				</svg>
			</NavButton>
		{/if}

	</div>

	{#if $showSearchInput}
		<SearchInput />
	{/if}
	{#if $showLabelsFilter}
		<TabsFilter />
	{/if}
</div>

<style>
	.outline-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		gap: 10px;
		align-self: center;
		justify-self: center;
		margin-bottom: 10px;
		box-sizing: border-box;
		height: auto;
	}

	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}


</style>
