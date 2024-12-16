import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, order }) {
    const { data, setData, post, processing, errors } = useForm({
        order_id: order.id,
        amount: order.total_amount,
        payment_method: '',
        transaction_id: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <MainLayout
            user={auth.user}
            header="Enregistrer un paiement"
        >
            <Head title="Enregistrer un paiement" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Informations de la commande */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Détails de la commande</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Numéro de commande</p>
                                            <p className="font-medium">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Client</p>
                                            <p className="font-medium">{order.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Restaurant</p>
                                            <p className="font-medium">{order.restaurant.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Montant total</p>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire de paiement */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="payment_method" value="Méthode de paiement" />
                                    <select
                                        id="payment_method"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez une méthode</option>
                                        <option value="card">Carte bancaire</option>
                                        <option value="cash">Espèces</option>
                                        <option value="transfer">Virement</option>
                                        <option value="paypal">PayPal</option>
                                    </select>
                                    <InputError message={errors.payment_method} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="amount" value="Montant" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 block w-full"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="transaction_id" value="ID de transaction (optionnel)" />
                                    <TextInput
                                        id="transaction_id"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.transaction_id}
                                        onChange={e => setData('transaction_id', e.target.value)}
                                    />
                                    <InputError message={errors.transaction_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notes" value="Notes (optionnel)" />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    ></textarea>
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Enregistrer le paiement
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
