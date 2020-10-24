import React, {useState} from "react";
import '../Styles/AuthPageStyles.css'
import {useMutation} from "@apollo/client";
import {loader} from 'graphql.macro'
import {isAuthenticated, loginedUserId, token} from "../apollo/cache";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {useHistory} from 'react-router-dom'
import {Loader} from "../components/Loader";

export const AuthPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const loginMutation = loader('../graphql/loginUser.graphql')
    const [loginUser, {loading}] = useMutation(loginMutation)
    const history = useHistory()

    const loginHandler = async event => {
        event.preventDefault()
        try {
            const result = await loginUser({variables: {email, password}})
            localStorage.setItem('token', result.data.loginUser.token)
            localStorage.setItem('user', result.data.loginUser.user)
            token(result.data.loginUser.token)
            loginedUserId(result.data.loginUser.user)
            isAuthenticated(true)
            window.location.reload(false)

        } catch (e) {
            toast.error(e.message)
        }

    }

    const registerHandler = event => {
        history.push('/register')
    }

    return (
        <div className="container">
            <form className="formInput">
                <h1>Login</h1>
                <div className="inputs">
                    <input
                        type="text"
                        placeholder="Email"
                        id="username"
                        name="email"
                        value={email}
                        disabled={loading}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        value={password}
                        disabled={loading}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {
                    loading ?
                            <Loader /> :
                            <div className="buttons">
                                    <button className="loginButton" onClick={loginHandler}>Login</button>
                                    <button className="registerButton" onClick={registerHandler}>Register</button>
                            </div>
                }

            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}