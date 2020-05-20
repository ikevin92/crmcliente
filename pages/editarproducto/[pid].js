import React from 'react';
import { useRouter } from 'next/router';
// componentes
import Layout from '../../components/Layout';
// importamos apollo
import { gql, useQuery, useMutation } from '@apollo/client';
// fomirk component
import { Formik } from 'formik';
import * as Yup from 'yup';
// alerta
import Swal from 'sweetalert2';

// query
const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {
    const router = useRouter();
    const {
        query: { id },
    } = router;
    //console.log(id);

    //consultar para obtener el producto
    const { loading, data, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id,
        },
    });

    //mutation
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    // schema de validacion
    const schemaValidation = Yup.object({
        nombre: Yup.string().required('el nombre es obligatorio'),
        existencia: Yup.number()
            .required('la existencia es requerida')
            .positive('no se aceptan numeros negativos')
            .integer('debes ingresar numeros enteros'),
        precio: Yup.number().required('la existencia es requerida').positive('no se aceptan numeros negativos'),
    });

    // condicional mientras carga
    if (loading) return 'cargando...';

    if (!data) {
        //return router.push('/productos');
        return 'accion no permitida'
    }

    // FUNCION PARA ACTUALIZAR
    const actualizarInfoProducto = async (valores) => {
        //console.log(valores);
        const { nombre, precio, existencia } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        precio,
                        existencia,
                    },
                },
            });
            console.log(data);
            // SWEET ALERT
            //mostrar una alerta
            Swal.fire('Correcto!', 'el producto se actualizo correctamente', 'success');
            // REDIRECCIONAR
            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    };

    const { obtenerProducto } = data;

    // console.log(data);
    // console.log(loading);
    // console.log(error);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            <div className="flex justify-center  mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={obtenerProducto}
                        onSubmit={(valores) => {
                            console.log('submit formik');
                            console.log(valores);
                            //console.log(funciones);
                            //le pasamos al funcion
                            actualizarInfoProducto(valores);
                        }}
                    >
                        {(props) => {
                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre Producto"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.existencia}
                                        />
                                    </div>

                                    {props.touched.existencia && props.errors.existencia ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.existencia}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.precio}
                                        />
                                    </div>

                                    {props.touched.precio && props.errors.precio ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Actualizar Producto"
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default EditarProducto;
