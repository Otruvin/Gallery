import React, {useEffect} from "react";
import {CardArticle} from "./CardArticle";
import '../Styles/ArticlesList.css'
import {articlesGallery, cursorPagination} from "../apollo/cache";
import {loader} from "graphql.macro";
import {useLazyQuery, useQuery} from "@apollo/client";
import {Loader} from "./Loader";


export const ListArticles = ( { startQuery, limitLoad, loadMoreQuery } ) => {

    const {data, error, loading, fetchMore} = useQuery(startQuery, {
        variables: {
            limit: limitLoad
        }
    })

    return (
        <div className="listArticles">
            {
                loading ?
                    <Loader /> :
                    data.articles.map((article, index) => {
                        return (
                            <CardArticle
                                key={index}
                                theme={article.theme}
                                createdAt={article.createdAt}
                                author={article.author}
                                image={article.image}
                            />
                        )
                    })
            }
            <button className="loadMoreButton" onClick={() => {
                if (data) {
                    const cursorTemp = data.articles[data.articles.length - 1].id;
                    fetchMore({
                        query: loadMoreQuery,
                        variables: {
                            cursor: cursorTemp,
                            interval: 5
                        },
                        updateQuery: (prevResult, {fetchMoreResult}) => {
                            return {
                                articles: [...prevResult.articles, ...fetchMoreResult.articlesByCursor]
                            }
                        }
                    })
                }
            }}>Load more ...</button>
        </div>
    )
}












// const getArticles = loader('../graphql/getArticlesFromCursor.graphql')
// const [loadMoreArticles, {loading, data}] = useLazyQuery(getArticles, {
//     variables: {
//         cursor: cursorPagination(),
//         interval: 5
//     }
// })
//
// useEffect(() => {
//     if (data) {
//         const articles = articlesGallery()
//         if (data.articlesByCursor.length > 0) {
//             articlesGallery([...articles, ...data.articlesByCursor])
//             cursorPagination(data.articlesByCursor[data.articlesByCursor.length - 1].id)
//             console.log(articlesGallery())
//         }
//     }
// }, [data])
//
// useEffect(() => {
//     articlesGallery(articles)
//     cursorPagination(articles[articles.length - 1].id)
//     console.log("123")
// }, [articles])
//
// return (
//     <div className="listArticles">
//         {
//             articlesGallery().length > 0 ?
//                 articlesGallery().map((article, index) => {
//                     return (
//                         <CardArticle
//                             key={index}
//                             theme={article.theme}
//                             createdAt={article.createdAt}
//                             author={article.author}
//                             image={article.image}
//                             loading={loading}
//                         />
//                     )
//                 }) :
//                 articles.map((article, index) => {
//                     return (
//                         <CardArticle
//                             key={index}
//                             theme={article.theme}
//                             createdAt={article.createdAt}
//                             author={article.author}
//                             image={article.image}
//                             loading={loading}
//                         />
//                     )
//                 })
//         }
//         {
//             loading ?
//                 <Loader /> :
//                 <button className="loadMoreButton" onClick={() => {
//                     loadMoreArticles()
//                 }}>Load more ...</button>
//         }
//     </div>
// )
// }