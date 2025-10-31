import { test, expect } from '../fixtures/secret.fixture';
import { Environment } from '../../config/environments';
import { logStart, logEnd } from '../../utils/logger';

const config = Environment.getConfig();

test.describe('Creación de Post - API jsonplaceholder', () => {
    test('Crear Post @regression @api', async ({ request }, testInfo) => {
        // API Request
        const bodyRq = { title: 'monnet', body: 'challenge', userId: 1 };
        // loguear inicio
        logStart(`Crear Post API`);

        // Anotaciones en el reporte
        testInfo.annotations.push({ type: 'ID Issue 1001', description: 'Crear Posts enviando datos válidos con estructura JSON' });

        const response = await request.post(`${config.apiPost}/posts`, {
            data: bodyRq,
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json).toMatchObject(bodyRq);

        logEnd(`Crear Post API`);
    });
});
