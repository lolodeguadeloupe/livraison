import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { StarIcon, LocationMarkerIcon, PhoneIcon, ClockIcon } from '@heroicons/react/solid';

export default function Show({ auth, restaurant }) {
    return (
        <MainLayout
            user={auth.user}
            header={restaurant.name}
        >
            <Head title={restaurant.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Restaurant Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative h-64">
                            <img
                                className="w-full h-full object-cover"
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                                alt={restaurant.name}
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    restaurant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {restaurant.is_active ? 'Ouvert' : 'Fermé'}
                                </span>
                            </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                                    <p className="mt-2 text-gray-600">{restaurant.description}</p>
                                </div>
                                {(auth.user?.isAdmin || auth.user?.id === restaurant.user_id) && (
                                    <Link
                                        href={route('restaurants.edit', restaurant.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                                    >
                                        Modifier
                                    </Link>
                                )}
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                                            <LocationMarkerIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            Adresse
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">{restaurant.address}</dd>
                                    </div>

                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            Téléphone
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">{restaurant.phone}</dd>
                                    </div>

                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            Horaires
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {restaurant.opening_time} - {restaurant.closing_time}
                                        </dd>
                                    </div>

                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Type de cuisine</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{restaurant.cuisine_type}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Reviews Section */}
                            {restaurant.reviews?.length > 0 && (
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    <h2 className="text-xl font-bold text-gray-900">Avis récents</h2>
                                    <div className="mt-6 space-y-6">
                                        {restaurant.reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-200 pb-6">
                                                <div className="flex items-center">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i < review.restaurant_rating
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="ml-4 text-sm text-gray-600">
                                                        {review.user.name}
                                                    </p>
                                                </div>
                                                {review.restaurant_comment && (
                                                    <p className="mt-4 text-sm text-gray-600">
                                                        {review.restaurant_comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
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
