import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    TrendingUpIcon,
    UserGroupIcon,
    CashIcon,
    ClockIcon,
    ShoppingBagIcon,
    DocumentTextIcon
} from '@heroicons/react/outline';

export default function Dashboard({ auth, stats }) {
    const cards = [
        {
            name: 'Commandes du jour',
            value: stats?.todayOrders || '0',
            icon: ClockIcon,
            description: 'Commandes reçues aujourd\'hui'
        },
        {
            name: 'Livreurs actifs',
            value: stats?.activeDrivers || '0',
            icon: UserGroupIcon,
            description: 'Livreurs disponibles'
        },
        {
            name: 'Restaurants',
            value: stats?.totalRestaurants || '0',
            icon: ShoppingBagIcon,
            description: 'Restaurants partenaires'
        },
        {
            name: 'Total commandes',
            value: stats?.totalOrders || '0',
            icon: DocumentTextIcon,
            description: 'Commandes totales'
        },
        {
            name: 'Chiffre d\'affaires',
            value: `${(stats?.revenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
            icon: CashIcon,
            description: 'Chiffre d\'affaires total'
        },
        {
            name: 'Croissance',
            value: stats?.growthRate || '0%',
            icon: TrendingUpIcon,
            description: 'Taux de croissance mensuel'
        }
    ];

    return (
        <MainLayout
            user={auth.user}
            header="Tableau de bord"
        >
            <Head title="Tableau de bord" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
                        {cards.map((card) => (
                            <div
                                key={card.name}
                                className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
                            >
                                <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                                    <card.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {card.name}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {card.value}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                                Commandes récentes
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fonctionnalité à venir
                            </p>
                        </div>

                        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                                Statistiques des restaurants
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fonctionnalité à venir
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
