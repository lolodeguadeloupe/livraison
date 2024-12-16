import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StarIcon } from '@heroicons/react/20/solid';

export default function Index({ auth, reviews }) {
    const [ratingFilter, setRatingFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredReviews = reviews.filter(review => {
        const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        const matchesType = typeFilter === 'all' || review.reviewable_type.toLowerCase().includes(typeFilter);
        return matchesRating && matchesType;
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon
                key={index}
                className={`h-5 w-5 ${
                    index < rating ? 'text-yellow-400' : 'text-gray-200'
                }`}
            />
        ));
    };

    return (
        <MainLayout
            user={auth.user}
            header="Avis et Évaluations"
        >
            <Head title="Avis et Évaluations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                        >
                            <option value="all">Toutes les notes</option>
                            <option value="5">5 étoiles</option>
                            <option value="4">4 étoiles</option>
                            <option value="3">3 étoiles</option>
                            <option value="2">2 étoiles</option>
                            <option value="1">1 étoile</option>
                        </select>

                        <select
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Tous les types</option>
                            <option value="restaurant">Restaurants</option>
                            <option value="driver">Chauffeurs</option>
                        </select>
                    </div>

                    {/* Liste des avis */}
                    <div className="space-y-6">
                        {filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Avis sur {review.reviewable_type === 'Restaurant' 
                                                    ? review.reviewable.name 
                                                    : `${review.reviewable.user.name} (Chauffeur)`}
                                            </h3>
                                            <p className="text-gray-600">
                                                Par {review.user.name} • {format(new Date(review.created_at), 'PPp', { locale: fr })}
                                            </p>
                                        </div>
                                        <div>
                                            <Link
                                                href={route('reviews.show', review.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Voir les détails
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-gray-600">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div className="prose max-w-none">
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>

                                    {review.order && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Link
                                                href={route('orders.show', review.order.id)}
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Commande associée #{review.order.id}
                                            </Link>
                                        </div>
                                    )}

                                    {review.response && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm font-semibold text-gray-900">Réponse :</p>
                                                <p className="mt-1 text-sm text-gray-700">{review.response}</p>
                                                <p className="mt-2 text-xs text-gray-500">
                                                    {format(new Date(review.response_at), 'PPp', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {!review.response && auth.user.role === 'admin' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Link
                                                href={route('reviews.edit', review.id)}
                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                            >
                                                Répondre à cet avis
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
