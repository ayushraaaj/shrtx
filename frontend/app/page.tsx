import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-6 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-semibold">
                    Now with real-time tracking
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-zinc-900">
                    Simplify your{" "}
                    <span className="text-blue-600">online presence.</span>
                </h1>

                <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                    The simple, fast, and open-source URL shortener. Built for
                    developers who care about speed and clean aesthetics.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link
                        href="/signup"
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/demo"
                        className="px-8 py-3.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-semibold rounded-xl transition-all"
                    >
                        View Demo
                    </Link>
                </div>

                <p className="mt-12 text-zinc-400 text-sm font-medium italic">
                    Join 2,000+ users shortening links every day.
                </p>
            </main>

            <Footer />
        </div>
    );
}
