<script lang="ts">
    import { onMount } from 'svelte';

	function deburr (str: string) {
		// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	function fetchCountries() {
		// Fetch all required data on page-load
		// https://restcountries.com/#endpoints-rest-countries-typed-api-package
		fetch(`https://restcountries.com/v3.1/independent?status=true&fields=name,flags`)
		.then( res => res.json())
		.then( res => {
			const d = new Date();
			console.log(`countries fetched ${d.getTime()}`)
			countries = res.map( (country: API.Country) => {
				return {
					// deburr removes accents from letters
					name : deburr(country.name.common),
					flag : country.flags.svg
				}
			})
			randomiseCountries();
			firstTargetCountry();
		})
		.catch( () => {
			console.error("Failed to fetch country data!")
		})
	}

	function randomiseCountries() {
		const length = countries.length;
		const newCountries: App.Country[] = new Array(length);
		countries.forEach( (country: App.Country) => {
			let randomIndex = Math.floor( Math.random() * length );
			while (newCountries[randomIndex] != undefined)
				randomIndex = (randomIndex + 1) % length;
			newCountries[randomIndex] = country
		})
		countries = newCountries;
	}

	// function keydown(event: KeyboardEvent) {}
	function confirmReset() {}
	function handleNextClick() {}
	function handleEnter() {}

	function simplifyString(string: String){
		return string.replace(/\W/g, '').toLowerCase();
	}

	function firstTargetCountry() {
		countryIndex = 0;
		targetCountry = countries[countryIndex];
	}

	function nextTargetCountry() {
		countryIndex = (countryIndex + 1) % countries.length;
		if (countryIndex === 0)
			// TODO: Could do some sort of game complete thing
			randomiseCountries();
		targetCountry = countries[countryIndex];
	}

	function handleInputChange() {

		// Clears suggestions if input is empty
		if (!currentUserInputText.length) {
			suggestions = [];
			return;
		}

		// Handle 'correct answer' scenario
		if (!studyMode && simplifyString(currentUserInputText) === simplifyString(targetCountry.name)) {
			score++;
			currentUserInputText = "";
			suggestions = [];
			nextTargetCountry();
			return
		}

		// Displays relevent suggestions
		suggestions = []
		countries.forEach( country => {
			if (simplifyString(country.name).includes(simplifyString(currentUserInputText)))
				suggestions.push(country.name);
		})
	}

	function changeGameMode() {
		if (!studyMode && score > highScore)
			highScore = score;
		if (studyMode)
			nextTargetCountry();

		resetSuggestions();
		score = 0;
		studyMode = !studyMode;
	}

	function resetSuggestions() {
		currentUserInputText = "";
		suggestions = [];
	}

	// Non UI global variables
	let countryIndex: number = 0;

	// State variables bound to the UI
	let studyMode = $state(false);
	let countries: App.Country[] = $state([]);
	let suggestions: String[] = $state([]);
	let targetCountry: App.Country = $state({name: "", flag: ""});
	let score: number = $state(0);
	let highScore: number = $state(0);
	let currentUserInputText: String = $state("");

	// Ran Once
	onMount(() => {
		fetchCountries();
	})

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
					resetSuggestions();
				}
			}}
			oninput={handleInputChange}
			placeholder={studyMode ? "Search country here" : "Type answer here"}
			class="box"
			type="text"
		/>
		{#if suggestions.length > 0}
			<ul class="suggestions box">
				{#each suggestions as suggestion}
					<li class="suggestion">
						<button class="suggestionButton" >
							<!-- onclick={() => handleInputChange()}> -->
							{suggestion}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="my-flag">
		{#if targetCountry.name === "" && targetCountry.flag === ""}
			<b class="loader">Loading...</b>
		{:else}
			<img
				class="image"
				height="999999px"
				src={targetCountry.flag}
				alt={`Flag of ${targetCountry.name}`}
			/>
		{/if}
	</div>

	<div class="my-dashboard">
		<ul class="boxes">
			<button class="box" onclick={changeGameMode}>
				{studyMode ? "Start Quiz!" : "Give up"}
			</button>
			<div class="box">
				{studyMode ? targetCountry.name || "Loading..." : `Score: ${score}`}
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
