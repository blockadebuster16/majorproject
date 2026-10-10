import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTarget = requestUrl.searchParams.get('redirect') || '/chat';

  // In production Supabase setup:
  // if (code) {
  //   const supabase = createRouteHandlerClient({ cookies });
  //   await supabase.auth.exchangeCodeForSession(code);
  // }

  return NextResponse.redirect(new URL(redirectTarget, requestUrl.origin));
}
