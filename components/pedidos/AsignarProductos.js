import React, { useState, useEffect, useContext } from 'react';
// importamos select
import Select from 'react-select';
// importamos apollo
import { gql, useQuery } from '@apollo/client';
// importamos el context
import PedidoContext from '../../context/pedidos/PedidoContext';

// CONSULTA PRODUCTOS
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

const AsignarProductos = () => {
    // state local del componente
    const [productos, setProductos] = useState([]);

    // context de pedidos y agregamos los productos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;
    //console.log(pedidoContext);

    // consulta a la base de datos
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
    // console.log(data)
    // console.log(loading)
    // console.log(error)

    useEffect(() => {
        // TODO: funcion para pasar a pedidostate.js
        agregarProducto(productos);
    }, [productos]);

    const seleccionarProducto = (producto) => {
        setProductos(producto);
    };

    if (loading) return null;
    const { obtenerProductos } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                2.- Selecciona o busca los productos
            </p>
            <Select
                className="mt-3"
                options={obtenerProductos}
                isMulti
                onChange={(opcion) => seleccionarProducto(opcion)}
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
                placeholder="Busque o seleccione el Producto"
                noOptionsMessage={() => 'no hay resultados'}
            />
        </>
    );
};

export default AsignarProductos;
