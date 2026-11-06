export type UserRole =
  | "SUPER_ADMIN"
  | "DISTRICT_OFFICER"
  | "CENTRE_MANAGER"
  | "TRAINER"
  | "STUDENT";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  centreId?: string | null;
  district?: string | null;
  state?: string | null;
}

export interface CentreSummary {
  id: string;
  code: string;
  name: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  capacity: number;
  complianceScore: number;
  complianceGrade: string;
  status: string;
  activeBatchesCount?: number;
  totalStudentsCount?: number;
  openAlertsCount?: number;
}
