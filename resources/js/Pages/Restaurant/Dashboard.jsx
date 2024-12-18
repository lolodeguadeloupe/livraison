import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
    UserIcon,
    PhoneIcon,
    MapPinIcon 
} from '@heroicons/react/20/solid';

export default function RestaurantDashboard({ auth, restaurant, orders = [], todayOrders = [], stats }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            delivering: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'En attente',
            preparing: 'En préparation',
            delivering: 'En livraison',
            delivered: 'Livré',
            cancelled: 'Annulé'
        };
        return texts[status] || status;
    };

    const OrdersList = ({ orders = [], title }) => (
        <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            </div>
            <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Montant</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Livreur</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                        #{order.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {order.total_amount.toFixed(2)} €
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {order.customer}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {order.driver || 'Non assigné'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {format(new Date(order.created_at), 'Pp', { locale: fr })}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                                        Aucune commande trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de bord</h2>}
        >
            <Head title={`Restaurant - ${restaurant.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Restaurant Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-base font-semibold leading-7 text-gray-900">{restaurant.name}</h3>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{restaurant.description}</p>
                            </div>
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2" />
                                            Propriétaire
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {restaurant.owner}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                            <MapPinIcon className="h-5 w-5 mr-2" />
                                            Adresse
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {restaurant.address}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                                            <PhoneIcon className="h-5 w-5 mr-2" />
                                            Téléphone
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                            {restaurant.phone}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { name: "Commandes aujourd'hui", value: stats.today_orders },
                            { name: 'Total commandes', value: stats.total_orders },
                            { name: "Chiffre d'affaires aujourd'hui", value: `${stats.today_revenue.toFixed(2)}€` },
                            { name: 'Total chiffre d\'affaires', value: `${stats.total_revenue.toFixed(2)}€` },
                            { name: 'Commandes en attente', value: stats.pending_orders },
                            { name: 'Commandes terminées', value: stats.completed_orders },
                            { name: 'Valeur moyenne commande', value: `${stats.average_order_value.toFixed(2)}€` },
                        ].map((item) => (
                            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.value}</dd>
                            </div>
                        ))}
                    </div>

                    {/* Orders Lists */}
                    <OrdersList orders={todayOrders} title="Commandes du jour" />
                    <OrdersList orders={orders} title="Toutes les commandes" />
                </div>
            </div>
        </AdminLayout>
    );
}
