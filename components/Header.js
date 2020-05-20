import React from 'react';
import { gql, useQuery } from '@apollo/client';
//import { useQuery } from '@apollo/react-hooks';
//import gql from 'graphql-tag';
// importamos para redirigir
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {
    // Routing
    const router = useRouter();

    // query apollo
    const { loading, error, data } = useQuery(OBTENER_USUARIO);

    console.log(data);
    console.log(loading);
    console.log(error);

    // proteger que no accedamos a data sin cargar
    if (loading) return null;

    //si no hay informacion
    if (!data) {
        router.push('/login');
    }

    // EXTRAMOS LOS DATOS
    const { nombre, apellido } = data.obtenerUsuario;

    // cerramos la sesion
    const cerrarSesion = () => {
        //eliminamos el token
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <h1 className="mr-2 mb-5 lg:mb-0">
                Hola: {nombre.toUpperCase()} {apellido.toUpperCase()}
            </h1>

            <button
                onClick={() => cerrarSesion()}
                type="button"
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
            >
                Cerrar Sesion
            </button>
        </div>
    );
};

export default Header;
