import { NextRequest, NextResponse } from "next/server";

const proxy = (req: NextRequest) => {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { pathname, searchParams } = req.nextUrl;

    const expired = searchParams.get("expired");

    if (expired && pathname === "/login") {
        return NextResponse.next();
    }

    if (accessToken && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (
        !accessToken &&
        (pathname.startsWith("/dashboard") || pathname === "/pricing")
    ) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
};

export default proxy;

export const config = {
    matcher: ["/login", "/signup", "/dashboard/:path*", "/pricing"],
};
