"use client";
import { UrlRef } from "@/app/interfaces/url";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const BRAND_COLORS: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    twitter: "#1DA1F2",
    whatsapp: "#25D366",
    direct: "#71717a",
};

const RefClicksPieChart = ({ refs }: { refs: UrlRef[] }) => {
    const totalClicks = refs.reduce((sum, ref) => sum + ref.clicks, 0);

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                            {payload[0].name}
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

                    <Pie
                        data={refs}
                        dataKey="clicks"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={80}
                        paddingAngle={4}
                        stroke="none"
                        animationBegin={0}
                        animationDuration={1200}
                    >
                        {refs.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={BRAND_COLORS[entry.source.toLowerCase()]}
                                className="outline-none focus:outline-none"
                            />
                        ))}
                    </Pie>

                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none"
                    >
                        <tspan
                            x="50%"
                            dy="-0.2em"
                            fontSize={20}
                            fontWeight={700}
                            className="fill-zinc-900"
                        >
                            {totalClicks}
                        </tspan>
                        <tspan
                            x="50%"
                            dy="1.5em"
                            fontSize={10}
                            fontWeight={700}
                            className="fill-zinc-400 uppercase tracking-widest"
                        >
                            Total Clicks
                        </tspan>
                    </text>

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        content={({ payload }) => (
                            <div className="flex justify-center gap-4 mt-4">
                                {payload?.map((entry: any, index: number) => (
                                    <div
                                        key={`item-${index}`}
                                        className="flex items-center gap-1.5"
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: entry.color,
                                            }}
                                        />
                                        <span className="text-[12px] font-bold text-zinc-500 capitalize">
                                            {entry.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefClicksPieChart;
