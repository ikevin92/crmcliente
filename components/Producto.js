import React from 'react';
//import Swal from '@sweetalert2/themes'
import Swal from 'sweetalert2';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
// importamos para redirigir
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
    }
`;

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


const Producto = ({ producto }) => {
    //extraemos las variables
    const { nombre, existencia, precio, id } = producto;

    // mutation para eliminar producto
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS,
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter((productoActual) => productoActual.id !== id),
                },
            });
        },
    });

    // eliminar producto
    const confirmarEliminarProducto = () => {
        console.log('eliminando: ', id);

        Swal.fire({
            title: 'Deseas eliminar a este producto?',
            text: 'Esta accion no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar',
        }).then(async (result) => {
            if (result.value) {
                try {
                    // eliminar por id
                    const { data } = await eliminarProducto({
                        variables: {
                            id,
                        },
                    });

                    console.log(data);

                    //mostrar una alerta
                    Swal.fire('Producto Eliminado!', data.eliminarProducto, 'success');
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    // editarProducto
    const editarProducto = () => {
        console.log('A EDITAR PRODUCTO')
        Router.push({
            pathname: '/editarproducto/[id]',
            query: {id}

        })
    };

    return (
        <tr>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{existencia} UNDS</td>
            <td className="border px-4 py-2">{precio}</td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => confirmarEliminarProducto()}
                >
                    Eliminar
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                        <path
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={() => editarProducto()}
                >
                    Editar
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                        <path
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default Producto;
