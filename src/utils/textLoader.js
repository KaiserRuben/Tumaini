import { axiosGet } from "../../admin/src/utils/axiosWrapper";
export class TextLoader {
    constructor() {
        const allowed = ['EN', 'DE', 'NL'];
        const localLanguage = localStorage.getItem('language');
        const userLanguage = localLanguage ?
            localLanguage :
            navigator.language.slice(0, 2).toUpperCase();
        if (allowed.includes(userLanguage))
            this.language = userLanguage;
        else
            this.language = 'EN';
        this.text = this.loadText();
        document.body.lang = this.language;
    }
    loadText() {
        return axiosGet('/text')
            .then((response) => {
            return response.data;
        })
            .catch(function (error) {
            console.warn('Houston, we have a problem. Text was not loaded!\n' + JSON.stringify(error));
            return undefined;
        });
    }
    async getContent(id) {
        const text = await this.text;
        if (!text)
            return '';
        const myText = text.find(e => e._id === id);
        if (myText) {
            if (myText[this.language])
                return myText[this.language];
            if (myText["EN"])
                return myText["EN"];
            if (myText["DE"])
                return myText["DE"];
        }
        return `Loading...`;
    }
    reloadText() {
        this.text = this.loadText();
    }
    setLanguage(language) {
        this.language = language;
        localStorage.setItem('language', language);
        this.reloadText();
    }
}
