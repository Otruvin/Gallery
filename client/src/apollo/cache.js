import {InMemoryCache, makeVar} from "@apollo/client";

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                token() {
                    return token()
                },
                cartItems() {
                    return loginedUserId()
                },
                isAuthenticated() {
                    return isAuthenticated()
                }
            }
        }
    }
})

export const isAuthenticated = makeVar(!!localStorage.getItem('token'))
export const token = makeVar(localStorage.getItem('token'))
export const loginedUserId = makeVar(localStorage.getItem('user'))