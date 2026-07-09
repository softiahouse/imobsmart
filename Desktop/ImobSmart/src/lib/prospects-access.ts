const PROSPECTS_WHITELIST = [
  "softiahouse@gmail.com",
  "layaralima250@gmail.com",
];

export function isProspectsAllowed(email: string | undefined | null): boolean {
  if (!email) return false;
  return PROSPECTS_WHITELIST.includes(email.toLowerCase());
}
