import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Show({ auth, order, availableDrivers }) {
    const { data, put, processing } = useForm({
        status: order.status,
        driver_id: order.driver_id || '',
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        put(route('orders.update', order.id), {
            ...data,
            status: newStatus,
        });
    };

    const handleDriverAssignment = (e) => {
        const newDriverId = e.target.value;
        put(route('orders.update', order.id), {
            ...data,
            driver_id: newDriverId,
        });
    };

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

    return (
        <MainLayout
            user={auth.user}
            header={`Commande #${order.id}`}
        >
            <Head title={`Commande #${order.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête de la commande */}
                            <div className="mb-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            Commande #{order.id}
                                        </h2>
                                        <p className="text-gray-600">
                                            Créée le {format(new Date(order.created_at), 'PPp', { locale: fr })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="mb-4">
                                            <select
                                                value={data.status}
                                                onChange={handleStatusChange}
                                                className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${getStatusColor(data.status)}`}
                                                disabled={processing}
                                            >
                                                <option value="pending">En attente</option>
                                                <option value="preparing">En préparation</option>
                                                <option value="ready">Prêt</option>
                                                <option value="delivering">En livraison</option>
                                                <option value="delivered">Livré</option>
                                                <option value="cancelled">Annulé</option>
                                            </select>
                                        </div>
                                        {['pending', 'preparing', 'ready'].includes(order.status) && (
                                            <select
                                                value={data.driver_id}
                                                onChange={handleDriverAssignment}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                disabled={processing}
                                            >
                                                <option value="">Assigner un chauffeur</option>
                                                {availableDrivers.map((driver) => (
                                                    <option key={driver.id} value={driver.id}>
                                                        {driver.user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Détails de la commande</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="mb-4">
                                            <p className="text-gray-600">Restaurant</p>
                                            <p className="font-medium">{order.restaurant.name}</p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-gray-600">Client</p>
                                            <p className="font-medium">{order.user.name}</p>
                                            <p className="text-sm text-gray-500">{order.user.email}</p>
                                        </div>
                                        {order.driver && (
                                            <div className="mb-4">
                                                <p className="text-gray-600">Chauffeur</p>
                                                <p className="font-medium">{order.driver.user.name}</p>
                                                <p className="text-sm text-gray-500">{order.driver.vehicle_type}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="mb-4">
                                            <p className="text-gray-600">Adresse de livraison</p>
                                            <p className="font-medium">{order.delivery_address}</p>
                                        </div>
                                        {order.notes && (
                                            <div>
                                                <p className="text-gray-600">Notes</p>
                                                <p className="font-medium">{order.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Articles de la commande */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
                                <div className="bg-gray-50 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Article
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantité
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Prix unitaire
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        {new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        }).format(item.price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        {new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        }).format(item.price * item.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-right font-medium">
                                                    Total
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    }).format(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Paiement */}
                            {order.payment && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Paiement</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-600">Méthode de paiement</p>
                                                <p className="font-medium capitalize">{order.payment.payment_method}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Statut du paiement</p>
                                                <p className="font-medium capitalize">{order.payment.status}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Date du paiement</p>
                                                <p className="font-medium">
                                                    {format(new Date(order.payment.created_at), 'PPp', { locale: fr })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Montant payé</p>
                                                <p className="font-medium">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    }).format(order.payment.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
