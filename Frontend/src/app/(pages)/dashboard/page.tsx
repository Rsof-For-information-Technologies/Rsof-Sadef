import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { Title } from "rizzui";
import LeadDashboard from "./(components)/LeadDashboard";
import MaintenanceRequestDashboard from "./(components)/MaintenanceRequestDashboard";
import PropertyDashboard from "./(components)/PropertyDashboard";

const Dashboard = () => {
    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-8">
                    <Title as="h2" className="text-gray-900 dark:text-white">
                        Dashboard
                    </Title>
                    
                    {/* Property Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            Property Analytics
                        </Title>
                        <PropertyDashboard />
                    </div>

                    {/* Lead Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            Lead Analytics
                        </Title>
                        <LeadDashboard />
                    </div>

                    {/* Maintenance Request Dashboard */}
                    <div>
                        <Title as="h3" className="mb-4 text-gray-800 dark:text-white">
                            Maintenance Request Analytics
                        </Title>
                        <MaintenanceRequestDashboard />
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}

export default Dashboard;

