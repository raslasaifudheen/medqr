
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalProfile {
  id: string;
  fullName: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  organDonor: boolean;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  emergencyContacts: EmergencyContact[];
  additionalNotes: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
