import Sidebar from "@/components/sidebar/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="relative flex-1 bg-gray-50 p-5">{children}</main>
        </div>
    );
};

export default DashboardLayout;
