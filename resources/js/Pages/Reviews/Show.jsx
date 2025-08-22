import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StarIcon } from '@heroicons/react/solid';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ auth, review }) {
    const { data, setData, post, processing, errors } = useForm({
        response: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.respond', review.id));
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon
                key={index}
                className={`h-6 w-6 ${
                    index < rating ? 'text-yellow-400' : 'text-gray-200'
                }`}
            />
        ));
    };

    return (
        <MainLayout
            user={auth.user}
            header={`Avis #${review.id}`}
        >
            <Head title={`Avis #${review.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête de l'avis */}
                            <div className="mb-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            Avis sur {review.reviewable_type === 'Restaurant' 
                                                ? review.reviewable.name 
                                                : `${review.reviewable.user.name} (Chauffeur)`}
                                        </h2>
                                        <div className="flex items-center mb-4">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-lg text-gray-600">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                    {review.order && (
                                        <Link
                                            href={route('orders.show', review.order.id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Voir la commande #{review.order.id}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Contenu de l'avis */}
                            <div className="mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-xl font-bold text-indigo-700">
                                                    {review.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {review.user.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {format(new Date(review.created_at), 'PPp', { locale: fr })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 prose max-w-none">
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Réponse existante */}
                            {review.response && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Réponse</h3>
                                    <div className="bg-white border border-gray-200 p-6 rounded-lg">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-xl font-bold text-green-700">R</span>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            Réponse de l'établissement
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {format(new Date(review.response_at), 'PPp', { locale: fr })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 prose max-w-none">
                                                    <p className="text-gray-700">{review.response}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formulaire de réponse */}
                            {!review.response && (auth.user.role === 'admin' || 
                                (auth.user.role === 'restaurant' && review.reviewable_type === 'Restaurant' && 
                                auth.user.restaurant.id === review.reviewable_id)) && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Répondre à cet avis</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <textarea
                                                value={data.response}
                                                onChange={e => setData('response', e.target.value)}
                                                rows="4"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Votre réponse..."
                                            ></textarea>
                                            <InputError message={errors.response} className="mt-2" />
                                        </div>
                                        <div className="flex justify-end">
                                            <PrimaryButton disabled={processing}>
                                                Publier la réponse
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
