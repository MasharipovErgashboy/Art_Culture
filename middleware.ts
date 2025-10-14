import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is just "/"
  if (pathname === "/") {
    // Redirect to /uz (default language)
    return NextResponse.redirect(new URL("/uz", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/",
}
