import { NextRequest, NextResponse } from "next/server";

const supportedLocales = new Set([
  "fa",
  "ar",
  "es",
  "zh-CN",
  "pt-BR",
  "fr",
  "de",
  "ja",
  "hi",
  "ru",
  "id",
  "ko",
  "zh-TW",
  "it",
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const parts = url.pathname.split("/");
  const firstSegment = parts[1];

  if (firstSegment === "en") {
    url.pathname = "/" + parts.slice(2).join("/");
    return NextResponse.redirect(url, 308);
  }

  // A rewrite may re-enter middleware with the locale prefix already removed.
  // Preserve the forwarded locale instead of silently resetting that request to English.
  const forwardedLocale = request.headers.get("x-gaget-locale");
  const locale = supportedLocales.has(firstSegment)
    ? firstSegment
    : supportedLocales.has(forwardedLocale ?? "")
      ? forwardedLocale!
      : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-gaget-locale", locale);

  if (supportedLocales.has(firstSegment)) {
    url.pathname = "/" + parts.slice(2).join("/");
    if (url.pathname === "") url.pathname = "/";

    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
