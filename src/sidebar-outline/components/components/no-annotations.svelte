<script lang="ts">
    import { l } from '../../../lang/lang';

    export let variant: 'filter-applied' | null | undefined = undefined;
</script>

<div class="pane-empty">
    {variant === 'filter-applied'
        ? l.OUTLINE_NO_ANNOTATIONS_MATCH_FILTER
        : l.OUTLINE_NO_ANNOTATIONS_FOUND}
</div>
