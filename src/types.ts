export interface RegistrationFormData {
  fullName: string;
  gamerTag: string;
  birthDate: string; // YYYY-MM-DD
  idDocument: string; // Carnet de identidad / DNI
  phone?: string;
  favoriteGame: string;
  isAdultConfirmed: boolean; // "Confirmo que soy mayor de 18 años"
}

export interface VerificationResult {
  age: number;
  isAdult: boolean;
  birthDateFormatted: string;
  timestamp: string;
  verificationCode: string;
}

export interface StoredRegistration {
  id?: string;
  fullName: string;
  gamerTag: string;
  birthDate: string;
  calculatedAge: number;
  idDocument: string;
  phone?: string;
  favoriteGame: string;
  isAdultConfirmed: boolean;
  verificationCode: string;
  createdAt: string;
  verifiedAtDoor?: boolean;
}
