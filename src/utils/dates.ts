import {IArticle} from "../../api/models/article";

export function sortArticles(a: IArticle, b: IArticle): number {
    let n = 0
    try {
        n = new Date(b.created).getTime() - new Date(a.created).getTime()
    } catch (e) {
        console.warn("Problem while sorting articles. Expect limited experience: " + e)
    }
    return n
}