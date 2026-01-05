"use client";
import { UrlRef } from "@/app/interfaces/url";
import {
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
    CartesianGrid,
} from "recharts";

const RefClicksBarChart = ({ refs }: { refs: UrlRef[] }) => {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={refs}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f4f4f5"
                    />

                    <XAxis
                        dataKey="source"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "#a1a1aa",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "#a1a1aa",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    />

                    <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                            {payload[0].payload.source}
                                        </p>
                                        <p className="text-sm font-bold text-white">
                                            {payload[0].value}{" "}
                                            <span className="text-blue-400">
                                                Clicks
                                            </span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Bar
                        dataKey="clicks"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                        activeBar={{ fill: "#1e40af" }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefClicksBarChart;
