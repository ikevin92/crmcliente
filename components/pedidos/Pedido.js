import React, { useState, useEffect } from 'react';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
//import Swal from '@sweetalert2/themes'
import Swal from 'sweetalert2';

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`;

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input) {
            estado
            id
        }
    }
`;

// LA USAMOS PARA ACTUALIZAR CACHE
const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
        }
    }
`;

const Pedido = ({ pedido }) => {
    // extraemos la informacion de pedido
    const {
        id,
        total,
        cliente: { nombre, apellido, telefono, email },
        estado,
        cliente,
    } = pedido;

    // mutation para cambiar el estado del pedido
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {        
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter((pedido) => pedido.id !== id),
                },
            });
        },
    });

    //state estado pedido
    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    //use Effect para cambiar el estado del pedido
    useEffect(() => {
        if (estadoPedido) {
            setEstadoPedido(estadoPedido);
        }
        clasePedido();
    }, [estadoPedido]);

    // funcion para modificar el color del estado
    const clasePedido = () => {
        if (estadoPedido === 'PENDIENTE') {
            setClase('border-yellow-500');
        } else if (estadoPedido === 'COMPLETADO') {
            setClase('border-green-500');
        } else if (estadoPedido === 'CANCELADO') {
            setClase('border-red-800');
        }
    };

    //funcion para cambio de estado
    const cambiarEstadoPedido = async (nuevoEstado) => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: nuevoEstado,
                        cliente: cliente.id,
                    },
                },
            });

            setEstadoPedido(data.actualizarPedido.estado);

            //console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    // FUNCION PARA ELIMINAR PEDIDO
    const confirmarEliminarPedido = async () => {
        Swal.fire({
            title: 'Deseas eliminar a este Pedido?',
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
                    const { data } = await eliminarPedido({
                        variables: {
                            id,
                        },
                    });

                    console.log(data);

                    //mostrar una alerta
                    Swal.fire('Eliminado!', data.eliminarPedido, 'success');
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    return (
        <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">
                    Cliente: {nombre} {apellido}
                </p>
                {email && (
                    <p className="flex items-center my-2">
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 mr-2">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>

                        {email}
                    </p>
                )}
                {telefono && (
                    <p className="flex items-center my-2">
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 mr-2">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>

                        {telefono}
                    </p>
                )}
                <h2 className="text-gay-800 font-bold mt-10">Estado Pedido: </h2>
                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:boder-blue-500 uppercase text-xs font-bold"
                    value={estadoPedido}
                    onChange={(e) => cambiarEstadoPedido(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
                {pedido.pedido.map((articulo) => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {articulo.nombre} </p>
                        <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}

                <p className="text-gray-800 mt-3 font-bold">
                    Total a pagar:
                    <span className="font-light"> $ {total}</span>
                </p>
                <button
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"
                    onClick={() => confirmarEliminarPedido()}
                >
                    Eliminar Pedido
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                        <path
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pedido;
