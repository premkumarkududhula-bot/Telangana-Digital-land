
export interface Transaction {
  id: string;
  slotId: number;
  buyerName: string;
  sellerName: string;
  amount: number;
  timestamp: number;
}

export interface AdminProfile {
  name: string;
  mobile: string;
  account: string;
  ifsc: string;
}

export interface LandSlot {
  id: number;
  parentId?: number;
  districtName: string;
  currentPrice: number;
  ownerName: string;
  mobileNumber: string;
  upiId: string;
  history: Transaction[];
  isExpanded?: boolean;
}

export interface AppState {
  slots: LandSlot[];
  transactions: Transaction[];
  totalAdminRevenue: number;
  adminProfile?: AdminProfile;
}

export enum ViewMode {
  MARKETPLACE = 'marketplace',
  MY_ASSETS = 'my_assets'
}
