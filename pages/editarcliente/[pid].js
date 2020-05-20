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
const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            email
            nombre
            apellido
            empresa
        }
    }
`;

//mutation
const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre
            email
        }
    }
`;

const EditarCliente = () => {
    //obtener id actual
    const router = useRouter();
    const {
        query: { id },
    } = router;
    //console.log(id);

    // consultar para obtener el cliente
    const { loading, data, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id,
        },
    });

    // actualizar el cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    // VALIDACIONES
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    if (loading) return 'cargando...';

    if (!data) {
        //return router.push('/productos');
        return 'accion no permitida';
    }
    console.log(loading);
    console.log(data.obtenerCliente);

    // Schema de validacion
    const schemaValidation = Yup.object({
        nombre: Yup.string().required('el nombre es obligatorio'),
        apellido: Yup.string().required('el apellido no puede ir vacio'),
        empresa: Yup.string().required('la empresa no puede ir vacio'),
        email: Yup.string().email('el email no es valido').required('el email no puede ir vacio'),
        //telefono: Yup.string().matches(phoneRegExp, 'Telefono no valido'),
    });

    // variable que le entregamos al props
    const { obtenerCliente } = data;

    // MODIFICA EL CLIENTE EN LA BD
    const actualizarInfoCliente = async (valores) => {
        console.log('ejecuto submit');
        console.log(valores);
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        empresa,
                        telefono,
                    },
                },
            });
            // SWEET ALERT
            //mostrar una alerta
            Swal.fire('Actualizado!', 'el cliente se actualizo correctamente', 'success');
            // REDIRECCIONAR
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

            <div className="flex justify-center  mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidation}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={(valores) => {
                            console.log('submit formik');
                            console.log(valores);
                            //console.log(funciones);
                            //le pasamos al funcion
                            actualizarInfoCliente(valores);
                        }}
                    >
                        {(props) => {
                            console.log(props);

                            // el return lo debemos de cerrar abajo
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
                                            placeholder="Nombre Cliente"
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="apellido"
                                            type="text"
                                            placeholder="Apellido Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                            Empresa
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="empresa"
                                            type="text"
                                            placeholder="Empresa Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="email"
                                            placeholder="Email Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                            Telefono
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Telefono Cliente"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />
                                    </div>
                                    {props.touched.telefono && props.errors.telefono ? (
                                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.telefono}</p>
                                        </div>
                                    ) : null}
                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Editar Cliente"
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

export default EditarCliente;
