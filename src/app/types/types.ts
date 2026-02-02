export type TransportEntryFormData = {
  id: string;
  date: string;
  vehicleId: string;
  vehicleTypeId: string;
  driverId: string;
  party1: string;
  destinationGroups: string[];
  from: string;
  to: string;
  startKM: string;
  closeKM: string;
  total: string;
  loading: string;
  unloading: string;
  loadingCommision: string;
  unloadingCommision: string;
};

  export interface DriverFormData  {
    name: String,
    age: String,
    dob: String,
    adhaarNo: String,
    addressLine1: String,
    addressLine2: String,
    mobile1: String,
    mobile2: String,
    licenseNo: String,
    isActive: String,
    
  }
