"use client";
import Analytics from "@/components/analytics/Analytics";
import { useParams } from "next/navigation";

const GroupUrlsAnalytics = () => {
    const { groupId } = useParams();

    return (
        <div>
            <Analytics fetchAnalyticsUrl={`/group/analytics/${groupId}`} heading="Group Analytics" />
        </div>
    );
};

export default GroupUrlsAnalytics;
