<script lang="ts">
	// import { resolve } from '$app/paths';

	let studyMode = $state(false);
	let countries: App.Country[] = $state([]);
	let suggestions: App.Country[] = $state([]);
	let country: App.Country = $state({
		name: "United Kingdom",
		flag: "https://flagcdn.com/gb.svg",
	});
	let score: Number = $state(0);
	let highScore: Number = $state(0);
	let currentUserInputText: String = $state("");

	// function keydown(event: KeyboardEvent) {}
	function confirmReset() {}
	function handleNextClick() {}
	function handleEnter() {}
	function handleInputChange() {}
</script>

<!-- <svelte:window onkeydown={keydown} /> -->

<svelte:head>
	<title>Flag quiz</title>
	<meta name="description" content="Flag quiz main page" />
</svelte:head>

<div class="my-app">
	<div class="my-interface">
		<input
			bind:value={currentUserInputText}
			onkeydown={(event) => {
				if (studyMode && event.key === "Enter") handleEnter();
			}}
			onkeyup={(e) => {
				if (e.key === "Escape") {
					currentUserInputText = "";
					suggestions = [];
				}
			}}
			onchange={(event) => handleInputChange()}
			placeholder={studyMode ? "Search country here" : "Type answer here"}
			class="box"
			type="text"
		/>
		{#if suggestions.length > 0}
			<ul class="suggestions box">
				{#each suggestions as suggestion}
					<li class="suggestion">
						<button class="suggestionButton" onclick={() => handleInputChange()}>
							{suggestion.name}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="my-flag">
		{#if country.name}
			<img
				class="image"
				height="999999px"
				src={country.flag}
				alt={`Flag of ${country.name}`}
			/>
		{:else}
			<b class="loader">Loading...</b>
		{/if}
	</div>

	<div class="my-dashboard">
		<ul class="boxes">
			<button class="box" onclick={() => (studyMode = !studyMode)}>
				{studyMode ? "Start Quiz!" : "Give up"}
			</button>
			<div class="box">
				{studyMode ? country.name || "Loading..." : `Score: ${score}`}
			</div>
			<button onclick={confirmReset} class="box">
				High Score: {highScore}
			</button>
		</ul>
		{#if studyMode}
			<button class="box" onclick={handleNextClick}>Next Country</button>
		{/if}
	</div>
</div>
