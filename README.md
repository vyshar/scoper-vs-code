# Scoper

**Scoper** is a VS Code extension that helps you manage and organize the files you're actively working on. Instead of keeping dozens of tabs open or constantly searching through your project, Scoper lets you create focused "scopes" - collections of files that persist even after you close tabs or restart VS Code.

## Heavily inspired by [HARPOON](https://github.com/ThePrimeagen/harpoon)

## Features

- **📁 Create Multiple Scopes**: Organize files into different contexts (e.g., "Feature A", "Bug Fix", "Refactoring")
- **⚡ Quick File Navigation**: **Jump** to any file in your active scope with keyboard shortcuts (`Alt+S Alt+1` through `Alt+S Alt+0`)
- **🎯 Persistent File Collections**: Your scopes persist across VS Code sessions
- **🔍 Focus Sidebar**: Quickly focus the Scopes sidebar with `Alt+S Alt+S`
- **📊 Visual Tree View**: See all your scopes and their files in a dedicated sidebar
- **✏️ Easy Management**: Add, remove, rename, and delete scopes through intuitive commands

## Getting **Started**

### 1. Opening the Scoper Sidebar

Click on the Scoper icon in the Activity Bar on the left side of VS Code, or use the Command Palette to open the Scopes view.

### 2. Creating Your First Scope

**Method 1: Using the Command Palette**
1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Scoper: Create Scope"
3. Enter a name for your scope (e.g., "Authentication Feature")

**Method 2: Using the Sidebar**
1. Click the **+** button in the Scopes view title bar
2. Enter a scope name

### 3. Adding Files to Your Scope

**Method 1: From Active Editor**
1. Open a file you want to add
2. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
3. Run "Scoper: Add File to Scope"
4. The currently open file will be added to your active scope

**Method 2: Using the Tree View**
- Files are automatically added to the currently active scope (indicated by a checkmark icon)

### 4. Switching Between Scopes

**Using Tree View:**
- Click the checkmark icon next to any scope to set it as active

**Using Command Palette:**
1. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Run "Scoper: Set Active Scope"
3. Select the scope you want to activate from the tree view

## Commands

All commands are accessible via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

| Command | Description |
|---------|-------------|
| `Scoper: Create Scope` | Create a new scope with a custom name |
| `Scoper: Set Active Scope` | Set a scope as the currently active one |
| `Scoper: Add File to active scope` | Add the currently open file to the active scope |
| `Scoper: Rename Scope` | Rename a scope |
| `Scoper: Delete Scope` | Permanently delete a scope and its file references |
| `Scoper: Remove File from Scope` | Remove a file from its scope |
| `Scoper: Open File 1` - `Scoper: Open File 10` | Open files 1-10 from the active scope (used by keybindings) |

## Keybindings

Scoper provides quick keyboard shortcuts to instantly jump to files in your active scope:

| Keybinding | Action |
|------------|--------|
| `Alt+S Alt+S` | Focus the Scopes tree view |
| `Alt+S Alt+1` | Open the **1st file** in the active scope |
| `Alt+S Alt+2` | Open the **2nd file** in the active scope |
| `Alt+S Alt+3` | Open the **3rd file** in the active scope |
| `Alt+S Alt+4` | Open the **4th file** in the active scope |
| `Alt+S Alt+5` | Open the **5th file** in the active scope |
| `Alt+S Alt+6` | Open the **6th file** in the active scope |
| `Alt+S Alt+7` | Open the **7th file** in the active scope |
| `Alt+S Alt+8` | Open the **8th file** in the active scope |
| `Alt+S Alt+9` | Open the **9th file** in the active scope |
| `Alt+S Alt+0` | Open the **10th file** in the active scope |

> **Note:** These are chord keybindings - press `Alt+S`, release, then press the number. Files are numbered in the order they appear in the Scopes tree view (top to bottom).

## Scoper Tree View

The Scopes sidebar shows all your scopes and their files in a tree structure:

```
📚 SCOPES
  ✓ Authentication Feature (Active)
    📄 login.ts
    📄 auth.service.ts
    📄 auth.controller.ts
  📁 Bug Fix #123
    📄 user.model.ts
  📁 Refactoring
    📄 legacy-code.ts
    📄 new-implementation.ts
```

### Tree View Actions

**Scope Actions** (right-click on a scope or use inline icons):
- **✓ Set as Active**: Makes this scope the active one
- **✏️ Rename**: Change the scope name
- **🗑️ Delete**: Remove the scope entirely (files remain in your workspace)

**File Actions** (right-click on a file):
- **✕ Remove from Scope**: Remove the file from this scope (file remains in your workspace)
- **Click to Open**: Click any file to open it in the editor

## Usage Examples

### Example 1: Feature Development Workflow

```
1. Create scope: "User Dashboard Feature"
2. Add relevant files:
   - dashboard.component.ts
   - dashboard.service.ts
   - dashboard.html
   - dashboard.css
3. Use Alt+S Alt+1, Alt+S Alt+2, etc. to quickly navigate between these files
4. When done, create a new scope for your next task
```

## Troubleshooting

**Q: Files don't open when I press Alt+S Alt+1**
- Ensure you have an active scope selected (look for the ✓ checkmark in the tree view)
- Make sure the scope has files added to it
- Remember to press `Alt+S`, release, then press the number (it's a chord keybinding)

**Q: "No active scope" message appears**
- Create a new scope or set an existing one as active using the checkmark icon in the tree view

**Q: File paths show as invalid**
- If you've moved or deleted files in your workspace, remove them from the scope using the ✕ icon

**Q: Can't add file to scope**
- Ensure a file is currently open in the editor
- Verify that you have an active scope selected

## Requirements

- VS Code version 1.108.1 or higher

## Known Issues

- Files that are moved or renamed in the workspace must be manually removed and re-added to scopes
- The extension currently supports up to 10 files per scope for keybinding navigation (Alt+S Alt+1 through Alt+S Alt+0)

## Release Notes

### 0.0.2

Initial release of Scoper:
- Create and manage multiple scopes
- Add/remove files from scopes
- Quick navigation with Alt+S Alt+1-0 chord keybindings
- Focus sidebar with Alt+S Alt+S
- Persistent scope storage across sessions
- Tree view for visual scope management
- Rename and delete scopes with inline actions

---

**Enjoy using Scoper!** If you have feedback or feature requests, please open an issue on GitHub.
