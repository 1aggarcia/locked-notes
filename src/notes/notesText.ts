import { DisplayTextRecord } from "../shared/services/translator";

export const NotesText = {
    FETCHING_NOTES: {
        en: "Fetching notes...",
        es: "Cargando notas...",
    },
    NO_NOTES_YET: {
        en: "No Notes Yet",
        es: "Aún no hay notas",
    },
    MODIFIED: {
        en: "Modified",
        es: "Modificado",
    },
    DELETE: {
        en: "Delete",
        es: "Borrar",
    },
    DELETE_CONFIRMATION_TITLE: {
        en: "Really delete this note?",
        es: "¿Quieres borrar esta nota?",
    },
    deleteConfirmationMessage: {
        en: (title: string) => `Note "${title}" will be deleted forever.`,
        es: (title: string) => `La nota "${title}" no se podrá recuperar.`
    },
    ERROR_READING_FILE: {
        en: "Error reading file",
        es: "Error con el archivo",
    },
    successfulExport: {
        en: (filename: string) => filename + " successfully exported",
        es: (filename: string) => filename + " exportado"
    },
    NOTE_PROPERTIES: {
        en: "Note Properties",
        es: "Propiedades de Nota",
    },
    FILENAME: {
        en: "Filename",
        es: "Archivo",
    },
    TITLE: {
        en: "Title",
        es: "Título",
    },
    CREATED: {
        en: "Created",
        es: "Creado",
    },
    LAST_MODIFIED: {
        en: "Last Modified",
        es: "Modificado",
    },
    SIZE: {
        en: "Size",
        es: "Tamaño",
    },
    EXPORT_ENCRYPTED_FILE: {
        en: "Export Encrypted File",
        es: "Exportar con encriptación",
    },
    DELETE_NOTE: {
        en: "Delete Note",
        es: "Borrar Nota",
    },
    BACK: {
        en: "Back",
        es: "Cancelar",
    },
    CONTINUE: {
        en: "Continue",
        es: "Seguir",
    },
    WARNING: {
        en: "Warning",
        es: "Aviso",
    },
    NO_TITLE_WARNING_MESSAGE: {
        en: "This note has no title. It will be saved without a title if you continue",
        es: "Esta nota no tiene título. Se guardará sin título si continúas."
    },
    FETCHING_NOTE_CONTENTS: {
        en: "Fetching note contents...",
        es: "Cargando los contenidos de la nota..."
    },
    WRITE_SOMETHING_HERE: {
        en: "Write something here...",
        es: "Escribe algo aquí..."
    },
    ALL_CHANGES_SAVED: {
        en: "All changes saved",
        es: "Todos los cambios guardados",
    },
    SAVING: {
        en: "Saving...",
        es: "Guardando...",
    },
    UNSAVED_CHANGES: {
        en: "Unsaved changes",
        es: "Cambios no guardados",
    },
    FAILED_TO_SAVE: {
        en: "Failed to save",
        es: "No se pudo guardar",
    },
    RETRY: {
        en: "Retry",
        es: "Reintentar",
    },
    IGNORE: {
        en: "Ignore",
        es: "Ignorar",
    },
    FAILED_TO_SAVE_MESSAGE: {
        en: "There was an error saving the latest changes to this note:",
        es: "Hubo un error guardando los últimos cambios:",
    },
} as const satisfies DisplayTextRecord;