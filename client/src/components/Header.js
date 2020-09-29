import React, {useCallback} from "react";
import '../Styles/HeaderStyles.css'
import {useApolloClient} from "@apollo/client";
import {isAuthenticated} from "../apollo/cache";
import {useHistory} from 'react-router-dom'

export const Header = () => {

    const client = useApolloClient()
    const history = useHistory()

    const logOutHandler = useCallback(event => {
        event.preventDefault()
        client.cache.evict({fieldName: 'me'})
        client.cache.gc()
        localStorage.clear()
        isAuthenticated(false)
        window.location.reload(false)
    }, [client])

    const goMain = event => {
        history.push('/gallery')
    }

    const goCreate = event => {
        history.push('/create')
    }

    const goFavorites = event => {
        history.push('/favorites')
    }

    return (
        <div className="header">
            <div className="headerContent">
                <h1 className="logoMain">GalleryZIGM</h1>
                <div className="headerButtons">
                    <button
                        className="headerButton mainButton"
                        id="mainButton"
                        onClick={goMain}
                    >MAIN</button>
                    <button
                        className="headerButton createButton"
                        id="createButton"
                        onClick={goCreate}
                    >CREATE</button>
                    <button
                        className="headerButton favoritesButton"
                        id="favoritesButton"
                        onClick={goFavorites}
                    >FAVORITES</button>
                    <button
                        className="headerButton logoutButton"
                        id="logoutButton"
                        onClick={logOutHandler}
                    >LOGOUT</button>
                </div>
            </div>
        </div>
    )
}