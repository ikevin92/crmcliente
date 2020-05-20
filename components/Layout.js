import React from 'react';
// componente para ingresar algo en el head
import Head from 'next/head';
// importamos sidebar
import Sidebar from '../components/Sidebar';
// DETECTAR LA RUTA
import { useRouter } from 'next/router';
import Header from './Header';

const Layout = ({ children }) => {
    // routing de next (nos detecta la ruta)
    const router = useRouter();

    return (
        <>
            <Head>
                <title>CRM - Administracion de Clientes </title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
                    integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
                    crossorigin="anonymous"
                />
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
            </Head>

            {/* VALIDAMOS LAS RUTAS QUE NO MUESTRAN EL SIDEBAR  */}
            {router.pathname === '/login' || router.pathname === '/nuevacuenta' ? (
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                    <div>{children}</div>
                </div>
            ) : (
                <div className="bg-gray-200 min-h-screen">
                    <div className="sm:flex min-h-screen">
                        <Sidebar />

                        <main className="sm:w-2/3 xl:w-4/5 sm: min-h-screen p-5">
                            <Header/>
                            {children}
                        </main>
                    </div>
                </div>
            )}
        </>
    );
};

export default Layout;
