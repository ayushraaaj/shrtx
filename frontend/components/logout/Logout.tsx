import { useLogout } from "@/lib/useLogout";

interface Props {
    logoutResponse(message: string): void;
}

const Logout = (props: Props) => {
    const { logoutResponse } = props;

    const logout = useLogout();

    const onLogout = async() => {
        const res = await logout();
        logoutResponse(res.message);
    };

    return (
        <div>
            <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer active:scale-95"
                onClick={onLogout}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                </svg>
                Logout
            </button>
        </div>
    );
};

export default Logout;
