/**
 * Type definitions and operations to maintain a note's edit history as an
 * abstract data type. This AST is modeled as immutable where each operation
 * is a pure function returning a new version of the AST.
 */

import { applyPatch, createPatch, parsePatch, reversePatch, StructuredPatch } from "diff";

export type NoteContents = {
    title: string;
    body: string;
};

export type EditHistory = Readonly<{
    /**
     * Sequence of patches in unified diff format describing how to transition
     * between each saved version.
     */
    patches: Readonly<NoteContents>[];

    /**
     * Cached version of the current patch version for faster undo/redo.
    */
   currentPatch: Readonly<NoteContents>;

   currentPatchIndex: number;
}>;

export type NotePatchMetadata = {
    title: string;
    body: string;
    filename: string;
}

export function initEditHistory(
    initialContents = { title: '', body: '' }
): EditHistory {
    return {
        patches: [],
        currentPatch: initialContents,
        currentPatchIndex: -1,
    };
}

export function addPatchToEditHistory(
    notePatchMetadata: NotePatchMetadata,
    editHistory: EditHistory
): EditHistory {
    const { title, body, filename } = notePatchMetadata;

    const titlePatch =
        createPatch(filename, editHistory.currentPatch.title, title); 
    const bodyPatch =
        createPatch(filename, editHistory.currentPatch.body, body);

    // There may be patches ahead of the current index if we are in an undo state.
    // Since there is a new edit, we discard the future patches and start a new history.
    const updatedPatches = editHistory.patches
        .slice(0, editHistory.currentPatchIndex + 1);
    updatedPatches.push({ title: titlePatch, body: bodyPatch });

    const newHistory = {
        patches: updatedPatches,
        currentPatch: { title, body }, 
        currentPatchIndex: updatedPatches.length - 1,
    };
    return newHistory;
}

export function canUndoPatch(editHistory: EditHistory): boolean {
    return editHistory.currentPatchIndex >= 0;
}

/**
 * @returns New note contents and edit history state after undoing the current
 * patch indicated by the edit history. Does not modify the input objects.
 */
export function undoCurrentPatch(
    note: NoteContents,
    editHistory: EditHistory
): {
    note: NoteContents;
    editHistory: EditHistory;
} {
    if (!canUndoPatch(editHistory)) {
        return { note, editHistory };
    }
    const patchToUndo = editHistory.patches[editHistory.currentPatchIndex];
    const newTitle = undoPatch({
        source: note.title,
        patch: patchToUndo.title
    });
    const newBody = undoPatch({
        source: note.body,
        patch: patchToUndo.body
    });

    const newNote: NoteContents = { title: newTitle, body: newBody };
    const newEditHistory: EditHistory = {
        ...editHistory,
        currentPatch: newNote,
        currentPatchIndex: editHistory.currentPatchIndex - 1
    };
    return { note: newNote, editHistory: newEditHistory };
}

export function canRedoPatch(editHistory: EditHistory): boolean {
    return editHistory.currentPatchIndex < editHistory.patches.length - 1; 
}

/**
 * @returns New note contents and edit history state after moving forward one 
 * patch after the current patch indicated by the edit history. Does not
 * modify the input objects.
 */
export function redoCurrentPatch(
    note: NoteContents,
    editHistory: EditHistory
): {
    note: NoteContents;
    editHistory: EditHistory;
} {
    if (!canRedoPatch(editHistory)) {
        return { note, editHistory };
    }
    const patchToRedo = editHistory.patches[editHistory.currentPatchIndex + 1];
    const newTitle = applyPatchWithFallback(note.title, patchToRedo.title);
    const newBody = applyPatchWithFallback(note.body, patchToRedo.body);

    const newNote: NoteContents = { title: newTitle, body: newBody };
    const newEditHistory: EditHistory = {
        ...editHistory,
        currentPatch: newNote,
        currentPatchIndex: editHistory.currentPatchIndex + 1
    };
    return { note: newNote, editHistory: newEditHistory };
}

function undoPatch(args: { source: string, patch: string }): string {
    const structuredPatches = parsePatch(args.patch);
    const reversedPatches = reversePatch(structuredPatches);

    return reversedPatches.reduce(
        (result, patch) => applyPatchWithFallback(result, patch),
        args.source
    );
}

/**
 * Wrapper around `applyPatch` that falls back to the source string if patching
 * fails.
 */
function applyPatchWithFallback(
    source: string,
    patch: StructuredPatch | string
): string {
    const result = applyPatch(source, patch);
    if (result === false) {
        console.error("Failed to apply patch:", {
            source: source,
            patch: JSON.stringify(patch)
        });
        return source;
    }
    return result; 
}
