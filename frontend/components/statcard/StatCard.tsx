import { ReactNode } from "react";

interface Props {
    label: string;
    value: number;
    icon: ReactNode;
    color: string;
    bgColor: string;
}

const StatCard = (props: Props) => {
    const { label, value, icon, color, bgColor } = props;
    return (
        <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm flex items-center gap-5 transition-all hover:border-zinc-300">
            <div className={`p-4 ${bgColor} ${color} rounded-2xl`}>{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black text-zinc-900">
                    {value.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
