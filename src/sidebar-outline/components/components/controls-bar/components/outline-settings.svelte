<script lang="ts">
    import { fontSize, POSSIBLE_FONT_SIZES } from '../controls-bar.store';
    import { l } from '../../../../../lang/lang';
    import NavButton from './clickable-icon.svelte';

    const increaseFontSize = () => {
        const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) + 1;
        fontSize.set(
            POSSIBLE_FONT_SIZES[Math.min(i, POSSIBLE_FONT_SIZES.length - 1)],
        );
    };
    const decreaseFontSize = () => {
        const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) - 1;
        fontSize.set(POSSIBLE_FONT_SIZES[Math.max(i, 0)]);
    };
</script>

<div style="display: flex;">
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
</div>
