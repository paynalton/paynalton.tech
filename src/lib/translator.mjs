// src/utils/Translator.js
// No necesitas importar 'fs' aquí, ya que la lectura se hará externamente.

export default class Translator {
    defaultLang = 'en';
    currentLang = 'en';
    currentDictionary = null;
    defaultDictionary = null;

    // El constructor ahora recibe los diccionarios pre-cargados
    constructor(defaultLang = 'en', dictionaries = {}) {
        this.defaultLang = defaultLang;
        this.currentLang = defaultLang;

        // Asigna los diccionarios pasados al constructor
        this.defaultDictionary = dictionaries[defaultLang] || null;
        this.currentDictionary = dictionaries[defaultLang] || null;

        // Si tienes múltiples idiomas y quieres cambiar dinámicamente en el cliente
        // Tendrás que manejar un mapa de todos los diccionarios disponibles
        this.allDictionaries = dictionaries; // Guarda todos los diccionarios cargados
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

    // Método para cambiar el idioma si tienes varios diccionarios cargados
    setLocale(locale) {
        this.currentLang = locale;
        this.currentDictionary = this.allDictionaries[locale] || this.defaultDictionary;
    }

    getLocale() {
        return this.currentLang;
    }
}