declare namespace NodeJS {
	export interface ProcessEnv {
		DB_HOST: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_NAME: string;
		JWT_SECRET_KEY: string;
		PORT: string;
		// add more here
	}
}
