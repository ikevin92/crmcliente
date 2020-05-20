import React, { useState } from 'react';
// importamos para redirigir
import { useRouter } from 'next/router';
// componente
import Layout from '../components/Layout';
// importacion validaciones
import { useFormik } from 'formik';
import * as Yup from 'yup';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
//import gql from 'graphql-tag';
//import { useMutation } from '@apollo/react-hooks';

// TRAEMOS LA CONSULTA DE PLAYGROUND
const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;

const NuevaCuenta = () => {
    // State para un mensaje
    const [mensaje, guardarMensaje] = useState(null);

    // Mutation para crear nuevo usuario
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

    // Routing
    const router = useRouter();

    // validacion de formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        // validamos con yup
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('el email no es valido').required('El apellido es obligatorio'),
            password: Yup.string().required('el password no puede ir vacio').min(6, 'el password  debe contener minimo 6 caracteres'),
        }),
        // LE PASAMOS LOS DATOS

        onSubmit: async (valores) => {
            //console.log('enviando');
            //console.log(valores);
            // extraemos los datos del formulario
            const { nombre, apellido, email, password } = valores;

            // le pasamos los datos al input
            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password,
                        },
                    },
                });
                console.log(data);

                // usuario creado correctamente
                guardarMensaje(`Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}`);
                // quitamos el mensaje despues de 3 segundos
                setTimeout(() => {
                    guardarMensaje(null);
                    // redirigimos
                    router.push('/login');
                }, 3000);

                // redirigir al usuario para iniciar sesion
            } catch (error) {
                // reemplazamos la cadena de error del backend
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                // quitamos el mensaje despues de 3 segundos
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
                //console.log(error);
            }
        },
    });

    // HOOK PARA MOSTRAR MENSAJE DE ERROR
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        );
    };

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl text-white font-light">Nueva Cuenta</h1>

                {/*  mostramos el mensaje de error   */}
                {mensaje && mostrarMensaje()}

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Usuario"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
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
                                    placeholder="Apellido Usuario"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
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
                                    placeholder="Email Usuario"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.email && formik.errors.email ? (
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password Usuario"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.password && formik.errors.password ? (
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null}

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Crear Cuenta"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default NuevaCuenta;
