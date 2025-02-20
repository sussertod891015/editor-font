import fs from "fs-extra"
import path from "path"
import { getMessage, getSystemLanguage } from "../config/i18n"
import { UserConfig } from "../types"

const lang = getSystemLanguage()

export async function saveConfig(
  newConfig: Partial<UserConfig>,
): Promise<void> {
  try {
    // First read existing config
    const existingConfig = (await loadConfig()) || {}
    // Merge configs
    const config = { ...existingConfig, ...newConfig }
    await fs.writeFile(
      path.join(__dirname, "../../config.json"),
      JSON.stringify(config, null, 2),
    )
    console.log(getMessage("configSaved", lang))
  } catch (error) {
    console.error(getMessage("operationError", lang, { error: String(error) }))
  }
}

export async function loadConfig(): Promise<UserConfig | null> {
  try {
    const configPath = path.join(__dirname, "../../config.json")
    const configContent = await fs.readFile(configPath, "utf8")
    return JSON.parse(configContent)
  } catch (error) {
    console.log(getMessage("configLoadError", lang, { error: String(error) }))
    return null
  }
}
