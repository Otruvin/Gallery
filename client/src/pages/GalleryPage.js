import React from "react";
import '../Styles/GalleryPageStyles.css'
import {loader} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Loader} from "../components/Loader";
import {ListArticles} from "../components/ListArticles";

export const GalleryPage = () => {

    const getArticles = loader('../graphql/getArticles.graphql')
    const loadMoreArticles = loader('../graphql/getArticlesFromCursor.graphql')
    // const { data, loading } = useQuery(getArticles, {
    //     variables: {
    //         limit: 5
    //     }
    // })

    return (
        <div className="container">
            {
                <ListArticles
                    startQuery={getArticles}
                    loadMoreQuery={loadMoreArticles}
                    limitLoad={5}
                />
            }
        </div>
    )
}