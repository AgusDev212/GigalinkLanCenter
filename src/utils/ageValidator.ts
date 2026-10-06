/**
 * Age calculation and validation utilities
 */

export function calculateAge(birthDateString: string): number | null {
  if (!birthDateString) return null;
  
  const birthDate = new Date(birthDateString + 'T00:00:00');
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function isStrictlyAdult(birthDateString: string): boolean {
  const age = calculateAge(birthDateString);
  return age !== null && age >= 18;
}

export function formatReadableDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function generateVerificationCode(gamerTag: string): string {
  const cleanTag = (gamerTag || 'GAMER').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GL-${cleanTag}-${randomSuffix}`;
}
