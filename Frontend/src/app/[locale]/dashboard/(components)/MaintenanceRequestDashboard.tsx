'use client';

import { useEffect, useState } from 'react';
import { getMaintenanceRequestDashboard } from '@/utils/api';
import { MaintenanceRequestDashboardData } from '@/types/maintenanceRequest';
import { Title } from 'rizzui';
import { BsTools } from 'react-icons/bs';
import MaintenanceRequestChart from './MaintenanceRequestChart';
import { useTranslations } from 'next-intl';

export default function MaintenanceRequestDashboard() {
    const [dashboardData, setDashboardData] = useState<MaintenanceRequestDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('DashboardPage.maintenanceRequestAnalytics')
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getMaintenanceRequestDashboard();
                if (response.succeeded) {
                    setDashboardData(response.data);
                } else {
                    setError(response.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error('Error fetching maintenance request dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200 animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                <div className="text-center text-red-600 dark:text-red-400">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return null;
    }

    const stats = [
        {
            title: t('cards.totalRequests'),
            value: dashboardData.totalRequests,
            icon: BsTools,
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            title: t('cards.thisMonth'),
            value: dashboardData.requestsThisMonth,
            icon: BsTools,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-500'
        },
        {
            title: t('cards.pending'),
            value: dashboardData.pending,
            icon: BsTools,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500'
        },
        {
            title: t('cards.inProgress'),
            value: dashboardData.inProgress,
            icon: BsTools,
            color: 'bg-orange-500',
            textColor: 'text-orange-500'
        },
        {
            title: t('cards.resolved'),
            value: dashboardData.resolved,
            icon: BsTools,
            color: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            title: t('cards.rejected'),
            value: dashboardData.rejected,
            icon: BsTools,
            color: 'bg-red-500',
            textColor: 'text-red-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title as="h6" className="text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </Title>
                                <Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </Title>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Status Chart */}
                <MaintenanceRequestChart data={dashboardData} />
                {/* Summary Card */}
                <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                    <Title as="h5" className="mb-4 text-gray-900 dark:text-white">
                        {t('maintenanceRequestSummaryCard.title')}
                    </Title>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-blue-900 dark:text-blue-200">{t('maintenanceRequestSummaryCard.content.totalRequests')}</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardData.totalRequests}</span>
                        </div>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-yellow-900 dark:text-yellow-200">{t('maintenanceRequestSummaryCard.content.pending')}</span>
                            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{dashboardData.pending}</span>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-green-900 dark:text-green-200">{t('maintenanceRequestSummaryCard.content.resolved')}</span>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardData.resolved}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
