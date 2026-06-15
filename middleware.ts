import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /view e /login são públicos
  if (pathname.startsWith("/view") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Verifica cookie de sessão
  const auth = request.cookies.get("auth")?.value;
  if (auth === process.env.EDITOR_PASSWORD) {
    return NextResponse.next();
  }

  // Redireciona para login
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
