import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { SearchIcon as MagnifyingGlassIcon } from '@heroicons/react/solid';
import MainLayout from '@/Layouts/MainLayout';

export default function DriversIndex({ auth, drivers }) {
    return (
        <MainLayout
            user={auth.user}
            header="Chauffeurs"
        >
            <Head title="Chauffeurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and filters */}
                    <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="max-w-xs mt-1">
                                <label htmlFor="search" className="sr-only">
                                    Rechercher
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="search"
                                        name="search"
                                        id="search"
                                        className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Rechercher un chauffeur"
                                    />
                                </div>
                            </div>
                        </div>
                        {auth.user.isAdmin && (
                            <div className="flex mt-3 sm:mt-0 sm:ml-4">
                                <Link
                                    href={route('drivers.create')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Ajouter un chauffeur
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Drivers list */}
                    <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {drivers.data.map((driver) => (
                                <li key={driver.id}>
                                    <Link
                                        href={route('drivers.show', driver.id)}
                                        className="block hover:bg-gray-50"
                                    >
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            className="w-12 h-12 rounded-full"
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.user.name)}&background=random`}
                                                            alt={driver.user.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                                            {driver.user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {driver.vehicle_type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            driver.is_available
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {driver.is_available ? 'Disponible' : 'Indisponible'}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            driver.is_verified
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {driver.is_verified ? 'Vérifié' : 'Non vérifié'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pagination */}
                    {drivers.links && (
                        <div className="mt-4">
                            {/* Add your pagination component here */}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
