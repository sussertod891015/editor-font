import fs from "fs-extra"
import path from "path"
import { getMessage, getSystemLanguage } from "../config/i18n"
import { Editor } from "../types"
import { checkHTMLFile } from "../utils/path"
import { processTemplate } from "../utils/template"

const lang = getSystemLanguage()

export async function createCustomCSS(
  originalCssPath: string,
): Promise<string> {
  try {
    // Get HTML file directory
    const htmlPath = await checkHTMLFile(originalCssPath)
    if (!htmlPath) {
      throw new Error(getMessage("htmlFileNotFound", lang))
    }

    const htmlDir = path.dirname(htmlPath)
    // Custom CSS file path, placed in the same directory as HTML file
    const customCssPath = path.join(htmlDir, "custom-workbench.css")

    // If custom CSS doesn't exist, copy from original CSS
    try {
      await fs.access(customCssPath)
      console.log(getMessage("cssFileExists", lang))
    } catch {
      await fs.copyFile(originalCssPath, customCssPath)
      console.log(getMessage("cssFileCreated", lang))
    }

    return customCssPath
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}

export async function modifyFonts(
  cssPath: string,
  fonts: string,
  editor?: Editor,
): Promise<string> {
  try {
    // Process font names, ensure each font is wrapped in quotes
    const fontList = fonts
      .split(",")
      .map((font) => font.trim())
      .map((font) => (font.includes(" ") ? `"${font}"` : font))
      .join(", ")

    // Define target font list (for matching)
    const targetFonts = [
      "Consolas",
      "Courier New",
      "monospace",
      "Microsoft Jhenghei",
      "Microsoft YaHei",
      "sans-serif",
      "Inter",
    ]

    // Read CSS file content
    const cssContent = await fs.readFile(cssPath, "utf8")

    // Create matching pattern: font-family rules
    const pattern = new RegExp(`font-family:[^;}]+[;}]?`, "g")

    // Modify matched font-family rules
    const modifiedContent = cssContent.replace(pattern, (match) => {
      // Skip if contains monaco-monospace-font variable
      if (match.includes("var(--monaco-monospace-font)")) {
        console.log("Skipping monaco font rule:", match)
        return match
      }

      // Check if contains any target font
      const hasTargetFont = targetFonts.some((font) => match.includes(font))
      if (!hasTargetFont) {
        console.log("Skipping non-target font rule:", match)
        return match
      }

      // Check if all user fonts are already included
      const userFonts = fonts.split(",").map((f) => f.trim())
      const originalFonts = match.slice(11).replace(/[;}]$/, "").trim()
      const allUserFontsIncluded = userFonts.every((font) =>
        originalFonts.includes(font),
      )

      if (allUserFontsIncluded) {
        console.log(
          "Font rule already includes all user fonts, skipping:",
          match,
        )
        return match
      }

      // Add custom fonts
      const cleanOriginalFonts = originalFonts.replace(/^\s*:/, "")
      const endChar = match.endsWith(";")
        ? ";"
        : match.endsWith("}")
          ? "}"
          : ";"
      return `font-family:${fontList}, ${cleanOriginalFonts}${endChar}`
    })

    // Add CSS variable definition
    let cssWithVariables = `/* CSS Variable Definition */
:root {
  --custom-font-family: ${fontList};
}

${modifiedContent}`

    // Add editor-specific styles
    if (editor?.templatePath) {
      const customStyles = await processTemplate(editor.templatePath)
      if (customStyles) {
        cssWithVariables += "\n\n/* Editor-specific Styles */\n" + customStyles
      }
    }

    return cssWithVariables
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}
