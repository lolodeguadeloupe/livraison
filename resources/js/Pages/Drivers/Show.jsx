import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Show({ auth, driver, orders }) {
    return (
        <MainLayout
            user={auth.user}
            header={`Détails du chauffeur - ${driver.user.name}`}
        >
            <Head title={`Chauffeur - ${driver.user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Informations du chauffeur */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Informations du chauffeur</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Nom</p>
                                        <p className="font-semibold">{driver.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Email</p>
                                        <p className="font-semibold">{driver.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Type de véhicule</p>
                                        <p className="font-semibold capitalize">{driver.vehicle_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Numéro du véhicule</p>
                                        <p className="font-semibold">{driver.vehicle_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Numéro de permis</p>
                                        <p className="font-semibold">{driver.license_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Statut</p>
                                        <span className={`px-2 py-1 rounded-full text-sm ${driver.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {driver.is_available ? 'Disponible' : 'Indisponible'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dernières commandes */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Dernières commandes</h2>
                                {orders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        N° Commande
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Restaurant
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Client
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Statut
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link
                                                                href={route('orders.show', order.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                #{order.id}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {order.restaurant.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {order.user.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                                order.status === 'delivered'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : order.status === 'in_progress'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Aucune commande pour le moment.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
