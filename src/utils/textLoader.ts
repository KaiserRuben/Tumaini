import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import {IText} from "../../api/models/text";

export class TextLoader {
    public language: 'EN' | 'DE' | 'NL'
    text: Promise<IText[] | undefined>

    constructor() {
        const allowed = ['EN', 'DE', 'NL']
        const localLanguage = localStorage.getItem('language')
        const userLanguage = localLanguage ?
            <'EN' | 'DE' | 'NL'>localLanguage :
            <'EN' | 'DE' | 'NL'>navigator.language.slice(0, 2).toUpperCase()
        if (allowed.includes(userLanguage))
            this.language = userLanguage
        else
            this.language = 'EN'

        this.text = this.loadText();
        document.body.lang = this.language
    }

    private loadText(): Promise<IText[] | undefined> {
        return axiosGet('/text')
            .then((response) => {
                return response.data;
            })
            .catch(function (error) {
                console.warn('Houston, we have a problem. Text was not loaded!\n' + JSON.stringify(error));
                return undefined
            });
    }

    async getContent(id: string): Promise<string> {
        const text = await this.text
        if (!text)
            return ''

        const myText = text.find(e => e._id === id)
        if (myText) {
            if (myText[this.language])
                return <string>myText[this.language]
            if (myText["EN"])
                return myText["EN"]
            if (myText["DE"])
                return myText["DE"]
        }

        return `Loading...`
    }

    public reloadText() {
        this.text = this.loadText();
    }

    public setLanguage(language: 'EN' | 'DE' | 'NL') {
        this.language = language
        localStorage.setItem('language', language)
        this.reloadText()
    }
}

