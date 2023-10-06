<script lang="ts">
	type Label = "no-comments-found" | "no-selected-file"
	export let label: Label = "no-comments-found";
	const text: Record<Label, string> = {
		"no-comments-found": "No comments found.",
		"no-selected-file": "No selected file."
	};
</script>

<div class="pane-empty">{text[label]}</div>
