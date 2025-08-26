'use client';

import { useEffect, useState } from 'react';
import { getLeadDashboard } from '@/utils/api';
import { LeadDashboardData } from '@/types/lead';
import { Title } from 'rizzui';
import { BsPerson } from 'react-icons/bs';
import LeadChart from './LeadChart';
import { useTranslations } from 'next-intl';

export default function LeadDashboard() {
    const [dashboardData, setDashboardData] = useState<LeadDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('Dashboard.leadAnalytics')

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getLeadDashboard();
                if (response.succeeded) {
                    setDashboardData(response.data);
                } else {
                    setError(response.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error('Error fetching lead dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            title: t('cards.totalLeads'),
            value: dashboardData.totalLeads,
            icon: BsPerson,
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            title: t('cards.leadsThisMonth'),
            value: dashboardData.leadsThisMonth,
            icon: BsPerson,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-500'
        },
        {
            title: t('cards.activeLeads'),
            value: dashboardData.activeLeads,
            icon: BsPerson,
            color: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            title: t('cards.newLeads'),
            value: dashboardData.newLeads,
            icon: BsPerson,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500'
        },
        {
            title: t('cards.contacted'),
            value: dashboardData.contacted,
            icon: BsPerson,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500'
        },
        {
            title: t('cards.inDiscussion'),
            value: dashboardData.inDiscussion,
            icon: BsPerson,
            color: 'bg-orange-500',
            textColor: 'text-orange-500'
        },
        {
            title: t('cards.visitScheduled'),
            value: dashboardData.visitScheduled,
            icon: BsPerson,
            color: 'bg-teal-500',
            textColor: 'text-teal-500'
        },
        {
            title: t('cards.converted'),
            value: dashboardData.converted,
            icon: BsPerson,
            color: 'bg-purple-500',
            textColor: 'text-purple-500'
        },
        {
            title: t('cards.rejected'),
            value: dashboardData.rejected,
            icon: BsPerson,
            color: 'bg-red-500',
            textColor: 'text-red-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                {/* Lead Distribution Chart */}
                <LeadChart data={dashboardData} />
                {/* Summary Card */}
                <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                    <Title as="h5" className="mb-4 text-gray-900 dark:text-white">
                        {t('leadSummaryCard.title')}
                    </Title>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-blue-900 dark:text-blue-200">{t('leadSummaryCard.content.totalLeads')}</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardData.totalLeads}</span>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-green-900 dark:text-green-200">{t('leadSummaryCard.content.activeLeads')}</span>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardData.activeLeads}</span>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
                            <span className="font-bold text-lg text-purple-900 dark:text-purple-200">{t('leadSummaryCard.content.converted')}</span>
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dashboardData.converted}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
