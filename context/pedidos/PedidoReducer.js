import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL } from '../../types';

export default (state, action) => {
    switch (action.type) {
        case SELECCIONAR_CLIENTE:
            return {
                ...state, //copia de los demas
                cliente: action.payload, // es lo que modifica el state
            };
        case SELECCIONAR_PRODUCTO:
            return {
                ...state, //copia de los demas
                productos: action.payload, // es lo que modifica el state
            };

        case CANTIDAD_PRODUCTOS:
            //console.log('CANTIDAD_PRODUCTOS reducer', state);
            return {
                ...state, //copia de los demas
                // validamos si el producto es diferente sino lo dejamos como esta
                productos: state.productos.map((producto) => (producto.id === action.payload.id ? (producto = action.payload) : producto)), // es lo que modifica el state
            };
        case ACTUALIZAR_TOTAL:
            return {
                ...state,
                // usamos la funcion reduce para sumar los totales
                total: state.productos.reduce((nuevoTotal, articulo) => (nuevoTotal += articulo.precio * articulo.cantidad), 0),
            };

        default:
            return state;
    }
};
