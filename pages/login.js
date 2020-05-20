import React, { useState } from 'react';
// componente
import Layout from '../components/Layout';
// importacion validaciones
import { useFormik } from 'formik';
import * as Yup from 'yup';
// importamos apollo
import { gql, useMutation } from '@apollo/client';
//import { useMutation } from '@apollo/react-hooks';
//import { gql } from 'apollo-boost';

// importamos para redirigir
import { useRouter } from 'next/router';

// le pasamos el comando de playground
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {
    // State para un mensaje
    const [mensaje, guardarMensaje] = useState(null);

    // Routing
    const router = useRouter();

    // mutatio para autenticar nuevos usuarios
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    // validaciones
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('el email no es valido').required('el email no puede ir vacio'),
            password: Yup.string().required('el password no puede ir vacio'),
        }),
        onSubmit: async (valores) => {
            //console.log(valores);
            // extraemos los valores
            const { email, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password,
                        },
                    },
                });
                console.log(data);
                guardarMensaje('Autenticando....');

                // guardamos el token en local storage
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 1000);

                // redireccionar a clientes
                setTimeout(() => {
                    guardarMensaje(null);
                    // redirigimos
                    router.push('/');
                }, 2000);
            } catch (error) {
                console.log(error);
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
                {/*  mostramos el mensaje de error   */}
                {mensaje && mostrarMensaje()}

                <h1 className="text-center text-2xl text-white font-light">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
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
                                value="Iniciar Sesion"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Login;
