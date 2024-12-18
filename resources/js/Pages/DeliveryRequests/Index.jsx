import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DeliveryRequestsIndex({ auth, deliveryRequests }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            assigned: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'En attente',
            assigned: 'Assigné',
            completed: 'Terminé',
            cancelled: 'Annulé'
        };
        return texts[status] || status;
    };

    return (
        <MainLayout
            user={auth.user}
            header="Demandes de livraison"
        >
            <Head title="Demandes de livraison" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-xl font-semibold text-gray-900">Demandes de livraison</h1>
                                    <p className="mt-2 text-sm text-gray-700">
                                        Liste de toutes les demandes de livraison
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Restaurant</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Commande</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Frais de livraison</th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Créée le</th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {deliveryRequests.map((request) => (
                                            <tr key={request.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {request.restaurant.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    #{request.order.id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(request.status)}`}>
                                                        {getStatusText(request.status)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {request.delivery_fee}€
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {format(new Date(request.created_at), 'Pp', { locale: fr })}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        href={route('delivery-requests.show', request.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Voir<span className="sr-only">, demande #{request.id}</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
