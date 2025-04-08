import {LANGUAGES} from "./languages.js";

export class LanguageManager {
    constructor() {
        this.currentLang = 'en';
    }

    setLanguage(lang) {
        this.currentLang = lang;
    }

    getText(key) {
        return LANGUAGES[this.currentLang][key];
    }
}