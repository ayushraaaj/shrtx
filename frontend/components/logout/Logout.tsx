import { useLogout } from "@/app/hooks/useLogout";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

interface Props {
    logoutResponse(message: string): void;
}

const Logout = () => {
    const logout = useLogout();

    return (
        <div>
            <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group cursor-pointer"
            >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 text-zinc-300 group-hover:text-red-600" />
                Logout
            </button>
        </div>
    );
};

export default Logout;
