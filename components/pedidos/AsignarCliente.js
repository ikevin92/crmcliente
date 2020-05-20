import React, { useState, useEffect, useContext } from 'react';
// importamos select
import Select from 'react-select';
// importamos apollo
import { gql, useQuery } from '@apollo/client';
// importamos el context
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarCliente = () => {
    // state local del componente
    const [cliente, setCliente] = useState([]);

    // context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;
    console.log(pedidoContext);

    // CONSULTAR LA BD
    const { loading, error, data } = useQuery(OBTENER_CLIENTES_USUARIO);

    console.log(data);
    console.log(loading);
    console.log(error);

    // funcion para pasar al pedidostate.js
    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    // funcion onchange
    const seleccionarCliente = (clientes) => {
        setCliente(clientes);
    };

    // RESULTADOS DE LA CONSULTA
    if (loading) return null;

    const { obtenerClientesVendedor } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                1.-Asigna un cliente al pedido
            </p>
            <Select
                className="mt-3"
                options={obtenerClientesVendedor}
                //isMulti
                onChange={(opcion) => seleccionarCliente(opcion)}
                getOptionLabel={(opciones) => opciones.nombre}
                getOptionValue={(opciones) => opciones.id}
                placeholder="Busque o seleccione el cliente"
                noOptionsMessage={() => 'no hay resultados'}
            />
        </>
    );
};

export default AsignarCliente;
