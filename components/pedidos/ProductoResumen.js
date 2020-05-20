import React, { useContext, useState, useEffect } from 'react';
// importamos el context
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({ producto }) => {
    //console.log('producto inicial ProductoResumen: ', producto);

    // context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { cantidadProductos, actualizarTotal } = pedidoContext;
    //console.log(actualizarTotal)

    //state de cantidades
    const [cantidad, setCantidad] = useState(0);

    // hook que hace la accion cuando se ejecuta (cuando se cambia la cantidad)
    useEffect(() => {
        //console.log(cantidad)
        actualizarCantidad();
        actualizarTotal();
    }, [cantidad]);

    // actualiza la cantidad en el state
    const actualizarCantidad = () => {
        const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
        cantidadProductos(nuevoProducto);
        //console.log('actualizarCantidad ProdcutoResumen: ', nuevoProducto.cantidad);
    };

    //extraemos los atributos de producto
    const { nombre, precio } = producto;

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{nombre}</p>
                <p>$ {precio}</p>
            </div>
            <input
                type="number"
                placeholder="Cantidad"
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
                onChange={(e) => setCantidad(e.target.value)}
                value={cantidad}
            />
        </div>
    );
};

export default ProductoResumen;
