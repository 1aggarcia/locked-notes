/**
 * Template for a note
 * 
 * `dateCreated` and `dateModified` must be ISO formatted timestamps
 */
type Note = {
    title: string,
    body: string,
    dateCreated: string,
    dateModified: string
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
        'dateCreated' in obj && typeof obj.dateCreated === 'string' &&
        'dateModified' in obj && typeof obj.dateModified === 'string'
    )
}

export default Note