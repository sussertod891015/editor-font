import os from "os"
import path from "path"
import { Editor } from "../types"

const homeDir = os.homedir()

// Editor configurations
export const EDITORS: Record<string, Editor> = {
  vscode: {
    name: "VS Code",
    exeName: "Code.exe",
    defaultPaths: [
      path.join(process.env.LOCALAPPDATA!, "Programs", "Microsoft VS Code"),
      path.join(
        process.env.ProgramFiles || "C:\\Program Files",
        "Microsoft VS Code",
      ),
      path.join(
        process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)",
        "Microsoft VS Code",
      ),
      path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Programs",
        "Microsoft VS Code",
      ),
    ],
    configKey: "vscodePath",
    templatePath: path.join(__dirname, "../templates/vscode.css"),
  },
  trae: {
    name: "Trae",
    exeName: "Trae.exe",
    configKey: "traePath",
    defaultPaths: [
      path.join(homeDir, "AppData", "Local", "Programs", "Trae"),
      "C:\\Program Files\\Trae",
      "C:\\Program Files (x86)\\Trae",
    ],
    templatePath: path.join(__dirname, "../templates/trae.css"),
  },
  cursor: {
    name: "Cursor",
    exeName: "Cursor.exe",
    defaultPaths: [
      path.join(process.env.LOCALAPPDATA!, "Programs", "Cursor"),
      path.join(process.env.ProgramFiles || "C:\\Program Files", "Cursor"),
      path.join(
        process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)",
        "Cursor",
      ),
    ],
    configKey: "cursorPath",
    templatePath: path.join(__dirname, "../templates/cursor.css"),
  },
  // Other editor configurations
}
