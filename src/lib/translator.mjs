import fs from 'fs';

export default class Translator{

    defaultLang = 'en';
    currentLang = 'en';
    currentDictionary = null;
    defaultDictionary = null;

    constructor( defaultLang = 'en' ) {
        this.setLocale(defaultLang, true);
    }

    _t(key, options) {
        return this.currentDictionary 
            && this.currentDictionary[key] ?
            this.currentDictionary[key].replace(/\{(\w+)\}/g, (match, p1) => options[p1] || match) :
            (
                this.defaultDictionary && this.defaultDictionary[key] ?
                this.defaultDictionary[key].replace(/\{(\w+)\}/g, (match, p1) => options[p1] || match) :
                key
            )
    }

    loadDictionary( lang, isDefault = false ) {
        const filePath = `src/locales/${lang}.json`;
        if (fs.existsSync(filePath)) {
            const dictionary = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (isDefault) {
                this.defaultDictionary = dictionary;
            } 
            this.currentDictionary = dictionary;
        }
    }
    
    setLocale(locale, isDefault = false) {
        this.currentLang = locale;
        if (isDefault) {
            this.defaultLang = locale;
        }
        this.loadDictionary(locale, isDefault);
    }
    
    getLocale () {
        return this.currentLang;
    }
}