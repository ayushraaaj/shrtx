import Link from "next/link";

const Header = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-lg">S</span>
                    </div>
                    {/* <span className="font-bold text-xl tracking-tight text-zinc-900">
                        Shrtx
                    </span> */}
                    <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                        Shrtx
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-zinc-500 hover:text-blue-600 transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
