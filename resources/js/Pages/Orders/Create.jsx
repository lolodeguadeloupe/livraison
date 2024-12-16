import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, restaurants, users }) {
    const [items, setItems] = useState([{ name: '', quantity: 1, price: '' }]);
    
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        restaurant_id: '',
        delivery_address: '',
        items: items,
        notes: '',
    });

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, price: '' }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        setData('items', newItems);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <MainLayout
            user={auth.user}
            header="Nouvelle Commande"
        >
            <Head title="Nouvelle Commande" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Restaurant Selection */}
                                <div>
                                    <InputLabel htmlFor="restaurant_id" value="Restaurant" />
                                    <select
                                        id="restaurant_id"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={data.restaurant_id}
                                        onChange={e => setData('restaurant_id', e.target.value)}
                                    >
                                        <option value="">Sélectionnez un restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant.id} value={restaurant.id}>
                                                {restaurant.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.restaurant_id} className="mt-2" />
                                </div>

                                {/* Client Selection */}
                                <div>
                                    <InputLabel htmlFor="user_id" value="Client" />
                                    <select
                                        id="user_id"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                    >
                                        <option value="">Sélectionnez un client</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.user_id} className="mt-2" />
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <InputLabel htmlFor="delivery_address" value="Adresse de livraison" />
                                    <TextInput
                                        id="delivery_address"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.delivery_address}
                                        onChange={e => setData('delivery_address', e.target.value)}
                                    />
                                    <InputError message={errors.delivery_address} className="mt-2" />
                                </div>

                                {/* Order Items */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">Articles</h3>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            + Ajouter un article
                                        </button>
                                    </div>

                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-4 mb-4">
                                            <div className="flex-1">
                                                <TextInput
                                                    type="text"
                                                    placeholder="Nom de l'article"
                                                    value={item.name}
                                                    onChange={e => updateItem(index, 'name', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <TextInput
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qté"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Prix"
                                                    value={item.price}
                                                    onChange={e => updateItem(index, 'price', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    ))}
                                    <InputError message={errors.items} className="mt-2" />
                                </div>

                                {/* Total */}
                                <div className="flex justify-end text-xl font-bold">
                                    Total: {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(calculateTotal())}
                                </div>

                                {/* Notes */}
                                <div>
                                    <InputLabel htmlFor="notes" value="Notes" />
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
                                        Créer la commande
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
