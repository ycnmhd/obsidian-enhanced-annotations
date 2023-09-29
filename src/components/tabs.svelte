<script>
	let activeTab = 0; // Index of the active tab
	export let tabs;

	// Function to set the active tab
	const setActiveTab = index => {
		activeTab = index;
	};
</script>

<div class="tabs">
	<!-- Tab Headers -->
	<ul class="tab-headers">
		{#each tabs as tab, index (tab.id)}
			<li
				class={index === activeTab ? 'active' : ''}
				on:click={() => setActiveTab(index)}
			>{tab.label}</li>
		{/each}
	</ul>

	<!-- Tab Content -->
	<div class="tab-content">
		{#each tabs as tab, index (tab.id)}
			<div class={index === activeTab ? 'active' : ''}>
				{#if tab.content}
					{tab.content}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Add your styling here */
	.tabs {
		/* Add styles for the tabs container */
	}

	.tab-headers {
		/* Add styles for the tab headers */
	}

	.tab-headers li {
		/* Add styles for individual tab headers */
		cursor: pointer;
	}

	.tab-headers .active {
		/* Add styles for the active tab header */
		/* For example: background-color: #007bff; color: #fff; */
	}

	.tab-content {
		/* Add styles for the tab content container */
	}

	.tab-content.active {
		/* Add styles for the active tab content */
	}
</style>
