import { UrlRef } from "@/app/interfaces/url";
import RefClicksBarChart from "./RefClicksBarChart";
import RefClicksPieChart from "./RefClicksPieChart";

interface Props {
    refs: UrlRef[];
}

const ChartsCard = (props: Props) => {
    const { refs } = props;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-800 mb-6 flex items-center gap-2">
                    Traffic Share
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        By Source
                    </span>
                </h3>
                <div className="flex justify-center h-[300px]">
                    <RefClicksPieChart refs={refs} />
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-800 mb-6 flex items-center gap-2">
                    Source Performance
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Click Count
                    </span>
                </h3>
                <div className="h-[300px]">
                    <RefClicksBarChart refs={refs} />
                </div>
            </div>
        </div>
    );
};

export default ChartsCard;
