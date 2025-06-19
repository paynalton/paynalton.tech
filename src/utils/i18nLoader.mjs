// src/utils/i18nLoader.js (o i18nLoader.ts si usas TypeScript)
import fs from 'node:fs/promises'; // Usa 'node:fs/promises' para promesas
import path from 'node:path';

// Función para cargar todos los diccionarios disponibles
export async function loadAllDictionaries(localesDir = 'src/locales') {
    const dictionaries = {};
    const fullLocalesPath = path.resolve(localesDir); // Ruta absoluta a la carpeta de locales

    try {
        const files = await fs.readdir(fullLocalesPath); // Lee todos los archivos en el directorio
        for (const file of files) {
            if (file.endsWith('.json')) {
                const lang = file.replace('.json', '');
                const filePath = path.join(fullLocalesPath, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                dictionaries[lang] = JSON.parse(fileContent);
            }
        }
    } catch (error) {
        console.error('Error loading dictionaries:', error);
        // Puedes lanzar el error o devolver un objeto vacío
    }
    return dictionaries;
}