import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Dialog } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';

const OrderStatus = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return {
                    label: 'En attente',
                    classes: 'bg-yellow-100 text-yellow-800'
                };
            case 'preparing':
                return {
                    label: 'En préparation',
                    classes: 'bg-blue-100 text-blue-800'
                };
            case 'ready':
                return {
                    label: 'Prêt',
                    classes: 'bg-green-100 text-green-800'
                };
            case 'delivered':
                return {
                    label: 'Livré',
                    classes: 'bg-gray-100 text-gray-800'
                };
            case 'cancelled':
                return {
                    label: 'Annulé',
                    classes: 'bg-red-100 text-red-800'
                };
            default:
                return {
                    label: status,
                    classes: 'bg-gray-100 text-gray-800'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
            {config.label}
        </span>
    );
};

const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
};

export default function Show({ auth, restaurant }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const OrderModal = ({ order, isOpen, onClose }) => {
        if (!order) return null;

        return (
            <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-medium mb-4">
                            Détails de la commande #{order.id}
                        </Dialog.Title>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold">Client:</p>
                                <p>{order.user?.name || 'Client inconnu'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Date:</p>
                                <p>{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Livreur:</p>
                                <p>{order.driver?.user?.name || 'Non assigné'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Téléphone du livreur:</p>
                                <p>{order.driver?.phone || 'Non disponible'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Montant:</p>
                                <p>{formatPrice(order.total_amount)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Statut:</p>
                                <OrderStatus status={order.status} />
                            </div>
                            {order.items && (
                                <div>
                                    <p className="font-semibold">Articles:</p>
                                    <ul className="list-disc pl-5">
                                        {order.items.map((item, index) => (
                                            <li key={index}>{item.name} x{item.quantity}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Fermer
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    };

    const OrderList = ({ title, orders }) => (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.user?.name || 'Client inconnu'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(order.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPrice(order.total_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <OrderStatus status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => openOrderModal(order)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Voir détails
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <MainLayout user={auth.user}>
            <Head title={restaurant.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Restaurant Info */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                        <StarIcon className="h-5 w-5 text-yellow-400" />
                                        <span className="ml-1 font-semibold">{restaurant.rating}/5</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-semibold">Adresse : </span>
                                        <span className="text-gray-600">{restaurant.address}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Téléphone : </span>
                                        <span className="text-gray-600">{restaurant.phone}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Type de cuisine : </span>
                                        <span className="text-gray-600">{restaurant.cuisine_type}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Horaires : </span>
                                        <span className="text-gray-600">
                                            {restaurant.opening_hours || 'Non spécifié'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-gray-50 rounded p-6">
                                    <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total des commandes</span>
                                            <span className="font-semibold">{restaurant.total_orders}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Chiffre d'affaires</span>
                                            <span className="font-semibold">{formatPrice(restaurant.total_revenue)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Note moyenne</span>
                                            <div className="flex items-center">
                                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                                <span className="ml-1 font-semibold">{restaurant.rating}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Sections */}
                    <div className="space-y-6">
                        {restaurant.current_orders.length > 0 && (
                            <OrderList
                                title="Commandes en cours"
                                orders={restaurant.current_orders}
                            />
                        )}

                        {restaurant.upcoming_orders.length > 0 && (
                            <OrderList
                                title="Commandes à venir"
                                orders={restaurant.upcoming_orders}
                            />
                        )}

                        {restaurant.past_orders.length > 0 && (
                            <OrderList title="Commandes passées" orders={restaurant.past_orders} />
                        )}
                    </div>

                    {/* Order Details Modal */}
                    <OrderModal
                        order={selectedOrder}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
