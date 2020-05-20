// ESTA CLASE LA SOBREESCRIBIMOS PARA CONFIGURAR APOLLO
import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
// importamos el pedido state para el control de los reducer
import PedidoState from '../context/pedidos/PedidoState';

const MyApp = ({ Component, pageProps }) => {
    return (
        <ApolloProvider client={client}>
            <PedidoState>
                <Component {...pageProps} />
            </PedidoState>
        </ApolloProvider>
    );
};

export default MyApp;
