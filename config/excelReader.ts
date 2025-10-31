import * as XLSX from 'xlsx';
import * as path from 'path';

type Row = (string | number | null | undefined)[];

export interface PokemonData {
    id: number;
    name: string;
}

export class ExcelReader {
    private static cache: Record<string, Row[]> = {};

    private static loadRaw(fileName: string): Row[] {
        const filePath = path.resolve(__dirname, `../data/${fileName}`);
        if (!this.cache[fileName]) {
            const wb = XLSX.readFile(filePath);
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const raw = XLSX.utils.sheet_to_json<Row>(sheet, { header: 1 }) as Row[];
            this.cache[fileName] = raw;
        }
        return this.cache[fileName];
    }

    /** Devuelve filas sin cabecera */
    static rows(fileName: string): Row[] {
        const raw = this.loadRaw(fileName);
        return raw.slice(1).filter(Boolean);
    }

    /** Para API: id + name*/
    static pokemons(fileName: string): PokemonData[] {
        const out: PokemonData[] = [];
        const seen = new Set<number>();
        for (const r of this.rows(fileName)) {
            const id = Number(r[0]);
            const name = String(r[1] ?? '').trim();
            if (Number.isFinite(id) && name && !seen.has(id)) {
                out.push({ id, name });
                seen.add(id);
            }
        }
        return out;
    }

    /** Para Web: solo nombres */
    static names(fileName: string): string[] {
        const out: string[] = [];
        const seen = new Set<string>();
        for (const r of this.rows(fileName)) {
            const name = String(r[1] ?? '').trim();
            const key = name.toLowerCase();
            if (name && !seen.has(key)) {
                out.push(name);
                seen.add(key);
            }
        }
        return out;
    }
}
