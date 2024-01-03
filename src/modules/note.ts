/**
 * Object representing a note
 * 
 * `dateCreated` and `dateModified` represent seconds elapsed since the epoch (1970-01-01  00:00:00)
 */
type Note = {
    title: string,
    body: string,
    dateCreated: number,
    dateModified: number
}

/**
 * Determine if the given object is a valid note
 * @param obj object to check
 * @returns true iff obj contains all the properties of a note
 */
export function isNote(obj: object): boolean {
    return (
        typeof obj === 'object' &&
        'title' in obj && typeof obj.title === 'string' &&
        'body' in obj && typeof obj.body === 'string' &&
        'dateCreated' in obj && typeof obj.dateCreated === 'number' &&
        'dateModified' in obj && typeof obj.dateModified === 'number'
    )
}

export default Note