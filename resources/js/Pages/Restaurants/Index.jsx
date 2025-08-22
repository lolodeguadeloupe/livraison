import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    SearchIcon as MagnifyingGlassIcon, 
    AdjustmentsIcon as FilterIcon, 
    PlusIcon
} from '@heroicons/react/solid';

export default function RestaurantsIndex({ auth, restaurants }) {
    return (
        <MainLayout
            user={auth.user}
            header="Restaurants"
        >
            <Head title="Restaurants" />

            <div className="mt-8">
                {/* Search and filters */}
                <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="max-w-xs mt-1">
                            <label htmlFor="search" className="sr-only">
                                Rechercher
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Rechercher un restaurant"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-3 sm:mt-0 sm:ml-4">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FilterIcon className="w-5 h-5 mr-2 -ml-1 text-gray-500" aria-hidden="true" />
                            Filtres
                        </button>
                        {auth.user.role === 'admin' && (
                            <Link
                                href={route('restaurants.create')}
                                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                                Ajouter un restaurant
                            </Link>
                        )}
                    </div>
                </div>

                {/* Restaurants grid */}
                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((restaurant) => (
                        <Link
                            key={restaurant.id}
                            href={route('restaurants.show', restaurant.id)}
                            className="relative flex flex-col overflow-hidden bg-white rounded-lg shadow group hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-gray-200 group-hover:opacity-75">
                                <img
                                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                                    alt={restaurant.name}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute top-0 right-0 p-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        restaurant.is_active 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {restaurant.is_active ? 'Ouvert' : 'Fermé'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 p-4">
                                <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{restaurant.cuisine_type}</p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <span key={index} className="text-yellow-400">
                                                {index < Math.floor(restaurant.rating) ? '★' : '☆'}
                                            </span>
                                        ))}
                                        <span className="ml-1">
                                            {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                                        </span>
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{restaurant.total_orders} commandes</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="flex items-center text-sm text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {restaurant.address}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
