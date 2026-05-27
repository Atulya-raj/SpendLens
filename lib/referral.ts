/**
 * Simple referral code generator.
 * Generates a short, memorable referral code from an audit ID.
 * In a production system this would be stored in the database.
 */
export function generateReferralCode(auditId: string): string {
  // Take first 6 chars of auditId and prefix with 'SL-'
  return `SL-${auditId.slice(0, 6).toUpperCase()}`;
}

export function getReferralUrl(auditId: string): string {
  const code = generateReferralCode(auditId);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://spend-lens-xi.vercel.app';
  return `${baseUrl}?ref=${code}`;
}
