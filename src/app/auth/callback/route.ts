import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Esta ruta procesa un codigo de un solo uso en cada visita — nunca
// debe cachearse ni pre-renderizarse estaticamente.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  // Detras del proxy de CyberPanel, "origin" es la direccion interna
  // del contenedor (0.0.0.0:3000), no el dominio publico. Preferimos
  // la URL publica configurada; "origin" queda solo como respaldo.
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/login?error=auth_callback_failed`);
}
