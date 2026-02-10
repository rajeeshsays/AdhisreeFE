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
    id?:string,
    name: string,
    age: string,
    dob: string,
    adhaarNo: string,
    addressLine1: string,
    addressLine2: string,
    mobile1: string,
    mobile2: string,
    licenceNo: string,
    isActive: boolean,
    
  };

  export type LocationFormData = {
    id :string,
    name: string,
    code: string,
    description: string,
    districtId : string,
    isActive: string,
    
  }

  export type PartyFormData  = {

    id : string,
    name : string,
    code : string,
    gstNo : string,
    addressLine1 : string,
    addressLine2 : string,
    mobile : string,
    email : string,
    officePhone : string,
    contactPerson : string,
    pincode : string,
    accountId : string,
    isActive : string,
  } 

  export type DistrictFormData  = {
    name: string,
    code: string,
    stateId: string,
    isActive: string,
  }


  export type StateFormData  = {
    name: string,
    code: string,
    isActive: string,
  }

 export type Vehicle  = 
    {
        
         id : number,
       
         model : string, 
        
        registration : string,

        typeId : number

    }

    export type  VehicleType = 
    {
        id : string,
     
        desc : string,

        accountId : number

    }
