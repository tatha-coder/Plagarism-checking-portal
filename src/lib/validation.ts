/**
 * Email validation utility
 * Validates that an email address has a standard local part, an @ symbol,
 * a domain name, and at least a 2-character top-level domain.
 * 
 * Correctly rejects:
 * - 'abc'
 * - 'abc@'
 * - 'abc@com' (missing proper domain dot structure)
 * - 'test@'
 * - 'random strings'
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Requires: [valid characters] @ [valid domain label(s)] . [at least 2 letters TLD]
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}
