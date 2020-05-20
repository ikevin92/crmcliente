import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';
// IMPORTAMOS LOS TYPES
import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL } from '../../types';

const PedidoState = ({ children }) => {
    //State de pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0,
    };

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    // modifica el cliente seleccionado en el pedido
    const agregarCliente = (cliente) => {
        //console.log(cliente);

        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente,
        });
    };

    // modifica los productos
    const agregarProducto = (productosSeleccionados) => {
        //console.log('agregarProducto: ', productosSeleccionados);

        let nuevoState;

        // unimos los objetos
        if (state.productos.length > 0) {
            //console.log('largo productos del state agregar productos ', state.productos);
            //tomar del segundo arreglo una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map((producto) => {
                const nuevoObjeto = state.productos.find((productoState) => productoState.id === producto.id);
                //console.log('PedidoState if productoState.id: ', productoState.id);
                //console.log("PedidoState if nuevo Objeto: ", nuevoObjeto)
                //console.log('PedidoState if producto: ', producto);
                // retornamos el cambio
                return { ...producto, ...nuevoObjeto };
            });
        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState,
        });
    };

    //modifica las cantidades de los productos
    const cantidadProductos = (nuevoProducto) => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto,
        });
    };

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL,
        });
    };

    return (
        <PedidoContext.Provider
            value={{
                // agregamos los productos al state
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal,
            }}
        >
            {children}
        </PedidoContext.Provider>
    );
};

export default PedidoState;
