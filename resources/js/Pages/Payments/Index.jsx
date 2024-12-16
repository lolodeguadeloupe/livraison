import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ auth, payments }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');

    const filteredPayments = payments.filter(payment => {
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
        return matchesStatus && matchesMethod;
    });

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'En attente',
            completed: 'Complété',
            failed: 'Échoué',
            refunded: 'Remboursé'
        };
        return labels[status] || status;
    };

    const getMethodLabel = (method) => {
        const labels = {
            card: 'Carte bancaire',
            cash: 'Espèces',
            transfer: 'Virement',
            paypal: 'PayPal'
        };
        return labels[method] || method;
    };

    return (
        <MainLayout
            user={auth.user}
            header="Gestion des Paiements"
        >
            <Head title="Paiements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="completed">Complété</option>
                            <option value="failed">Échoué</option>
                            <option value="refunded">Remboursé</option>
                        </select>

                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={methodFilter}
                            onChange={(e) => setMethodFilter(e.target.value)}
                        >
                            <option value="all">Toutes les méthodes</option>
                            <option value="card">Carte bancaire</option>
                            <option value="cash">Espèces</option>
                            <option value="transfer">Virement</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>

                    {/* Tableau des paiements */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID Transaction
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Commande
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Méthode
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Montant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
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
                                        {filteredPayments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('payments.show', payment.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {payment.transaction_id || `#${payment.id}`}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('orders.show', payment.order.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Commande #{payment.order.id}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.order.user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getMethodLabel(payment.payment_method)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    }).format(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                                                        {getStatusLabel(payment.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(payment.created_at), 'PPp', { locale: fr })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('payments.show', payment.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Détails
                                                        </Link>
                                                        {payment.status === 'pending' && (
                                                            <Link
                                                                href={route('payments.edit', payment.id)}
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
