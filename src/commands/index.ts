import { addFileToScopeCommand } from "./addFileToScope";
import { createScopeCommand } from "./createScope";
import { deleteScopeCommand } from "./deleteScope";
import { removeFileFromScopeCommand } from "./removeFileFromScope";
import { renameScopeCommand } from "./renameScope";
import { setActiveScopeCommand } from "./setActiveScope";
import { showFileByIndexCommands } from "./showFileByIndex";

export default [
    createScopeCommand,
    setActiveScopeCommand,
    addFileToScopeCommand,
    deleteScopeCommand,
    removeFileFromScopeCommand,
    renameScopeCommand,
    ...showFileByIndexCommands,
];
