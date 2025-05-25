import { DisplayTextRecord } from "../shared/services/translator";

export const AccessText = {
    // Denied
    ACCESS_DENIED: {
        en: "Access Denied",
        es: "Acceso Denegado"
    },
    TOO_MANY_ATTEMPTS: {
        en: "Too many failed unlock attempts",
        es: "Muchos intentos fallidos",
    },
    TRY_AGAIN_LATER: {
        en: "Try again in a few minutes",
        es: "Inténtalo de nuevo en unos minutos",
    },

    // Locked
    ENTER_PIN_TO_UNLOCK: {
        en: "Enter PIN to unlock",
        es: "Introduce tu clave para desbloquear",
    },
    incorrectPin: {
        en: (attempts: string) =>
            `Incorrect PIN entered. ${attempts} attempts remaining.`,
        es: (attempts: string) =>
            `Clave incorrecta. Quedan ${attempts} intentos.`,
    },

    // Unlocked
    BACK: {
        en: "Back",
        es: "Atrás",
    },
    UNLOCKED: {
        en: "Unlocked",
        es: "Abierto",
    },
    LOCK: {
        en: "Lock",
        es: "Cerrar"
    },
    SETTINGS: {
        en: "Settings",
        es: "Configuración",
    }
} as const satisfies DisplayTextRecord;
