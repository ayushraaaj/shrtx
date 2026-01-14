import Analytics from "@/components/analytics/Analytics";

const AnalyticsOverview = () => {
    return (
        <div>
            <Analytics
                fetchAnalyticsUrl="/url/analytics/overview"
                heading="Analytics Overview"
            />
        </div>
    );
};
export default AnalyticsOverview;
