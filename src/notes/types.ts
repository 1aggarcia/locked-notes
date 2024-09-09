/**
 * Object representation of a note
 * 
 * `dateCreated` and `dateModified` represent miliseconds elapsed since
 * the epoch (1970-01-01  00:00:00). It is easier and more reliable to
 * store them as plain numbers on the disk.
 */
type Note = {
    title: string,
    body: string,
    dateCreated: number,
    dateModified: number
}
export default Note;

/** Lighter description of note to easily store in a list */
export type NoteMetadata = {
    filename: string,
    title: string,
    dateCreated: number,
    dateModified: number
}

/**
 * Determine if the given object is a valid note
 * @param obj object to check
 * @returns true iff obj contains all the properties of a note
 */
export function isNote(obj: object): obj is Note {
    return (
        typeof obj === 'object'
        && 'title' in obj && typeof obj.title === 'string'
        && 'body' in obj && typeof obj.body === 'string'
        && 'dateCreated' in obj && typeof obj.dateCreated === 'number'
        && 'dateModified' in obj && typeof obj.dateModified === 'number'
    )
}
