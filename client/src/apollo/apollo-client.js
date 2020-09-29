import {ApolloClient} from "@apollo/client";
import {cache} from "./cache";

const apolloClient = new ApolloClient({
    uri: 'http://localhost:5000/data',
    cache: cache
});

export default apolloClient