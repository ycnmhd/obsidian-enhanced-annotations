<script lang="ts">
  import ControlsBar from "./components/controls-bar/controls-bar.svelte";
  import FlatOutline from "./components/annotations-list/annotations-list.svelte";
  import NoAnnotations from "./components/no-annotations.svelte";
  import { searchTerm } from "./components/controls-bar/components/search-input.store";
  import { filteredBySearch } from "./components/annotations-list/annotations-list.store";
  import LabeledAnnotations from "../../main";
  import { pluginIdle } from "./components/controls-bar/controls-bar.store";
  import PluginIdle from "./components/plugin-idle.svelte";

  export let plugin: LabeledAnnotations;
</script>

<div class="outline">
  {#if $pluginIdle}
    <PluginIdle plugin={plugin} />
  {:else }
    {#if Object.values($filteredBySearch.labels).flat().length || $searchTerm.length}
      <ControlsBar plugin={plugin} />

      <FlatOutline plugin={plugin} />

    {:else }
      <NoAnnotations />
    {/if}
  {/if}

</div>

<style>


    .outline {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
    }


</style>
