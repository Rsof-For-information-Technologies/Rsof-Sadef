'use client';

import { useEffect, useState } from 'react';
import { getPropertyDashboard } from '@/utils/api';
import { PropertyDashboardData } from '@/types/property';
import { Title } from 'rizzui';
import { BsBuilding } from 'react-icons/bs';

export default function PropertyDashboard() {
    const [dashboardData, setDashboardData] = useState<PropertyDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getPropertyDashboard();
                if (response.succeeded) {
                    setDashboardData(response.data);
                } else {
                    setError(response.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error('Error fetching property dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
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
            title: 'Total Properties',
            value: dashboardData.totalProperties,
            icon: BsBuilding,
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        {
            title: 'Active Properties',
            value: dashboardData.activeProperties,
            icon: BsBuilding,
            color: 'bg-green-500',
            textColor: 'text-green-500'
        },
        {
            title: 'Expired Properties',
            value: dashboardData.expiredProperties,
            icon: BsBuilding,
            color: 'bg-red-500',
            textColor: 'text-red-500'
        },
        {
            title: 'Pending',
            value: dashboardData.pendingCount,
            icon: BsBuilding,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500'
        },
        {
            title: 'Approved',
            value: dashboardData.approvedCount,
            icon: BsBuilding,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500'
        },
        {
            title: 'Sold',
            value: dashboardData.soldCount,
            icon: BsBuilding,
            color: 'bg-purple-500',
            textColor: 'text-purple-500'
        },
        {
            title: 'Rejected',
            value: dashboardData.rejectedCount,
            icon: BsBuilding,
            color: 'bg-red-600',
            textColor: 'text-red-600'
        },
        {
            title: 'Archived',
            value: dashboardData.archivedCount,
            icon: BsBuilding,
            color: 'bg-gray-500',
            textColor: 'text-gray-500'
        }
    ];

    // Format currency values
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Unit category chart data
    const unitCategoryData = Object.entries(dashboardData.unitCategoryCounts)
        .filter(([key, value]) => key !== '' && value > 0)
        .sort(([, a], [, b]) => b - a);

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
                {/* Unit Category Chart */}
                <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                    <Title as="h5" className="mb-4 text-gray-900 dark:text-white">
                        Unit Categories
                    </Title>
                    
                    <div className="space-y-4">
                        {unitCategoryData.map(([category, count], index) => {
                            const percentage = dashboardData.totalProperties > 0 ? (count / dashboardData.totalProperties) * 100 : 0;
                            const colors = [
                                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
                                '#F97316', '#84CC16', '#EC4899', '#6366F1', '#14B8A6', '#F59E0B',
                                '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899'
                            ];
                            const color = colors[index % colors.length];
                            
                            return (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-4 h-4 rounded-full" 
                                            style={{ backgroundColor: color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${percentage}%`,
                                                    backgroundColor: color 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Financial Summary */}
                <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
                    <Title as="h5" className="mb-4 text-gray-900 dark:text-white">
                        Financial Overview
                    </Title>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-medium text-blue-900 dark:text-blue-200">Total Expected Annual Rent</h4>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(dashboardData.totalExpectedAnnualRent)}
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h4 className="font-medium text-green-900 dark:text-green-200">Total Projected Resale Value</h4>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(dashboardData.totalProjectedResaleValue)}
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <h4 className="font-medium text-purple-900 dark:text-purple-200">Properties with Investment Data</h4>
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                {dashboardData.propertiesWithInvestmentData}
                            </p>
                        </div>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <h4 className="font-medium text-yellow-900 dark:text-yellow-200">Listed This Week</h4>
                            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                {dashboardData.listedThisWeek}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 