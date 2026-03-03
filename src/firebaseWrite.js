// firebaseWrite.js
import { ref, set, push } from "firebase/database";
import { rtdb } from "./firebase";   // ⚠️ IMPORTANT — use rtdb

export const addDeviceData = async () => {
  try {
    const deviceId = "child_rahul_device";
    const parentId = "IyDnITMBowaZomMZDeDZGLgLt1N63";

    // Device location
    await set(ref(rtdb, `devices/${deviceId}`), {
      latitude: 20.00839,
      longitude: 73.75649
    });

    // Geofence
    await set(ref(rtdb, `geofence/${deviceId}`), {
      centerLat: 20.010315652180996,
      centerLon: 73.75225067138673,
      radius: 250
    });

    // Parent → Children mapping
    const childRef = push(ref(rtdb, `parents/${parentId}/children`));

    await set(childRef, {
      deviceId,
      name: "Tushar"
    });

    console.log("Data added successfully!");
  } catch (error) {
    console.error("Error adding data:", error);
  }
};

export default addDeviceData;