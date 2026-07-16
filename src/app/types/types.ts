

export type InvoiceDetail = {
  invoiceNo: string;
  date: string;
  amount: string;
};
export type UnLoadingCharge = {
  tripId : string,
  destinationId : string,
  amount : number,

}
export type TripEntryPayload = {
  id?: number;
  date: string;
  vehicleId: string;
  vehicleTypeId: string;
  driverId: string;
  party1: string;
  from: string;
  to: string;
  startKM: string;
  closeKM: string;
  total: string;
  rent : string,
  commission: string;
  payabletoThirdParty : string;
  haltDays : string;
  invoiceDetails: InvoiceDetail[];
  returnTrip : string;
  unloadingCharges: UnLoadingCharge[],
  destinationGroup : DestinationGroup[],
  remark : string;
};

export type TripSavePayload = {
  tripEntry: TripEntryPayload;
  destinationGroup: { destinationIds: number[] };
  invoices: { invoiceNo: string; date: string; amount: number }[];
  unloadingCharges: { destinationId: number; amount: number }[];
};

export type TripEntryFormData = {
  id?: number;
  date: string;
  vehicleId: string;
  vehicleTypeId: string;
  driverId: string;
  party1: string;
  from: string;
  to: string;
  fromText : string;
  toText : string;
  startKM: string;
  closeKM: string;
  total: string;
  rent : string,
  commission: string;
  payabletoThirdParty : string;
  haltDays : string;
  invoiceDetails: InvoiceDetail[];
  returnTrip : string;
  unloadingCharges: UnLoadingCharge[],
  destinationGroup : string[],
  remark : string;
};

export type DestinationGroup = {
  id : string,
  destinationId : string,
  tripId : string,


}
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
    transportTypeId :string,
  };
  export type DriverLedgerFormData =   {
    id?:number,
    transactionDate : string,
    paymentType : string,
    driverId : number,
    amount : number,
    originalBalance : number,
    balance : number,
    remarks : string,
  };
  export type DriverLedgerActualData =   {
    id?:number,
    driverId : number,
    driver: DriverFormData | null,
    transactionDate : string,
    debit : number,
    credit : number,
    remarks : string,
  };

export type DieselLogFormData = {
  id?: number;                // optional, for new entries
  vehicleId: number;    
  driverId : number;      // reference to Vehicle
  date: string;               // DateOnly from C# → ISO string
  quantity: number;           // decimal → number
  pricePerUnit: number;       // decimal → number
  sourceId: number;           // reference to Party
  odometerReading: number;    // int → number
  totalCost: number;          // decimal → number
  remarks?: string;           // optional string
};

export type VehicleAlertFormData = {
  id?: number;                 // optional for new entries
  vehicleId: number;           // reference to Vehicle
  emi: number;                 // decimal → number
  emiDueDate: string;          // DateOnly → string YYYY-MM-DD
  emiDaysLeft: number;
  insuranceExpiry: string;     // DateOnly → string
  insuranceDaysLeft: number;
  insuranceStatus: number;
  pollutionExpiry: string;     // DateOnly → string
  pollutionDaysLeft: number;
  pollutionStatus: number;
  fuelStationName?: string;    // optional
  remarks?: string;            // optional
};

export type VehicleMaintenanceFormData ={
    id?: number;
    vehicleId: number;
    driverId: number;
    maintenanceDate: string; // ISO Date string
    kilometers: number;
    cost: number;
    description: string;
}



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
    locationId : string,
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

  export type UnloadingChargeData = {
    id?: number,
    destinationId: number,
    tripId: number,
    amount: number,
    tripEntry?: {
      id: number,
      date: string,
      driverId?: number,
      driver?: { id?: number, name: string } | null,
      vehicle?: { model?: string, registration?: string } | null,
    } | null,
    destination?: { id?: number, name: string } | null,
  }

  export type InvoiceData = {
    id?: number,
    destinationId: number,
    tripId: number,
    invoiceNo: string,
    date: string,
    amount: number,
    tripEntry?: {
      id: number,
      date: string,
      driverId?: number,
      driver?: { id?: number, name: string } | null,
      vehicle?: { model?: string, registration?: string } | null,
    } | null,
    destination?: { id?: number, name: string } | null,
  }
