const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function validateParola(parola: string): boolean {
  return parola.length >= 8;
}
