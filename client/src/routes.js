import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {GalleryPage} from "./pages/GalleryPage";
import {CreateArticle} from "./pages/CreateArticle";
import {ArticlePage} from "./pages/ArticlePage";
import {AuthPage} from "./pages/AuthPage";
import {RegisterPage} from "./pages/RegisterPage";
import {Header} from "./components/Header";
import {FavoritePage} from "./pages/FavoritePage";

export const useRoutes = isAuthenticated => {
    if(isAuthenticated) {
        return (
            <Switch>
                <Route path="/gallery" exact>
                    <Header />
                    <GalleryPage />
                </Route>
                <Route path="/create" exact>
                    <Header />
                    <CreateArticle />
                </Route>
                <Route path="/article/:id">
                    <Header />
                    <ArticlePage />
                </Route>
                <Route path="/favorites">
                    <Header />
                    <FavoritePage />
                </Route>
                <Redirect to="/gallery"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Route path="/register">
                <RegisterPage />
            </Route>
            <Redirect to="/"/>
        </Switch>
    )
}