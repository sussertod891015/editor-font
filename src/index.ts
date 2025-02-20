#!/usr/bin/env node
// 添加中文支持
process.env.LANG = process.env.LANG || "en_US.UTF-8"

import fs from "fs-extra"
import path from "path"
import { EDITORS } from "./config/editors"
import { getMessage, getSystemLanguage } from "./config/i18n"
import { createCustomCSS, modifyFonts } from "./services/css"
import { findEditorInstallation } from "./services/editor"
import {
  checkHTMLFile,
  removeCustomCSSFromHTML,
  updateHTMLFile,
} from "./services/html"
import { askQuestion, closeReadline } from "./utils/cli"

// Get system language
const lang = getSystemLanguage()

async function askForEditor(): Promise<string> {
  console.log(`\n${getMessage("selectEditor", lang)}`)
  Object.entries(EDITORS).forEach(([key, editor], index) => {
    console.log(`${index + 1}. ${editor.name}`)
  })

  const answer = await askQuestion("\n")
  const index = parseInt(answer) - 1
  const keys = Object.keys(EDITORS)

  if (index >= 0 && index < keys.length) {
    return keys[index]
  }

  console.log(getMessage("invalidOption", lang))
  return "vscode"
}

async function askForModification(): Promise<"custom" | "default"> {
  const answer = await askQuestion(getMessage("selectOperation", lang))
  if (answer === "1") {
    return "custom"
  } else if (answer === "2") {
    return "default"
  } else {
    console.log(getMessage("invalidOperationType", lang))
    return "custom"
  }
}

async function modifyCustomFonts(
  cssPath: string,
  editorKey: string,
): Promise<void> {
  try {
    // Create custom CSS file
    const customCssPath = await createCustomCSS(cssPath)

    // Get user input fonts
    const fonts = await askQuestion(getMessage("enterFontNames", lang))
    if (!fonts.trim()) {
      console.log(getMessage("noFontName", lang))
      return
    }

    // Modify fonts
    const modifiedContent = await modifyFonts(
      cssPath,
      fonts,
      EDITORS[editorKey],
    )

    // Write modified content to custom CSS file
    await fs.writeFile(customCssPath, modifiedContent, "utf8")
    console.log(getMessage("fontModified", lang, { fonts }))

    // Update HTML file to include custom CSS
    const htmlPath = await checkHTMLFile(cssPath)
    if (htmlPath) {
      await updateHTMLFile(htmlPath, cssPath, customCssPath)
    }

    console.log(getMessage("restartEditor", lang))
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}

async function restoreDefaultFont(cssPath: string): Promise<void> {
  try {
    const htmlPath = await checkHTMLFile(cssPath)
    if (!htmlPath) {
      throw new Error(getMessage("htmlFileNotFound", lang))
    }

    const htmlDir = path.dirname(htmlPath)
    const customCssPath = path.join(htmlDir, "custom-workbench.css")

    await removeCustomCSSFromHTML(htmlPath, customCssPath)

    // Try to delete custom CSS file
    try {
      await fs.access(customCssPath)
      await fs.unlink(customCssPath)
      console.log(getMessage("customCssDeleted", lang))
    } catch {
      console.log(getMessage("cantDeleteCss", lang))
    }

    console.log(getMessage("defaultFontRestored", lang))
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
    throw error
  }
}

async function main() {
  try {
    const editorKey = await askForEditor()
    const editor = EDITORS[editorKey]

    const installations = await findEditorInstallation(editor)
    if (installations.length > 0) {
      console.log(
        `\n${getMessage("foundInstallPath", lang, { editor: editor.name })}`,
      )
      for (const { path: installPath, cssPath } of installations) {
        console.log(
          `${getMessage("foundInstallPath", lang, { path: installPath })}`,
        )
        console.log(getMessage("cssFilePath", lang, { path: cssPath }))

        const modType = await askForModification()

        if (modType === "custom") {
          await modifyCustomFonts(cssPath, editorKey)
        } else {
          await restoreDefaultFont(cssPath)
        }
      }
    } else {
      console.log(
        `\n${getMessage("notFoundDefault", lang, { editor: editor.name })}`,
      )
    }
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
  } finally {
    closeReadline()
  }
}

main()
