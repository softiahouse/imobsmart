interface ProspectUser {
  email: string;
  country: string | null;
}

const PROSPECTS_WHITELIST: ProspectUser[] = [
  { email: "softiahouse@gmail.com", country: null },
  { email: "layaralima250@gmail.com", country: "BR" },
];

export function isProspectsAllowed(email: string | undefined | null): boolean {
  if (!email) return false;
  return PROSPECTS_WHITELIST.some((u) => u.email === email.toLowerCase());
}

export function getProspectsCountryFilter(email: string | undefined | null): string | null {
  if (!email) return null;
  const user = PROSPECTS_WHITELIST.find((u) => u.email === email.toLowerCase());
  return user?.country ?? null;
}
