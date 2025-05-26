import { DisplayTextRecord } from "../shared/services/translator";

export const LayoutText = {
    LOADING: {
        en: "Loading",
        es: "Cargando",
    },
    FETCHING_APP_SETTINGS: {
        en: "Fetching app settings...",
        es: "Cargando configuración...",
    },
    VERIFYING_ACCESS: {
        en: "Verifying access...",
        es: "Verificando acceso...",
    },
} as const satisfies DisplayTextRecord;
