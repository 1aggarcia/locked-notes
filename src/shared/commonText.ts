import { DisplayTextRecord } from "./services/translator";

export const CommonText = {
    CANCEL: {
        en: "Cancel",
        es: "Cancelar",
    },
    SUCCESS: {
        en: "Success!",
        es: "¡Éxito!",
    },
    OPERATION_CANCELLED: {
        en: "Operation Cancelled",
        es: "Operación Cancelado",
    },
    ACCESS_DENIED: {
        en: "Access to file storage was denied.",
        es: "No se autorizó acceso al sistema de archivos"
    },
} as const satisfies DisplayTextRecord;