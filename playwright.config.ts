import { defineConfig, devices } from '@playwright/test';
import { Environment } from './config/environments';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env
const config = Environment.getConfig(); // Obtener la configuración del entorno actual
console.log(`[PW] ENV=${process.env.ENVIRONMENT ?? 'DEFAULT'} baseURL=${config.baseURL}`);

export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: config.baseURL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure', // Guardar trace solo en fallos
        video: 'retain-on-failure', // Grabar video solo en fallos
        screenshot: 'only-on-failure', // Tomar captura de pantalla solo en fallos
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
