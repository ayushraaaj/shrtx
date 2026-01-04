import { UrlRef } from "@/app/interfaces/url";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const COLORS: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    twitter: "#1DA1F2",
    whatsapp: "#25D366",
};

const RefClicksPieChart = ({ refs }: { refs: UrlRef[] }) => {
    const totalClicks = refs.reduce((sum, ref) => sum + ref.clicks, 0);

    const renderLegendText = (source: string, value: any) => {
        return `${source} (${value.payload.clicks})`;
    };

    return (
        <div className="h-72 text-center">
            <h2>Traffic distribution (Pie Chart)</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={refs}
                        dataKey="clicks"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={70}
                        paddingAngle={2}
                        stroke="none"
                    >
                        {refs.map((ref) => (
                            <Cell key={ref.source} fill={COLORS[ref.source]} />
                        ))}
                    </Pie>

                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        <tspan>{totalClicks}</tspan>
                        <tspan
                            x="50%"
                            dy="1.4em"
                            className="text-xs fill-zinc-500"
                        >
                            Total Clicks
                        </tspan>
                    </text>
                    <Legend formatter={renderLegendText} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefClicksPieChart;
