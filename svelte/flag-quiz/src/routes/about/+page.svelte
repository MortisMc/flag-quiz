<script lang="ts">
    import { onMount } from 'svelte';

	function deburr(str: string): string {
		// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	function countyNameAlphabeticalCompare(a: App.Country, b: App.Country): 0 | 1 | -1 {
		const sortedArray: string[] = [a.name,b.name].sort();

		if (sortedArray[0] === sortedArray[1])
		{
			console.error("Duplicate country names encountered!")
			return 0;
		}

		if (sortedArray[0] === a.name)
			return -1;

		if (sortedArray[0] === b.name)
			return 1;

		console.error("i dont get javascript object comparison :)")
		return 0;

	}

	function fetchCountries() {
		// Fetch all required data on page-load
		// https://restcountries.com/#endpoints-rest-countries-typed-api-package
		fetch(`https://restcountries.com/v3.1/independent?status=true&fields=name,flags`)
		.then( res => res.json())
		.then( (res: API.Country[]) => {
			const d = new Date();
			console.log(`countries fetched ${d.getTime()}`)

			// Convert api version of countries array to app version
			countries = res.map( (country: API.Country): App.Country => {
				return {
					id: INVALID_COUNTRY_ID, // Initialised during sort
					nextCountryId: INVALID_COUNTRY_ID, // Initialised during randomise
					name : deburr(country.name.common), // deburr removes accents from letters
					flag : country.flags.svg
				}
			})

			numberOfCountries = countries.length;

			// Sort the array into alphabetical order by country name
			countries.sort( countyNameAlphabeticalCompare )

			// Assign IDs according to this sorted alphabetical order
			countries.forEach( (country: App.Country, id: number) => {
				country.id = id;
			})

			// Assign nextCountryIds based on random order and assign first target country
			const firstTargetCountryId = randomiseCountries();
			targetCountry = countries[firstTargetCountryId];
		})
		.catch( (reason) => {
			console.error(reason)
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
		const nextIdAlphabetical = (targetCountry.id + 1) % numberOfCountries;
		targetCountry = countries[nextIdAlphabetical];
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
