import { DisplayTextRecord } from "../shared/services/translator";

export const SettingsText = {
    unlockedTimeTooSmall: {
        en: (minimum: string) =>
            `Unlocked time must be at least ${minimum} seconds`,
        es: (minimum: string) =>
            `Tiempo desbloqueado debe ser al menos ${minimum} segundos`,
    },
    unlockedTimeTooLarge: {
        en: (maximum: string) =>
            `Unlocked time must be at most ${maximum} seconds`,
        es: (maximum: string) =>
            `Tiempo desbloqueado no puede ser más de ${maximum} segundos`,
    },
    LOADING_SETTINGS: {
        en: "Loading settings...",
        es: "Cargando configuración...",
    },
    SETTINGS: {
        en: "Settings",
        es: "Configuración",
    },
    DARK_MODE: {
        en: "Dark mode",
        es: "Modo oscuro",
    },
    LOW_CONTRAST: {
        en: "Low Contrast",
        es: "Bajo Contraste",
    },
    UNLOCKED_TIME: {
        en: "Unlocked Time (seconds)",
        es: "Tiempo desbloqueado (segundos)"
    },
    RESET: {
        en: "Reset",
        es: "Cambiar",
    },
    EXPORT_CONFIRMATION_TITLE: {
        en: "Export all notes?",
        es: "¿Exportar todas las notas?",
    },
    EXPORT_CONFIRMATION_MESSAGE: {
        en: "This will copy all encrypted note files"
            + " into the directory that you choose.",
        es: "Se copiará todos los archivos encriptados"
            + " de notas al directorio que eliges.",
    },
    ALL_NOTES_EXPORTED: {
        en: "All notes successfully exported.",
        es: "Todas las notas fueron exportadas con éxito.",
    },
    APP_DATA: {
        en: "App Data",
        es: "Datos de App",
    },
    EXPORT_ALL_NOTES: {
        en: "Export All Notes",
        es: "Exportar todas las notas"
    },
    SAVE: {
        en: "Save",
        es: "Guardar",
    },
    UNSAVED_CHANGES: {
        en: "You have unsaved changes",
        es: "Hay cambios no guardados"
    },
    VERIFICATION_FAILED: {
        en: "Verification Failed",
        es: "Verificación Fallado"
    },
    WRONG_PIN_ENTERED: {
        en: "Wrong PIN entered",
        es: "Se introdujo el PIN incorrecto",
    },
    NEW_PIN_SAVED: {
        en: "Your new PIN was saved",
        es: "Tu nuevo PIN fue guardado"
    },
    CONFIRM_SAVED_PIN: {
        en: "Confirm Saved PIN",
        es: "Confirmar tu PIN actual",
    },
    CREATE_A_NEW_PIN: {
        en: "Create a New PIN",
        es: "Crear un PIN Nuevo",
    },
    PINS_DID_NOT_MATCH: {
        en: "The PINs entered did not match. Please try again.",
        es: "Los PINs introducidos no se coincidieron."
            + " Por favor, inténtalo otra vez."
    },
    CONFIRM_PIN: {
        en: "Confirm PIN",
        es: "Confirmar el PIN",
    },
} as const satisfies DisplayTextRecord;
