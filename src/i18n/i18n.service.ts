import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

interface Translations {
    [key: string]: Record<string, string>;
}

@Injectable()
export class I18nService {
    private translations: Translations = {};

    constructor() {
        this.loadTranslations();
    }

    private loadTranslations() {
        const localesDir = path.join(__dirname, 'locales');
        const files = fs.readdirSync(localesDir);

        files.forEach((file) => {
            if (file.endsWith('.json')) {
                const lang = file.replace('.json', '');
                const fullPath = path.join(localesDir, file);
                try {
                    const data = fs.readFileSync(fullPath, 'utf8');
                    this.translations[lang] = JSON.parse(data);
                } catch (err) {
                    console.error(`Failed to load locale file ${file}:`, err);
                }
            }
        });
    }

    detectLanguage(req: Request): string {
        const xLang = req.headers['x-lang'];
        if (typeof xLang === 'string' && this.translations[xLang]) {
            return xLang;
        }

        const acceptLang = req.headers['accept-language'];
        if (typeof acceptLang === 'string') {
            const langs = acceptLang.split(',').map((l) => l.trim().split(';')[0]);
            for (const lang of langs) {
                if (this.translations[lang]) {
                    return lang;
                }
            }
        }

        return 'en';
    }

    t(lang: string, keyword: string, components?: Record<string, string | number>): string {
        let template = this.translations[lang]?.[keyword] || keyword;

        if (components) {
            for (const [key, value] of Object.entries(components)) {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                template = template.replace(regex, String(value));
            }
        }

        return template;
    }
}
