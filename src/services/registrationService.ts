import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { RegistrationFormData, VerificationResult, StoredRegistration } from '../types';

const REGISTRATIONS_COLLECTION = 'registrations';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  field?: 'idDocument' | 'phone';
  existingRecord?: StoredRegistration;
  message?: string;
}

/**
 * Normaliza y verifica si ya existe un registro con el mismo Carnet o Teléfono.
 * Compara sin distinguir mayúsculas/minúsculas en el carnet y eliminando
 * espacios, guiones y signos en los números de teléfono.
 */
export async function checkDuplicateRegistration(
  idDocument: string,
  phone: string
): Promise<DuplicateCheckResult> {
  const cleanId = idDocument.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/[\s\-\(\)\+]/g, '');

  try {
    const snapshot = await getDocs(collection(db, REGISTRATIONS_COLLECTION));
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as StoredRegistration;
      const existingId = (data.idDocument || '').trim().toLowerCase();
      const existingPhone = (data.phone || '').trim().replace(/[\s\-\(\)\+]/g, '');

      // 1. Verificar carnet de identidad único
      if (cleanId && existingId && existingId === cleanId) {
        return {
          isDuplicate: true,
          field: 'idDocument',
          existingRecord: { id: docSnap.id, ...data },
          message: `El Carnet de Identidad "${idDocument.trim()}" ya está registrado en el sistema.`,
        };
      }

      // 2. Verificar número de teléfono único
      if (cleanPhone && existingPhone && existingPhone === cleanPhone) {
        return {
          isDuplicate: true,
          field: 'phone',
          existingRecord: { id: docSnap.id, ...data },
          message: `El número de teléfono "${phone.trim()}" ya está registrado con el Gamer Tag "${data.gamerTag}".`,
        };
      }
    }

    return { isDuplicate: false };
  } catch (err) {
    console.error('Error checking duplicate in Firestore:', err);
    return { isDuplicate: false };
  }
}

export async function saveRegistrationToFirestore(
  formData: RegistrationFormData,
  verification: VerificationResult
): Promise<string> {
  try {
    const docData = {
      fullName: formData.fullName || '',
      gamerTag: formData.gamerTag.trim(),
      birthDate: formData.birthDate,
      calculatedAge: Number(verification.age),
      idDocument: formData.idDocument.trim(),
      phone: formData.phone?.trim() || '',
      favoriteGame: formData.favoriteGame,
      isAdultConfirmed: Boolean(formData.isAdultConfirmed),
      verificationCode: verification.verificationCode,
      createdAt: new Date().toISOString(),
      verifiedAtDoor: false,
    };

    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving registration to Firestore:', error);
    throw error;
  }
}

export async function fetchAllRegistrations(): Promise<StoredRegistration[]> {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const list: StoredRegistration[] = [];

    querySnapshot.forEach((d) => {
      const data = d.data() as Omit<StoredRegistration, 'id'>;
      list.push({
        id: d.id,
        ...data,
      });
    });

    return list;
  } catch (error) {
    console.error('Error fetching registrations from Firestore:', error);
    try {
      const querySnapshot = await getDocs(collection(db, REGISTRATIONS_COLLECTION));
      const list: StoredRegistration[] = [];
      querySnapshot.forEach((d) => {
        const data = d.data() as Omit<StoredRegistration, 'id'>;
        list.push({
          id: d.id,
          ...data,
        });
      });
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (fallbackError) {
      console.error('Fallback query error:', fallbackError);
      throw fallbackError;
    }
  }
}

export async function toggleVerifiedAtDoor(id: string, currentState: boolean): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await updateDoc(docRef, {
    verifiedAtDoor: !currentState,
  });
}

export async function removeRegistration(id: string): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await deleteDoc(docRef);
}
