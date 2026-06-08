import { VehicleMaintenanceFormData } from "../types/types";
import { baseUrl } from "../configs/apiConfig";


// Get all maintenance records
export async function getAll() {
    const response = await fetch(`${baseUrl}/api/vehicleMaintenance/getall`);

    return response;
}


// Get maintenance by Id
export async function get(
    id: number
) {
    const response = await fetch(`${baseUrl}/api/vehicleMaintenance/getbyid/${id}`);

return response;
}
// // Get maintenance by Vehicle
// export async function getVehicleMaintenanceByVehicle(
//     vehicleId: number
// ) {
//     const response = await fetch(`${API_URL}/Vehicle/${vehicleId}`);

    
//     return response;
// }

// Create maintenance record
export async function create(
    data: VehicleMaintenanceFormData
) {
    const response = await fetch(`${baseUrl}/api/vehicleMaintenance/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

   

    return response;
}

// Update maintenance record
export async function update(
    id: number,
    data: VehicleMaintenanceFormData
) {
    const response = await fetch(`${baseUrl}/api/vehicleMaintenance/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

 return response;
}


// Delete maintenance record
export async function remove(
    id: number
) {
    const response = await fetch(`${baseUrl}/api/vehicleMaintenance/delete/${id}`, {
        method: "DELETE",
    });

return response;
}

