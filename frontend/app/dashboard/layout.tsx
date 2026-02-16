import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/sidebar/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="relative flex-1 bg-gray-50 p-5">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardLayout;
