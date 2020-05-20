import React, { useContext, useState } from 'react';
// COMPONENTS
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
// context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';
// importamos para redirigir
import { useRouter } from 'next/router';
// alertas
import Swal from 'sweetalert2';

// COMANDO GQL
const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

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

const NuevoPedido = () => {
    // routing
    const router = useRouter();

    // state para mensaje
    const [mensaje, setMensaje] = useState(null);

    // utilizar context y establecer sus valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    // mutation para crear un nuevo pedido
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
                },
            });
        },
    });

    const validarPedido = () => {
        // validamos que tenga productos y poder activar el boton
        return !productos.every((producto) => producto.cantidad > 0) || total === 0 || cliente.length === 0
            ? ' opacity-50 cursor-not-allowed'
            : '';
    };

    // FUNCION PARA CREAR
    const crearNuevoPedido = async () => {
        // extraemos el id  del cliente
        const { id } = cliente;
        // remover lo no deseado de los productos (pedido)
        const pedido = productos.map(({ __typename, existencia, ...producto }) => producto);
        //console.log('PEDIDO:', pedido);

        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido,
                    },
                },
            });
            //console.log(data);

            //redireccionar
            router.push('/pedidos');

            //mostrar alerta
            Swal.fire('Correcto', 'El pedido se registro correctamente', 'success');
        } catch (error) {
            //console.error(error);
            setMensaje(error.message.replace('GraphQl error: ', ''));

            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }
    };

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full ,y-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo pedido</h1>

            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido />
                    <Total />
                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                        onClick={() => crearNuevoPedido()}
                    >
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default NuevoPedido;
