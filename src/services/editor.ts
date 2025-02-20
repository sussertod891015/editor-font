import fs from "fs-extra"
import path from "path"
import { getMessage, getSystemLanguage } from "../config/i18n"
import { Editor, EditorPaths } from "../types"
import { askQuestion } from "../utils/cli"
import { loadConfig, saveConfig } from "../utils/file"
import { checkCSSFile } from "../utils/path"

const lang = getSystemLanguage()

export async function findEditorInstallation(
  editor: Editor,
): Promise<EditorPaths[]> {
  const possiblePaths: string[] = []

  // 先尝试从配置文件加载路径
  const config = await loadConfig()
  if (config && config[editor.configKey]) {
    const configPath = config[editor.configKey]
    if (configPath) {
      try {
        const stat = await fs.stat(configPath)
        if (stat.isDirectory()) {
          try {
            await fs.access(path.join(configPath, editor.exeName))
            console.log(
              getMessage("foundInstallPath", lang, {
                editor: editor.name,
                path: configPath,
              }),
            )
            possiblePaths.push(configPath)
          } catch (error) {
            console.log(
              getMessage("notInstallDir", lang, {
                editor: editor.name,
                path: configPath,
              }),
            )
          }
        }
      } catch (error) {
        console.log(getMessage("invalidPath", lang, { path: configPath }))
      }
    }
  }

  // 如果配置文件中的路径无效，尝试默认路径
  if (possiblePaths.length === 0) {
    for (const p of editor.defaultPaths) {
      try {
        const stat = await fs.stat(p)
        if (stat.isDirectory()) {
          try {
            await fs.access(path.join(p, editor.exeName))
            console.log(
              getMessage("foundInstallPath", lang, {
                editor: editor.name,
                path: p,
              }),
            )
            possiblePaths.push(p)
          } catch {
            console.log(
              getMessage("notInstallDir", lang, {
                editor: editor.name,
                path: p,
              }),
            )
          }
        }
      } catch {
        console.log(getMessage("checkPathFailed", lang, { path: p }))
      }
    }
  }

  // 如果还是没找到，询问用户
  if (possiblePaths.length === 0) {
    console.log(getMessage("notFoundDefault", lang, { editor: editor.name }))
    const userPath = await askQuestion(
      getMessage("inputInstallPath", lang, { editor: editor.name }),
    )

    if (userPath) {
      try {
        const stat = await fs.stat(userPath)
        if (stat.isDirectory()) {
          try {
            await fs.access(path.join(userPath, editor.exeName))
            console.log(
              getMessage("validatedPath", lang, {
                editor: editor.name,
                path: userPath,
              }),
            )
            possiblePaths.push(userPath)
            // Save valid user input path to config file
            await saveConfig({ [editor.configKey]: userPath })
          } catch {
            console.log(
              getMessage("notInstallDir", lang, {
                editor: editor.name,
                path: userPath,
              }),
            )
          }
        }
      } catch {
        console.log(getMessage("invalidPath", lang, { path: userPath }))
      }
    }
  }

  // 在有效路径中查找 CSS 文件
  const foundPaths: EditorPaths[] = []
  for (const p of possiblePaths) {
    const exePath = path.join(p, editor.exeName)
    const cssPath = await checkCSSFile(exePath)
    if (cssPath) {
      foundPaths.push({ path: p, cssPath })
    }
  }

  return foundPaths
}
