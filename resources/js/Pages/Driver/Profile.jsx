import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    LocationMarkerIcon,
    TruckIcon,
    StarIcon,
    ClockIcon,
    CashIcon,
    CheckCircleIcon
} from '@heroicons/react/outline';

export default function DriverProfile({ auth, stats }) {
    const [isAvailable, setIsAvailable] = useState(true);

    return (
        <MainLayout
            user={auth.user}
            header="Mon Profil Livreur"
        >
            <Head title="Profil Livreur" />

            <div className="mt-8">
                {/* Status toggle */}
                <div className="p-4 bg-white rounded-lg shadow sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Statut</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Définissez votre disponibilité pour recevoir des commandes
                            </p>
                        </div>
                        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsAvailable(!isAvailable)}
                                    type="button"
                                    className={`${
                                        isAvailable
                                            ? 'bg-green-600'
                                            : 'bg-gray-200'
                                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    role="switch"
                                    aria-checked={isAvailable}
                                >
                                    <span
                                        className={`${
                                            isAvailable ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                    />
                                </button>
                                <span className="ml-3">
                                    <span className="text-sm font-medium text-gray-900">
                                        {isAvailable ? 'Disponible' : 'Indisponible'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-md">
                                <StarIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Note moyenne</h4>
                                <p className="mt-1 text-3xl font-semibold text-gray-900">4.8/5</p>
                                <p className="mt-1 text-sm text-gray-500">Basé sur 124 livraisons</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-md">
                                <ClockIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Temps moyen</h4>
                                <p className="mt-1 text-3xl font-semibold text-gray-900">18 min</p>
                                <p className="mt-1 text-sm text-gray-500">Par livraison</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-md">
                                <CashIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Gains du mois</h4>
                                <p className="mt-1 text-3xl font-semibold text-gray-900">842€</p>
                                <p className="mt-1 text-sm text-gray-500">+12.5% vs mois dernier</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent deliveries */}
                <div className="mt-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Dernières livraisons
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {[1, 2, 3].map((delivery) => (
                                    <li key={delivery} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        Restaurant Le Gourmet → 123 rue de Paris
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Livré il y a 2h • 3.2 km • 15min
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    12.50€
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Vehicle information */}
                <div className="mt-8">
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Informations du véhicule
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        Scooter électrique
                                    </dd>
                                </div>
                                <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Immatriculation
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        AB-123-CD
                                    </dd>
                                </div>
                                <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Permis de conduire
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        12345678
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
