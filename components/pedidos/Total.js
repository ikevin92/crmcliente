import React, { useContext } from 'react';
// importamos el context
import PedidoContext from '../../context/pedidos/PedidoContext';

const Total = () => {
    // context de pedidos y agregamos los productos
    const pedidoContext = useContext(PedidoContext);
    const { total } = pedidoContext;
    
    return (
        <div className="flex items-center mt-5 justify-between bg-white p-3 ">
            <h2 className="text-gray-800 text-lg">Total a Pagar: </h2>
            <p className="text-gray-800 mt-0">$ {total}</p>
        </div>
    );
};

export default Total;
