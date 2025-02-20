import fs from "fs-extra"

export async function processTemplate(templatePath: string): Promise<string> {
  try {
    return await fs.readFile(templatePath, "utf8")
  } catch (error) {
    console.error("读取模板文件失败:", error)
    return ""
  }
}
