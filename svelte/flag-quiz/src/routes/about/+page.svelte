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
		.then( (res: API.Country[]) => {
			const d = new Date();
			console.log(`countries fetched ${d.getTime()}`)
			countries = res.map( (country: API.Country, idx: number): App.Country => {
				return {
					id: idx,
					nextCountryId: INVALID_COUNTRY_ID, // initialised later
					name : deburr(country.name.common), // deburr removes accents from letters
					flag : country.flags.svg
				}
			})

			numberOfCountries = countries.length;

			const firstTargetCountryId = randomiseCountries();
			targetCountry = countries[firstTargetCountryId];
		})
		.catch( () => {
			console.error("Failed to fetch country data!")
		})
	}

	function randomiseCountries(): number {
		const newCountryOrder: number[] = new Array(numberOfCountries);
		countries.forEach( (country: App.Country) => {
			let randomIndex = Math.floor( Math.random() * numberOfCountries );
			while (newCountryOrder[randomIndex] != undefined)
				// A country has already been assigned this index, keep cycling
				randomIndex = (randomIndex + 1) % numberOfCountries;
			newCountryOrder[randomIndex] = country.id;
		})
		// order:       1st  2nd  3rd  4th  5th  ...
		// country id:   5    1    3    4    2   ...
		newCountryOrder.forEach( (countryId: number, idx: number, orderArray: number[]) => {
			// nextCountryId is only non-zero if there's more countryIds left in the array
			if (idx + 1 < numberOfCountries)
				countries[countryId].nextCountryId = orderArray[idx + 1];
			else
				countries[countryId].nextCountryId = INVALID_COUNTRY_ID;
		});

		return newCountryOrder[0];
	}

	// function keydown(event: KeyboardEvent) {}
	function confirmReset() {
		// TODO
	}
	function handleNextClick() {
		// TODO
	}
	function handleEnter() {
		// TODO
	}

	function simplifyString(string: String){
		return string.replace(/\W/g, '').toLowerCase();
	}

	function nextTargetCountry() {
		if (targetCountry.nextCountryId > INVALID_COUNTRY_ID)
			targetCountry = countries[targetCountry.nextCountryId];
		else
			// TODO
			console.log("GAME OVER!");
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
			resetSuggestions();
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

	// Global constants
	const UNINITIALISED_TARGET_COUNTRY: App.Country = { id: 0, nextCountryId: 0, name: "", flag: "" }
	const UNINITIALISED_TARGET_COUNTRY_STRING: string = JSON.stringify(UNINITIALISED_TARGET_COUNTRY);
	const INVALID_COUNTRY_ID = -1;

	// Non UI global variables
	let numberOfCountries: number = -1;

	// State variables bound to the UI
	let studyMode: boolean = $state(false);
	let countries: App.Country[] = $state([]);
	let suggestions: String[] = $state([]);
	let targetCountry: App.Country = $state(UNINITIALISED_TARGET_COUNTRY);
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
		{#if JSON.stringify(targetCountry) === UNINITIALISED_TARGET_COUNTRY_STRING}
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
