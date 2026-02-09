import { off } from "process";

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

  export type DriverFormData =   {
    name: String,
    age: String,
    dob: String,
    adhaarNo: String,
    addressLine1: String,
    addressLine2: String,
    mobile1: String,
    mobile2: String,
    licenseNo: String,
    isActive: boolean,
    
  };

  export type LocationFormData = {
    id :String,
    name: String,
    code: String,
    description: String,
    districtId : String,
    isActive: String,
    
  }

  export type PartyFormData  = {

    id : String,
    name : String,
    code : String,
    gstNo : String,
    addressLine1 : String,
    addressLine2 : String,
    mobile : String,
    email : String,
    officePhone : String,
    contactPerson : String,
    pincode : String,
    accountId : String,
    isActive : String,
  } 

  export type DistrictFormData  = {
    name: String,
    code: String,
    stateId: String,
    isActive: String,
  }


  export type StateFormData  = {
    name: String,
    code: String,
    isActive: String,
  }

  