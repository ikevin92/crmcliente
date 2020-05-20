import React from 'react';
// componente
import Layout from '../components/Layout';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
// importacion validaciones
import { useFormik } from 'formik';
import * as Yup from 'yup';
// importamos para redirigir
import { useRouter } from 'next/router';
// alertas
import Swal from 'sweetalert2';

// MUTATION

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
        }
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

const NuevoProducto = () => {
    // routing
    const router = useRouter();

    // Mutation de apollo
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            //obtener objeto cache
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS,
            });

            // reescribir el objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto],
                },
            });
        },
    });

    // formulario para los productos
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            existencia: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('el nombre es obligatorio'),
            existencia: Yup.number()
                .required('la existencia es requerida')
                .positive('no se aceptan numeros negativos')
                .integer('debes ingresar numeros enteros'),
            precio: Yup.number().required('la existencia es requerida').positive('no se aceptan numeros negativos'),
        }),
        onSubmit: async (valores) => {
            console.log(valores);

            const { nombre, existencia, precio } = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            precio,
                            existencia,
                        },
                    },
                });

                console.log(data);
                // mostrar una alerta
                Swal.fire('Producto Creado!', `Se creo el producto: ${nombre} correctamente`, 'success');

                // redireccionamos
                router.push('/productos');
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear nuevo Producto</h1>

            <div className="flex justify-center  mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre Producto"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                Existencia
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="existencia"
                                type="number"
                                placeholder="Cantidad de Existencias"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.existencia}
                            />
                        </div>
                        {formik.touched.existencia && formik.errors.existencia ? (
                            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.existencia}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                Precio
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="Precio"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precio}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Agregar Nuevo Producto"
                        />
                    </form>
                </div>
            </div>
        
        
        </Layout>
    );
};

export default NuevoProducto;
