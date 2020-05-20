import React, { useEffect } from 'react';
// COMPONENTS
import Layout from '../components/Layout';
//RECHARTS
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
// importamos apollo
import { gql, useQuery } from '@apollo/client';


const MEJORES_CLIENTES = gql`
    query mejoresClientes {
        mejoresClientes {
            cliente {
                nombre
                email
            }
            total
        }
    }
`;

const MejoresClientes = () => {
    // agregamos funcionalidad de tiempo real
    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (loading) return 'cargando..';
    console.log(data.mejoresClientes);

    const { mejoresClientes } = data;

    // declaramos el array al que le vamos a pasar los datos
    const clienteGrafica = [];

    // creamos un objeto plano para pasarle a la grafica
    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total,
        };
    });

    console.log(clienteGrafica);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
            <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={clienteGrafica}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
};

export default MejoresClientes;
