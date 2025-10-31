import * as fs from 'fs';
import * as path from 'path';

// Asegura que un directorio exista, creándolo si es necesario
export async function ensureDir(dirPath: string): Promise<void> {
    await fs.promises.mkdir(dirPath, { recursive: true });
}

export async function saveBuffer(filePath: string, data: Buffer): Promise<void> {
    await ensureDir(path.dirname(filePath));
    await fs.promises.writeFile(filePath, data); // sobrescribir si existe
}

// Obtiene el tamaño de un archivo en bytes
export async function fileSize(filePath: string): Promise<number> {
    const stat = await fs.promises.stat(filePath);
    return stat.size;
}
