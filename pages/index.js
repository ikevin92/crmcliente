import Head from 'next/head';
// importamos componente
import Layout from '../components/Layout';
// importamos apollo
import { gql, useQuery } from '@apollo/client';
// importamos para redirigir
import { useRouter } from 'next/router';
// importamos link que reemplaza la etiqueta a
import Link from 'next/link';
import Cliente from '../components/Cliente';

// pasamos la consulta graphql
const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
        obtenerClientesVendedor {
            id
            nombre
            apellido
            empresa
            email
        }
    }
`;

const Index = () => {
    // Routing
    const router = useRouter();

    // consulta de apollo
    const { loading, error, data } = useQuery(OBTENER_CLIENTES_USUARIO);

    console.log(data);
    console.log(loading);
    console.log(error);

    // proteger que no accedamos a data sin cargar
    //if (loading) return 'Cargando...';
    if (loading) return null;
    if (error) return `Error! ${error}`;

    //si no hay informacion
    if (!data.obtenerClientesVendedor) {
        return router.push('/login');
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
                <Link href="/nuevocliente">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white text-sm rounded hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                        Nuevo Cliente
                    </a>
                </Link>

                <div className="overflow-x-scroll">
                    <table className="table-auto shadow-md mt-10 w-full w-lg">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2">Nombre</th>
                                <th className="w-1/5 py-2">Empresa</th>
                                <th className="w-1/5 py-2">Email</th>
                                <th className="w-1/5 py-2">Eliminar</th>
                                <th className="w-1/5 py-2">Editar</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {data.obtenerClientesVendedor.map((cliente) => (
                                <Cliente key={cliente.id} cliente={cliente} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
    );
};

export default Index;
