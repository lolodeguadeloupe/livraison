import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { StarIcon } from '@heroicons/react/solid';

export default function Create({ auth, order }) {
    const [hoveredRating, setHoveredRating] = useState(0);
    
    const { data, setData, post, processing, errors } = useForm({
        order_id: order.id,
        rating: 0,
        comment: '',
        reviewable_type: '',
        reviewable_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.store'));
    };

    const handleRatingClick = (rating) => {
        setData('rating', rating);
    };

    const handleRatingHover = (rating) => {
        setHoveredRating(rating);
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const rating = index + 1;
            return (
                <button
                    key={rating}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => handleRatingHover(rating)}
                    onMouseLeave={() => handleRatingHover(0)}
                >
                    <StarIcon
                        className={`h-8 w-8 ${
                            rating <= (hoveredRating || data.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                        }`}
                    />
                </button>
            );
        });
    };

    return (
        <MainLayout
            user={auth.user}
            header="Donner votre avis"
        >
            <Head title="Donner votre avis" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Informations de la commande */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Commande #{order.id}</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Restaurant</p>
                                            <p className="font-medium">{order.restaurant.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Chauffeur</p>
                                            <p className="font-medium">
                                                {order.driver ? order.driver.user.name : 'Non assigné'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Date de livraison</p>
                                            <p className="font-medium">
                                                {new Date(order.delivered_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire d'avis */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Sélection de l'objet de l'avis */}
                                <div>
                                    <InputLabel htmlFor="reviewable_type" value="Que souhaitez-vous évaluer ?" />
                                    <div className="mt-4 space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="reviewable_type"
                                                className="form-radio text-indigo-600"
                                                value="restaurant"
                                                checked={data.reviewable_type === 'restaurant'}
                                                onChange={() => {
                                                    setData({
                                                        ...data,
                                                        reviewable_type: 'restaurant',
                                                        reviewable_id: order.restaurant.id
                                                    });
                                                }}
                                            />
                                            <span className="ml-2">Le restaurant ({order.restaurant.name})</span>
                                        </label>
                                        {order.driver && (
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="reviewable_type"
                                                    className="form-radio text-indigo-600"
                                                    value="driver"
                                                    checked={data.reviewable_type === 'driver'}
                                                    onChange={() => {
                                                        setData({
                                                            ...data,
                                                            reviewable_type: 'driver',
                                                            reviewable_id: order.driver.id
                                                        });
                                                    }}
                                                />
                                                <span className="ml-2">Le chauffeur ({order.driver.user.name})</span>
                                            </label>
                                        )}
                                    </div>
                                    <InputError message={errors.reviewable_type} className="mt-2" />
                                </div>

                                {/* Note */}
                                <div>
                                    <InputLabel value="Note" />
                                    <div 
                                        className="flex space-x-1 mt-2" 
                                        onMouseLeave={() => handleRatingHover(0)}
                                    >
                                        {renderStars()}
                                    </div>
                                    <InputError message={errors.rating} className="mt-2" />
                                </div>

                                {/* Commentaire */}
                                <div>
                                    <InputLabel htmlFor="comment" value="Votre commentaire" />
                                    <textarea
                                        id="comment"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="4"
                                        value={data.comment}
                                        onChange={e => setData('comment', e.target.value)}
                                        placeholder="Partagez votre expérience..."
                                        required
                                    ></textarea>
                                    <InputError message={errors.comment} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Publier l'avis
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
