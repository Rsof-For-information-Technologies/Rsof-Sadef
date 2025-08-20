import React from 'react';
import { Title } from 'rizzui';
import { ContactDashboardStats } from '@/types/contact';
import { useTranslations } from 'next-intl';
interface ContactChartProps {
  data: ContactDashboardStats;
}

const ContactChart: React.FC<ContactChartProps> = ({ data }) => {
  const t = useTranslations('DashboardPage.contactAnalytics')
  // Calculate percentages for the pie chart
  const totalByType = Object.values(data.contactsByType).reduce((sum, count) => sum + count, 0);
  const totalByStatus = Object.values(data.contactsByStatus).reduce((sum, count) => sum + count, 0);

  const typeData = Object.entries(data.contactsByType).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: totalByType > 0 ? ((count / totalByType) * 100).toFixed(1) : '0'
  }));

  const statusData = Object.entries(data.contactsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: totalByStatus > 0 ? ((count / totalByStatus) * 100).toFixed(1) : '0'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Types Chart */}
      <div className="p-6">
        <Title as="h4" className="mb-4 text-gray-800 dark:text-white">
          {t('contactsbyTypeCard.title')}
        </Title>
        <div className="space-y-4">
          {typeData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: [
                      '#3B82F6', // Blue
                      '#10B981', // Green
                      '#F59E0B', // Yellow
                      '#EF4444', // Red
                      '#8B5CF6', // Purple
                    ][index % 5]
                  }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Status Chart */}
      <div className="p-6">
        <Title as="h4" className="mb-4 text-gray-800 dark:text-white">
          {t('contactsbyStatusCard.title')}
        </Title>
        <div className="space-y-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: [
                      '#F59E0B', // Warning (New)
                      '#3B82F6', // Info (Contacted)
                      '#10B981', // Success (Responded)
                      '#EF4444', // Danger (Cancelled)
                      '#6B7280', // Secondary (Spam)
                    ][index % 5]
                  }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactChart;
