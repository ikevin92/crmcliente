import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
// importamos apollo
import { gql, useMutation, useQuery } from '@apollo/client';
import Pedido from '../components/pedidos/Pedido';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`;

const Pedidos = () => {
    //consulta
    const { loading, error, data } = useQuery(OBTENER_PEDIDOS);

    if (loading) return 'cargando...';

    const { obtenerPedidosVendedor } = data;

    console.log(loading);
    console.log(data);
    console.log(error);

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>

                <Link href="/nuevopedido">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white text-sm rounded hover:bg-gray-800 mb-3 uppercase">
                        Nuevo Pedido
                    </a>
                </Link>

                {obtenerPedidosVendedor.length === 0 ? (
                    <p className="mt-5 text-center text-2xl">No hay pedidos aun</p>
                ) : (
                    obtenerPedidosVendedor.map((pedido) => <Pedido key={pedido.id} pedido={pedido} />)
                )}
            </Layout>
        </div>
    );
};

export default Pedidos;
