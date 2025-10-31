import { test, expect } from '../fixtures/secret.fixture';
import { Environment } from '../../config/environments';
import { ExcelReader } from '../../config/excelReader';
import { logStart, logEnd } from '../../utils/logger';

const config = Environment.getConfig();

const pokemonData = ExcelReader.pokemons('pokemon.xlsx');

test.describe('Listado de Pokémon - API pokeapi', () => {
    for (const { id, name } of pokemonData) {
        test(`Validar datos del Pokémon ${name} (${id}) @smoke @regression @api`, async ({ request }, testInfo) => {
            // loguear inicio de test
            logStart(`${name}`);

            // Anotaciones en el reporte
            testInfo.annotations.push({ type: 'ID Issue 1002', description: 'Listar Pokémon por ID de un archivo Excel' });

            // Medir tiempo de respuesta
            const startTime = Date.now();
            const response = await request.get(`${config.apiPokemon}/pokemon/${id}`);
            // Fin medición tiempo
            const endTime = Date.now();

            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            // Assertions
            expect(body.id).toBe(id);
            expect(body.name.toLowerCase()).toBe(name.toLowerCase());
            expect(body.abilities.length).toBeGreaterThan(0);

            // Validar tiempo de respuesta < 10 segundos
            const duration = (endTime - startTime) / 1000;
            expect(duration).toBeLessThan(10);
            // Tiempo de respuesta
            console.log(`[response time] Pokémon ${name} (${id}) -> ${duration.toFixed(2)} seconds`);

            // loguear fin de test
            logEnd(`${name}`);
        });
    }
});
