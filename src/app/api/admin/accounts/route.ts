import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin";
import { toErrorResponse } from "@/lib/auth/account";

let _adminClient: ReturnType<typeof createAdminClient> | null = null;
function supabaseAdmin() {
  if (!_adminClient) {
    _adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _adminClient;
}

export async function POST(request: Request) {
  try {
    await requirePlatformAdmin();

    const body = (await request.json().catch(() => null)) as {
      company_name?: string;
      owner_email?: string;
    } | null;

    const companyName = body?.company_name?.trim();
    const ownerEmail = body?.owner_email?.trim();

    if (!companyName || !ownerEmail) {
      return NextResponse.json(
        { error: "company_name y owner_email son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin().auth.admin.inviteUserByEmail(
      ownerEmail,
      { data: { full_name: companyName } }
    );

    if (error) {
      console.error('[admin/accounts] inviteUserByEmail error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: error.message,
          status: error.status ?? null,
          name: error.name ?? null,
          code: error.code ?? null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, user_id: data.user?.id });
  } catch (err) {
    return toErrorResponse(err);
  }
}
