

export type TransportEntryFormData = {
  id: number;
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
    id?:number,
    name: string,
    age: string,
    dob: string | undefined,
    adhaarNo: string,
    addressLine1: string,
    addressLine2: string,
    mobile1: string,
    mobile2: string,
    licenceNo: string,
    isActive: boolean,
    
  };

  export type LocationFormData = {
    id :number,
    name: string,
    code: string,
    description: string,
    districtId : string,
    isActive: boolean,
    
  }

  export type PartyFormData  = {

    id : number,
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
    isActive : boolean,
  } 

  export type DistrictFormData  = {
    name: number,
    code: string,
    stateId: string,
    isActive: boolean,
  }


  export type StateFormData  = {
    name: number,
    code: string,
    isActive: boolean,
  }


   export type VehicleFormData  = {
         id : number,     
         model : string, 
         registration : string,
         typeId : number,
         isActive : boolean
    }

    export type  VehicleTypeFormData = {
        id : number,
        desc : string,
        isActive : boolean,

    }
