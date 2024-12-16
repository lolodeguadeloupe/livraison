import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Show({ auth, payment }) {
    const { data, put, processing } = useForm({
        status: payment.status,
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        put(route('payments.update', payment.id), {
            status: newStatus,
        });
    };

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
            header={`Paiement #${payment.id}`}
        >
            <Head title={`Paiement #${payment.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête du paiement */}
                            <div className="mb-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            Paiement #{payment.id}
                                        </h2>
                                        <p className="text-gray-600">
                                            Transaction ID: {payment.transaction_id || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <select
                                            value={data.status}
                                            onChange={handleStatusChange}
                                            className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${getStatusColor(data.status)}`}
                                            disabled={processing || ['completed', 'refunded'].includes(payment.status)}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="completed">Complété</option>
                                            <option value="failed">Échoué</option>
                                            <option value="refunded">Remboursé</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Détails du paiement</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <div>
                                            <p className="text-gray-600">Montant</p>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(payment.amount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Méthode de paiement</p>
                                            <p className="font-medium">{getMethodLabel(payment.payment_method)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Date du paiement</p>
                                            <p className="font-medium">
                                                {format(new Date(payment.created_at), 'PPp', { locale: fr })}
                                            </p>
                                        </div>
                                        {payment.processed_at && (
                                            <div>
                                                <p className="text-gray-600">Date de traitement</p>
                                                <p className="font-medium">
                                                    {format(new Date(payment.processed_at), 'PPp', { locale: fr })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Informations de la commande</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <div>
                                            <p className="text-gray-600">Numéro de commande</p>
                                            <Link
                                                href={route('orders.show', payment.order.id)}
                                                className="font-medium text-indigo-600 hover:text-indigo-900"
                                            >
                                                #{payment.order.id}
                                            </Link>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Client</p>
                                            <p className="font-medium">{payment.order.user.name}</p>
                                            <p className="text-sm text-gray-500">{payment.order.user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Restaurant</p>
                                            <p className="font-medium">{payment.order.restaurant.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Détails supplémentaires */}
                            {payment.details && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Détails de la transaction</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="whitespace-pre-wrap text-sm">
                                            {JSON.stringify(payment.details, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Notes et commentaires */}
                            {payment.notes && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap">{payment.notes}</p>
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
