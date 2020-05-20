import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
// importamos para usar en la autorizacion del token
import { setContext } from 'apollo-link-context';

// tenemos la configuracion de hacia donde nos vamos a conectar
const httpLink = createHttpLink({
   // uri: 'http://localhost:4000/',
    uri: 'https://gentle-bayou-57771.herokuapp.com/',
    fetch,
});

// le damos un header nuevo
const authLink = setContext((_, { headers }) => {
    // leer el storage almacenado
    const token = localStorage.getItem('token');
    return {

        headers: {
            ...headers, //tomamos una copia
            authorization: token ? `Bearer ${token}` : ''
        },
    };
});

const client = new ApolloClient({
    connectToDevTools: true, // para usar la extension de apollo
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

export default client;
