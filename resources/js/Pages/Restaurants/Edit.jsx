import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Edit({ auth, restaurant }) {
    const { data, setData, put, processing, errors } = useForm({
        name: restaurant.name,
        description: restaurant.description || '',
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        cuisine_type: restaurant.cuisine_type,
        opening_time: restaurant.opening_time,
        closing_time: restaurant.closing_time,
        is_active: restaurant.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('restaurants.update', restaurant.id));
    };

    return (
        <MainLayout
            user={auth.user}
            header="Modifier le restaurant"
        >
            <Head title="Modifier le restaurant" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nom du restaurant" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="block w-full mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="address" value="Adresse" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    className="block w-full mt-1"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="latitude" value="Latitude" />
                                    <TextInput
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        className="block w-full mt-1"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.latitude} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="longitude" value="Longitude" />
                                    <TextInput
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        className="block w-full mt-1"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.longitude} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Téléphone" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    className="block w-full mt-1"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="cuisine_type" value="Type de cuisine" />
                                <TextInput
                                    id="cuisine_type"
                                    type="text"
                                    className="block w-full mt-1"
                                    value={data.cuisine_type}
                                    onChange={(e) => setData('cuisine_type', e.target.value)}
                                    required
                                />
                                <InputError message={errors.cuisine_type} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="opening_time" value="Heure d'ouverture" />
                                    <TextInput
                                        id="opening_time"
                                        type="time"
                                        className="block w-full mt-1"
                                        value={data.opening_time}
                                        onChange={(e) => setData('opening_time', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.opening_time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="closing_time" value="Heure de fermeture" />
                                    <TextInput
                                        id="closing_time"
                                        type="time"
                                        className="block w-full mt-1"
                                        value={data.closing_time}
                                        onChange={(e) => setData('closing_time', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.closing_time} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <InputLabel htmlFor="is_active" value="Restaurant actif" className="ml-2" />
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end space-x-4">
                                <DangerButton
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
                                            router.delete(route('restaurants.destroy', restaurant.id));
                                        }
                                    }}
                                >
                                    Supprimer
                                </DangerButton>
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Mettre à jour
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
