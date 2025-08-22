'use client';

import React, { useEffect, useState } from 'react';
import { Title, Badge, Text } from 'rizzui';
import { getContactDashboardStats } from '@/utils/api';
import ContactChart from './ContactChart';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ContactDashboardStats } from '@/types/contact';
import { ClockIcon, EyeIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Params } from '@/types/params';
import { contactStatuses } from '@/constants/constants';
import { useTranslations } from 'next-intl';

const ContactDashboard: React.FC = () => {
    const [data, setData] = useState<ContactDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams<Params>();
    const t = useTranslations('DashboardPage.contactAnalytics')
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getContactDashboardStats();
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch contact dashboard stats:', err);
                setError('Failed to load contact dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <Text className="text-red-600">{error}</Text>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <Text className="text-gray-600">{t('noDataAvailable')}</Text>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case t('contactsbyStatusCard.new'): return "warning";
            case t('contactsbyStatusCard.inProgress'): return "info";
            case t('contactsbyStatusCard.contacted'): return "success";
            case t('contactsbyStatusCard.responded'): return "info";
            case t('contactsbyStatusCard.scheduled'): return "success";
            case t('contactsbyStatusCard.completed'): return "success";
            case t('contactsbyStatusCard.cancelled'): return "secondary";
            case t('contactsbyStatusCard.spam'): return "danger";
            default: return "secondary";
        }
    };

    const getStatusLabel = (status: string) => {
        const statusItem = contactStatuses.find(s => s.value === status);
        return statusItem?.label || 'Unknown';
    };

    return (
        <div className="space-y-6">
            {/* Stats divs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <Text className="text-sm font-medium text-blue-600">{t('cards.totalContacts')}</Text>
                            <Title as="h3" className="text-2xl font-bold text-blue-900">
                                {data.totalContacts}
                            </Title>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <EyeIcon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <Text className="text-sm font-medium text-green-600">{t('cards.newContacts')}</Text>
                            <Title as="h3" className="text-2xl font-bold text-green-900">
                                {data.newContacts}
                            </Title>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <Text className="text-sm font-medium text-yellow-600">{t('cards.inProgress')}</Text>
                            <Title as="h3" className="text-2xl font-bold text-yellow-900">
                                {data.inProgressContacts}
                            </Title>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <PhoneIcon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <Text className="text-sm font-medium text-red-600">{t('cards.urgentContacts')}</Text>
                            <Title as="h3" className="text-2xl font-bold text-red-900">
                                {data.urgentContacts}
                            </Title>
                        </div>
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                            <MailIcon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <ContactChart data={data} />

            {/* Recent Contacts */}
            <div className="p-6">
                <Title as="h4" className="mb-4 text-gray-800 dark:text-white">
                    {t('recentContactsCard.title')}
                </Title>
                <div className="space-y-4">
                    {data.recentContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-10 rounded-lg dark:border dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Text className="text-white font-semibold">
                                        {contact.fullName.charAt(0).toUpperCase()}
                                    </Text>
                                </div>
                                <div>
                                    <Text className="font-medium text-gray-900 dark:text-white ">
                                        {contact.fullName}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        {contact.email}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                                        {contact.phone}
                                    </Text>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                                        {contact.subject}
                                    </Text>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </Text>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        color={getStatusColor(contact.status)}
                                        className="min-w-[80px] text-center"
                                    >
                                        {getStatusLabel(contact.status)}
                                    </Badge>
                                    {contact.isUrgent && (
                                        <Badge color="danger" className="text-xs">
                                            Urgent
                                        </Badge>
                                    )}
                                </div>
                                <Link href={`/${params.locale}${routes.contact.contactDetails(contact.id.toString())}`}>
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                        <EyeIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactDashboard;
