interface EnvConfig {
    baseURL: string;
    apiPost: string;
    apiPokemon: string;
}

export class Environment {
    private static configs: Record<string, EnvConfig> = {
        QA: {
            baseURL: 'https://en.wikipedia.org/wiki',
            apiPost: 'https://jsonplaceholder.typicode.com/',
            apiPokemon: 'https://pokeapi.co/api/v2/',
        },
        CERT: {
            baseURL: 'https://en.wikipedia.org/wiki',
            apiPost: 'https://jsonplaceholder.typicode.com/',
            apiPokemon: 'https://pokeapi.co/api/v2/',
        },
        DEFAULT: {
            baseURL: 'https://en.wikipedia.org/wiki',
            apiPost: 'https://jsonplaceholder.typicode.com/',
            apiPokemon: 'https://pokeapi.co/api/v2/',
        },
    };

    static getConfig(): EnvConfig {
        const env = process.env.ENVIRONMENT || 'DEFAULT';
        return Environment.configs[env] || Environment.configs.DEFAULT;
    }
}
