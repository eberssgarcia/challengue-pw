import { test as base } from '@playwright/test';

import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

type Fixtures = { secretHash: string };

export const test = base.extend<Fixtures>({
    secretHash: [
        async ({}, use) => {
            const env = (process.env.ENVIRONMENT || '').toUpperCase();
            if (!['QA', 'CERT'].includes(env)) {
                throw new Error(`ENVIRONMENT debe ser QA o CERT. Valor actual: "${env}"`);
            }

            const secret = process.env[env];
            if (!secret) throw new Error(`Falta la clave secreta para ${env} en .env`);

            // Hashear el secreto con SHA-256
            const hash = crypto.createHash('sha256').update(secret).digest('hex');
            console.log(`[secret:${env}] ${hash}`);

            // Proveer el hash al test
            await use(hash);
        },
        { auto: true },
    ],
});

export { expect } from '@playwright/test';
