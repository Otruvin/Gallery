import React, {useState} from "react";
import questionMark from '../StaticSrc/questionMark.png'
import '../Styles/RegistrationStyles.css'
import {useMutation} from "@apollo/client";
import {loader} from "graphql.macro";
import {toast, ToastContainer} from "react-toastify";
import {useHistory} from 'react-router-dom'
import {Loader} from "../components/Loader";

export const RegisterPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [commitPassword, setCommitPassword] = useState('')
    const [username, setUsername] = useState('')
    const registrationMutation = loader('../graphql/registrationUser.graphql')
    const [registrationUser, {loading}] = useMutation(registrationMutation)
    const history = useHistory()

    const registrationHandler = async event => {
        event.preventDefault()
        try {
            if (password !== commitPassword) {
                toast.warn('You need to confirm password')
            }
            const result = await registrationUser({variables: {name: username, email, password}})
            toast.success(`User ${result.data.registerUser.name} registered`)
            history.push('/')
        } catch (e) {
            toast.warn(e.message)
        }

    }

    return (
        <div className="container">
            <div className="formInput">
                <h1>Registration</h1>
                <div className="inputs">
                    <div className="inputDiv">
                        <input
                            type="text"
                            placeholder="Enter your Email"
                            id="email"
                            name="email"
                            value={email}
                            disabled={loading}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <img className="questionMarkImage" src={questionMark} alt="questionMark" />
                        <span className="tooltipeText">Enter your valid Email</span>
                    </div>
                    <br />
                    <div className="inputDiv">
                        <input
                            type="text"
                            placeholder="Enter your Username"
                            id="username"
                            name="username"
                            value={username}
                            disabled={loading}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <img className="questionMarkImage" src={questionMark} alt="questionMark" />
                        <span className="tooltipeText">Your name will appear on your posts and comments</span>
                    </div>
                    <br />
                    <div className="inputDiv">
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            id="password"
                            name="password"
                            value={password}
                            disabled={loading}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <img className="questionMarkImage" src={questionMark} alt="questionMark" />
                        <span className="tooltipeText">Password need to have 8 - 20 symbols length, without spaces</span>
                    </div>
                    <div className="inputDiv">
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            id="commitPassword"
                            name="commitPassword"
                            value={commitPassword}
                            disabled={loading}
                            onChange={e => setCommitPassword(e.target.value)}
                        />
                        <img className="questionMarkImage" src={questionMark} alt="questionMark" />
                        <span className="tooltipeText">You need to repeat entered password to confirm your registration</span>
                    </div>
                    <br />
                    {
                        loading ?
                            <Loader /> :
                            <button onClick={registrationHandler}>Registration new user</button>
                    }
                </div>
            </div>
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