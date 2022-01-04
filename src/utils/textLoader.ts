import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import {IText} from "../../api/models/text";

class TextLoader {
    language: 'EN' | 'DE' | 'NL'
    text: Promise<IText[] | undefined>

    constructor() {
        const allowed = ['EN', 'DE', 'NL']
        const userLanguage = <'EN' | 'DE' | 'NL'>navigator.language.slice(0, 2).toUpperCase()
        if (allowed.includes(userLanguage))
            this.language = userLanguage
        else
            this.language = 'EN'

        this.text = this.loadText();
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

    async getContent(id: number) {
        const text = await this.text
        if (!text)
            return ''

        let myText = text.find(e => e._id === id)
        if (myText) {
            if (myText[this.language])
                return myText[this.language]
            if (myText["EN"])
                return myText["EN"]
        }

        return `Loading...`
    }
}

