import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, driver }) {
    const { data, setData, patch, processing, errors } = useForm({
        vehicle_type: driver.vehicle_type || '',
        vehicle_number: driver.vehicle_number || '',
        license_number: driver.license_number || '',
        is_available: driver.is_available,
        current_latitude: driver.current_latitude || '',
        current_longitude: driver.current_longitude || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('drivers.update', driver.id));
    };

    return (
        <MainLayout
            user={auth.user}
            header={`Modifier le chauffeur - ${driver.user.name}`}
        >
            <Head title={`Modifier le chauffeur - ${driver.user.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="vehicle_type" value="Type de véhicule" />
                                <select
                                    id="vehicle_type"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.vehicle_type}
                                    onChange={(e) => setData('vehicle_type', e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionnez un type</option>
                                    <option value="car">Voiture</option>
                                    <option value="motorcycle">Moto</option>
                                    <option value="bicycle">Vélo</option>
                                    <option value="scooter">Scooter</option>
                                </select>
                                <InputError message={errors.vehicle_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="vehicle_number" value="Numéro du véhicule" />
                                <TextInput
                                    id="vehicle_number"
                                    type="text"
                                    className="block w-full mt-1"
                                    value={data.vehicle_number}
                                    onChange={(e) => setData('vehicle_number', e.target.value)}
                                    required
                                />
                                <InputError message={errors.vehicle_number} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="license_number" value="Numéro de permis" />
                                <TextInput
                                    id="license_number"
                                    type="text"
                                    className="block w-full mt-1"
                                    value={data.license_number}
                                    onChange={(e) => setData('license_number', e.target.value)}
                                    required
                                />
                                <InputError message={errors.license_number} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="current_latitude" value="Latitude actuelle" />
                                    <TextInput
                                        id="current_latitude"
                                        type="number"
                                        step="any"
                                        className="block w-full mt-1"
                                        value={data.current_latitude}
                                        onChange={(e) => setData('current_latitude', e.target.value)}
                                    />
                                    <InputError message={errors.current_latitude} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="current_longitude" value="Longitude actuelle" />
                                    <TextInput
                                        id="current_longitude"
                                        type="number"
                                        step="any"
                                        className="block w-full mt-1"
                                        value={data.current_longitude}
                                        onChange={(e) => setData('current_longitude', e.target.value)}
                                    />
                                    <InputError message={errors.current_longitude} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    checked={data.is_available}
                                    onChange={(e) => setData('is_available', e.target.checked)}
                                />
                                <InputLabel htmlFor="is_available" value="Disponible pour les livraisons" className="ml-2" />
                                <InputError message={errors.is_available} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
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
