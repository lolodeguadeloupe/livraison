import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { 
    MenuIcon,
    XIcon,
    UserIcon,
    HomeIcon,
    ShoppingBagIcon,
    TruckIcon,
    StarIcon,
    CurrencyDollarIcon as CashIcon,
    UserGroupIcon,
    ChartBarIcon,
    CogIcon,
    LogoutIcon
} from '@heroicons/react/solid';

export default function MainLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
        { name: 'Restaurants', href: '/restaurants', icon: ShoppingBagIcon },
        { name: 'Commandes', href: '/orders', icon: ChartBarIcon },
        { name: 'Livreurs', href: '/drivers', icon: TruckIcon },
        { name: 'Paiements', href: '/payments', icon: CashIcon },
        { name: 'Avis', href: '/reviews', icon: StarIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar for mobile */}
            <Transition show={sidebarOpen} as={React.Fragment}>
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <Transition.Child
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0">
                            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                        </div>
                    </Transition.Child>

                    <Transition.Child
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
                            <div className="absolute top-0 right-0 pt-2 -mr-12">
                                <button
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex items-center flex-shrink-0 px-4">
                                    <img
                                        className="w-auto h-8"
                                        src="/logo.svg"
                                        alt="Livraison de merde"
                                    />
                                </div>
                                <nav className="px-2 mt-5 space-y-1">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group ${url === item.href ? 'bg-gray-100 text-gray-900' : ''}`}
                                        >
                                            <item.icon
                                                className={`w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500 ${url === item.href ? 'text-gray-500' : ''}`}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                                    >
                                        <LogoutIcon
                                            className="w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        Déconnexion
                                    </Link>
                                </nav>
                            </div>
                            <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
                                <Link href="/profile" className="flex-shrink-0 block group">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                className="inline-block w-10 h-10 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                                                Voir le profil
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
                    <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <img
                                className="w-auto h-8"
                                src="/logo.svg"
                                alt="Livraison"
                            />
                        </div>
                        <nav className="flex-1 px-2 mt-5 space-y-1 bg-white">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group ${url === item.href ? 'bg-gray-100 text-gray-900' : ''}`}
                                >
                                    <item.icon
                                        className={`w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500 ${url === item.href ? 'text-gray-500' : ''}`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                            >
                                <LogoutIcon
                                    className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                                Déconnexion
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
                        <Link href="/profile" className="flex-shrink-0 block w-full group">
                            <div className="flex items-center">
                                <div>
                                    <img
                                        className="inline-block w-9 h-9 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {user.name}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                        Voir le profil
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 md:pl-64">
                <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow">
                    <button
                        type="button"
                        className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <MenuIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <div className="flex justify-between flex-1 px-4">
                        <div className="flex flex-1">
                            <h1 className="text-2xl font-semibold text-gray-900 my-auto">{header}</h1>
                        </div>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
