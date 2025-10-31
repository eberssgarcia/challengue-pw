import { test, expect } from '../fixtures/secret.fixture';

import { WikipediaPage } from '../../pages/wikipediaPage';
import { Environment } from '../../config/environments';
import { ExcelReader } from '../../config/excelReader';
import { ensureDir, fileSize } from '../../utils/fsHelper';
import { logStart, logEnd } from '../../utils/logger';
import * as path from 'path';

const cfg = Environment.getConfig();
const names = ExcelReader.names('pokemon.xlsx'); // lee tu archivo real
const IMAGES_DIR = path.resolve(__dirname, '../../images');

test.describe('Ver Pokemon en Wikipedia - WEB', () => {
    test.beforeAll(async () => {
        await ensureDir(IMAGES_DIR);
        await ensureDir(IMAGES_DIR);
    });

    for (const name of names) {
        test(`Validar pokemon ${name}`, async ({ page }, testInfo) => {
            // Annotaciones en el reporte
            testInfo.annotations.push({ type: 'ID Issue 1003', description: 'Ver Pokémon en Wikipedia' });

            // fecha y hora de inicio de test
            logStart(`Test ${name}`);

            const wiki = new WikipediaPage(page, cfg.baseURL); // base: https://en.wikipedia.org/wiki
            await wiki.goToWikipedia(name);

            // validar título
            await wiki.assertTitleEquals(`${name}`);

            // mostrar en consola quién realizó el dibujo
            await wiki.validateArtist(`${name}`);

            // Abrir imagen
            await wiki.openImage();

            // Descargar y guardar en /images
            const { filePath, filename, extension, sizeBytes } = await wiki.downloadImageTo(IMAGES_DIR);

            // assert extensión válida (case-insensitive)
            const validExts = new Set(['.jpg', '.jpeg', '.png', '.svg']);
            expect(validExts.has(extension.toLowerCase()), `Extensión inválida: ${extension}`).toBeTruthy();

            // assert tamaño < 500000 bytes
            const actualSize = sizeBytes || (await fileSize(filePath));
            expect(actualSize, `El archivo supera 500000 bytes (${actualSize})`).toBeLessThan(500000);

            // fecha y hora de fin
            logEnd(`Test ${name}`);

            // Info útil en consola
            console.log(`[downloaded] ${filename} -> ${actualSize} bytes`);
        });
    }
});
