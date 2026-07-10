interface ProspectUser {
  email: string;
  country: string | null;
  state: string | null;
}

const PROSPECTS_WHITELIST: ProspectUser[] = [
  { email: "softiahouse@gmail.com", country: null, state: null },
  { email: "layaralima250@gmail.com", country: "BR", state: "RS" },
  { email: "samuel270905lima@gmail.com", country: "BR", state: "SC" },
];

export function isProspectsAllowed(email: string | undefined | null): boolean {
  if (!email) return false;
  return PROSPECTS_WHITELIST.some((u) => u.email === email.toLowerCase());
}

export function getProspectsFilter(email: string | undefined | null): { country: string | null; state: string | null } {
  if (!email) return { country: null, state: null };
  const user = PROSPECTS_WHITELIST.find((u) => u.email === email.toLowerCase());
  return { country: user?.country ?? null, state: user?.state ?? null };
}
