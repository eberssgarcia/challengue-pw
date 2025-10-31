import { Page, Locator, expect, Download } from '@playwright/test';
import * as path from 'path';
import { ensureDir } from '../utils/fsHelper';

export class WikipediaPage {
    // Properties
    readonly page: Page;
    readonly baseUrl: string;
    readonly thumbImage: Locator;
    readonly downloadFileButton: Locator;
    readonly downloadLink: Locator;
    readonly heading: Locator;

    // Constructor
    constructor(page: Page, baseUrl: string) {
        this.page = page;
        this.baseUrl = baseUrl;

        // Locators
        this.heading = page.locator('#firstHeading');
        this.thumbImage = page.locator('xpath=//table[contains(@class,"infobox")]//a/img').first();
        this.downloadFileButton = page.getByRole('button', { name: 'Download this file' });
        this.downloadLink = page.getByRole('link', { name: 'Download' });
    }

    // Methods
    async goToWikipedia(articleName: string) {
        await this.page.goto(`${this.baseUrl}/${articleName}`);
    }

    async assertTitleEquals(expected: string) {
        const title = (await this.heading.innerText()).trim();
        expect(title.toLowerCase()).toBe(expected.toLowerCase());
    }

    async openImage() {
        await this.thumbImage.waitFor({ state: 'visible', timeout: 8000 });
        await this.thumbImage.click();
    }

    async validateArtist(name: string) {
        const artistLocator = this.page.getByRole('link', { name: 'Ken Sugimori' }).first();
        const artistName = await artistLocator.innerText();
        console.log(`Autor de la obra ${name} es ${artistName}`);
    }

    async downloadImageTo(imagesDir: string): Promise<{
        filePath: string;
        filename: string;
        extension: string;
        sizeBytes: number;
        download: Download;
    }> {
        await ensureDir(imagesDir);

        // Hacer clic en "Download this file"
        await this.downloadFileButton.click();

        // Esperar popup y descarga
        const popupPromise = this.page.waitForEvent('popup');
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadLink.click();
        const popup = await popupPromise;
        const download = await downloadPromise;

        const suggested = download.suggestedFilename();
        const filename = suggested || `image_${Date.now()}`;
        const extension = path.extname(filename);
        const filePath = path.join(imagesDir, filename);

        // Guardar (sobrescribir si existe)
        await download.saveAs(filePath);

        // Medir tamaño
        const sizeBytes = (await download.failure()) ? 0 : await (await import('../utils/fsHelper')).fileSize(filePath);

        return { filePath, filename, extension, sizeBytes, download };
    }
}
