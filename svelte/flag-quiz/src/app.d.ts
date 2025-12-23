// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Country {
			id: Number;
			name: string;
			flag: string;
		}
	}
	namespace API {
		interface Country {
			name: {
				common: string;
				official: string;
				nativeName?: Record<string, {official: string; common: string }> 
			};
			flags: { png: string; svg: string; alt?: string };
		}
	}
}

export {};
