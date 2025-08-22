import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon,
    TruckIcon,
    CogIcon,
    ExclamationCircleIcon
} from '@heroicons/react/solid';

export default function Index({ auth, orders }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const { post, processing } = useForm();
    
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    const getStatusIcon = (status) => {
        const icons = {
            pending: ClockIcon,
            preparing: CogIcon,
            ready: ExclamationCircleIcon,
            delivering: TruckIcon,
            delivered: CheckCircleIcon,
            cancelled: XCircleIcon
        };
        const Icon = icons[status] || ClockIcon;
        return <Icon className="w-5 h-5" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            preparing: 'bg-blue-100 text-blue-800 border-blue-200',
            ready: 'bg-purple-100 text-purple-800 border-purple-200',
            delivering: 'bg-orange-100 text-orange-800 border-orange-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

    const handleStatusChange = (orderId, newStatus) => {
        post(route('orders.update-status', orderId), {
            data: { status: newStatus },
            preserveScroll: true,
        });
    };

    const getAvailableActions = (order) => {
        const actions = [];
        const userRole = auth.user.role?.slug;

        if (userRole === 'restaurant' && order.restaurant_id === auth.user.restaurant?.id) {
            switch (order.status) {
                case 'pending':
                    actions.push(['preparing', 'En préparation']);
                    actions.push(['cancelled', 'Annuler']);
                    break;
                case 'preparing':
                    actions.push(['ready', 'Prêt pour livraison']);
                    break;
            }
        } else if (userRole === 'driver' && order.driver_id === auth.user.driver?.id) {
            switch (order.status) {
                case 'ready':
                    actions.push(['delivering', 'Commencer livraison']);
                    break;
                case 'delivering':
                    actions.push(['delivered', 'Marquer comme livré']);
                    break;
            }
        }

        return actions;
    };

    return (
        <MainLayout user={auth.user}>
            <Head title={auth.user.role?.slug === 'restaurant' ? `Commandes - ${auth.user.restaurant?.name}` : 'Commandes'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {auth.user.role?.slug === 'restaurant' ? auth.user.restaurant?.name : 'Commandes'}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {auth.user.role?.slug === 'restaurant' && auth.user.restaurant?.address}
                            </p>
                        </div>
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
                        
                        {auth.user.role?.slug === 'customer' && (
                            <Link
                                href={route('orders.create')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Nouvelle Commande
                            </Link>
                        )}
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
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Restaurant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Livreur
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Montant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('orders.show', order.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        #{order.id}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(new Date(order.created_at), 'Pp', { locale: fr })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.restaurant?.name || 'Restaurant inconnu'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.restaurant?.address}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.user?.name || 'Client inconnu'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.user?.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {order.driver 
                                                        ? (
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {order.driver.user?.name || 'Nom inconnu'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {order.driver.phone || 'Pas de téléphone'}
                                                                </div>
                                                            </div>
                                                        )
                                                        : <span className="text-sm text-gray-500">Non assigné</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                        <span className="mr-2">
                                                            {getStatusIcon(order.status)}
                                                        </span>
                                                        {getStatusLabel(order.status)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    }).format(order.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        {getAvailableActions(order).map(([status, label]) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(order.id, status)}
                                                                disabled={processing}
                                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                {label}
                                                            </button>
                                                        ))}
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
