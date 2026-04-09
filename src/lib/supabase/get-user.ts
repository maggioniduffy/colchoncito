import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export type UserDisplay = {
  email: string;
  nombre: string;
  iniciales: string;
  avatarUrl: string | null;
};

export function toDisplayUser(user: {
  email?: string | null;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
}): UserDisplay {
  const email = user.email ?? "";
  const fullName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? email;
  const nombre = fullName.split(" ")[0] || email.split("@")[0];
  const iniciales = fullName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    email,
    nombre,
    iniciales,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}
