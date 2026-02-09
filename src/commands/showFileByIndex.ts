import { Uri, window, workspace } from "vscode";
import { defineCommand, match } from "../utils";

const KEY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

const resolveWorkspacePath = (relativePath: string): Uri | undefined => {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    return workspaceFolder ? Uri.joinPath(workspaceFolder.uri, relativePath) : undefined;
};

const createShowFileCommand = (keyNumber: number) =>
    defineCommand(`showFile${keyNumber}`, ({ scopeService }) => async () => {
        const fileIndex = keyNumber === 0 ? 9 : keyNumber - 1;
        match(scopeService.getScopeFileByIndex(fileIndex), {
            ok: (relativePath) => {
                const uri = resolveWorkspacePath(relativePath);
                if (uri) { window.showTextDocument(uri); }
            },
            err: () => { },
        });
    });

export const showFileByIndexCommands = KEY_NUMBERS.map(createShowFileCommand);
