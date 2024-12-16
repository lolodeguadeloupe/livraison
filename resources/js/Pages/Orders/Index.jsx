import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ auth, orders }) {
    const [statusFilter, setStatusFilter] = useState('all');
    
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-purple-100 text-purple-800',
            delivering: 'bg-orange-100 text-orange-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'En attente',
            preparing: 'En préparation',
            ready: 'Prêt',
            delivering: 'En livraison',
            delivered: 'Livré',
            cancelled: 'Annulé'
        };
        return labels[status] || status;
    };

    return (
        <MainLayout
            user={auth.user}
            header="Gestion des Commandes"
        >
            <Head title="Commandes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            <select
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="preparing">En préparation</option>
                                <option value="ready">Prêt</option>
                                <option value="delivering">En livraison</option>
                                <option value="delivered">Livré</option>
                                <option value="cancelled">Annulé</option>
                            </select>
                        </div>
                        
                        <Link
                            href={route('orders.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Nouvelle Commande
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
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
                                                Chauffeur
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
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
                                                    {order.driver 
                                                        ? order.driver.user.name
                                                        : <span className="text-gray-400">Non assigné</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    }).format(order.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(order.created_at), 'PPp', { locale: fr })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('orders.show', order.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Voir
                                                        </Link>
                                                        {order.status === 'pending' && (
                                                            <Link
                                                                href={route('orders.edit', order.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Modifier
                                                            </Link>
                                                        )}
                                                    </div>
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
