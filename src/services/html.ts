import fs from "fs-extra"
import path from "path"
import { getMessage, getSystemLanguage } from "../config/i18n"

const lang = getSystemLanguage()

export async function updateHTMLFile(
  htmlPath: string,
  originalCssPath: string,
  customCssPath: string,
): Promise<void> {
  try {
    let htmlContent = await fs.readFile(htmlPath, "utf8")

    // Get relative path
    const relativeCssPath = path
      .relative(path.dirname(htmlPath), customCssPath)
      .replace(/\\/g, "/")
    const linkTag = `<link rel="stylesheet" href="${relativeCssPath}" />`

    // Check if custom CSS is already added
    if (!htmlContent.includes(relativeCssPath)) {
      const originalCssName = path.basename(originalCssPath)
      const originalLinkRegex = new RegExp(`<link[^>]*${originalCssName}[^>]*>`)
      const match = htmlContent.match(originalLinkRegex)

      if (match) {
        htmlContent = htmlContent.replace(match[0], `${match[0]}\n\t${linkTag}`)
        await fs.writeFile(htmlPath, htmlContent, "utf8")
        console.log(getMessage("cssFileCreated", lang))
      } else {
        console.log(getMessage("htmlFileNotFound", lang))
      }
    } else {
      console.log(getMessage("cssFileExists", lang))
    }
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}

export async function removeCustomCSSFromHTML(
  htmlPath: string,
  customCssPath: string,
): Promise<void> {
  try {
    let htmlContent = await fs.readFile(htmlPath, "utf8")

    // Get relative path
    const relativeCssPath = path
      .relative(path.dirname(htmlPath), customCssPath)
      .replace(/\\/g, "/")

    // Find and remove custom CSS reference
    const linkRegex = new RegExp(
      `<link[^>]*href=["']${relativeCssPath.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      )}["'][^>]*>\\s*`,
      "g",
    )

    if (htmlContent.includes(relativeCssPath)) {
      // Remove custom CSS reference
      htmlContent = htmlContent.replace(linkRegex, "")

      // Save modified HTML
      await fs.writeFile(htmlPath, htmlContent, "utf8")
      console.log(getMessage("customCssDeleted", lang))
    } else {
      console.log(getMessage("cantDeleteCss", lang))
    }
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}

export async function checkHTMLFile(cssPath: string): Promise<string | null> {
  try {
    // Trace back from CSS path to base directory
    // CSS path is typically: .../resources/app/out/vs/workbench/workbench.desktop.main.css
    // Need to trace back to parent of resources/app
    const baseDir = path
      .dirname(cssPath)
      .split(path.sep)
      .slice(0, -5) // Go back 4 levels: remove workbench, vs, out, app
      .join(path.sep)

    // HTML file relative path
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
      // Try path without resources/app prefix
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
