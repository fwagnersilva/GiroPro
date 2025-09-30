import { useToast } from "../components/ToastNotification";

interface Vehicle {
  id: string;
  make: string;
  model: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() > 0.5; // Simula falha 50% das vezes
      if (shouldFail) {
        reject(new Error("Falha ao carregar veículos. Tente novamente mais tarde."));
      } else {
        resolve([
          { id: "1", make: "Toyota", model: "Corolla" },
          { id: "2", make: "Honda", model: "Civic" },
        ]);
      }
    }, 1000);
  });
};


