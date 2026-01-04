import { UrlRef } from "@/app/interfaces/url";
import {
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
} from "recharts";

const RefClicksBardChart = ({ refs }: { refs: UrlRef[] }) => {
    return (
        <div className="h-72 text-center">
            <h2>Traffic by source (Bar Chart)</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={refs}>
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip cursor={false} />

                    <Bar
                        dataKey="clicks"
                        activeBar={{ fill: "black" }}
                        fill="gray"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefClicksBardChart;
