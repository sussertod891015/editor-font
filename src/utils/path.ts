import fs from "fs-extra"
import path from "path"
import { getMessage, getSystemLanguage } from "../config/i18n"

const lang = getSystemLanguage()

export async function checkCSSFile(basePath: string): Promise<string | null> {
  try {
    // Check CSS file in standard location
    const cssPath = path.join(
      path.dirname(basePath),
      "resources",
      "app",
      "out",
      "vs",
      "workbench",
      "workbench.desktop.main.css",
    )

    try {
      await fs.access(cssPath)
      console.log(getMessage("cssFilePath", lang, { path: cssPath }))
      return cssPath
    } catch (error) {
      console.log(getMessage("htmlFileNotFound", lang))
      return null
    }
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    return null
  }
}

export async function checkHTMLFile(cssPath: string): Promise<string | null> {
  try {
    // Get base directory from CSS path
    const baseDir = path
      .dirname(cssPath)
      .split(path.sep)
      .slice(0, -5)
      .join(path.sep)

    // Try standard HTML path
    const htmlPath = path.join(
      baseDir,
      "resources",
      "app",
      "out",
      "vs",
      "code",
      "electron-sandbox",
      "workbench",
      "workbench.html",
    )

    try {
      await fs.access(htmlPath)
      console.log(getMessage("cssFilePath", lang, { path: htmlPath }))
      return htmlPath
    } catch (error) {
      // Try alternative path
      const alternativePath = path.join(
        baseDir,
        "out",
        "vs",
        "code",
        "electron-sandbox",
        "workbench",
        "workbench.html",
      )

      try {
        await fs.access(alternativePath)
        console.log(getMessage("cssFilePath", lang, { path: alternativePath }))
        return alternativePath
      } catch {
        console.log(getMessage("htmlFileNotFound", lang))
        return null
      }
    }
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    return null
  }
}
