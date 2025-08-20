import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { Title } from "rizzui";
import LeadDashboard from "./(components)/LeadDashboard";
import MaintenanceRequestDashboard from "./(components)/MaintenanceRequestDashboard";
import PropertyDashboard from "./(components)/PropertyDashboard";
import ContactDashboard from "./(components)/ContactDashboard";
import { useTranslations } from "next-intl";

const Dashboard = () => {
    const t = useTranslations('DashboardPage')
    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-8">
                    <Title as="h2" className="text-gray-900 dark:text-white">
                        {t('title')}
                    </Title>
                    {/* Property Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            {t('propertyAnalytics.title')}
                        </Title>
                        <PropertyDashboard />
                    </div>

                    {/* Lead Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            {t('leadAnalytics.title')}
                        </Title>
                        <LeadDashboard />
                    </div>

                    {/* Maintenance Request Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            {t('maintenanceRequestAnalytics.title')}
                        </Title>
                        <MaintenanceRequestDashboard />
                    </div>

                    {/* Contact Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            {t('contactAnalytics.title')}
                        </Title>
                        <ContactDashboard />
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}

export default Dashboard;

