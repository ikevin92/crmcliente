import Head from 'next/head';
import Layout from '../components/Layout';
// importamos apollo
import { gql, useQuery } from '@apollo/client';
// importamos para redirigir
import { useRouter } from 'next/router';
// importamos link que reemplaza la etiqueta a
import Link from 'next/link';
import Producto from '../components/Producto';

//query
const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;

const Productos = () => {
    // Routing
    const router = useRouter();
    //consultar los productos
    const { loading, data, error } = useQuery(OBTENER_PRODUCTOS);

    console.log(loading);
    console.log(data);
    console.log(error);

    if (loading) return 'Cargando....';
    if (error) return `Error! ${error}`;

    return (
        <>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

                <Link href="/nuevoProducto">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white text-sm rounded hover:bg-gray-800 mb-3 uppercase">
                        Nuevo Producto
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-2">Nombre</th>
                            <th className="w-1/5 py-2">Existencia</th>
                            <th className="w-1/5 py-2">Precio</th>
                            <th className="w-1/5 py-2">Eliminar</th>
                            <th className="w-1/5 py-2">Editar</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {data.obtenerProductos.map((producto) => (
                            <Producto key={producto.id} producto={producto} />
                        ))}
                    </tbody>
                </table>
            </Layout>
        </>
    );
};

export default Productos;
