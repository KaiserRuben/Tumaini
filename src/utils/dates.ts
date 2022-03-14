import {IArticle} from "../../api/models/article";

export function sortArticles(a: IArticle, b: IArticle): number {
    return (new Date(b.created).getDate()) - (new Date(a.created).getDate())
}