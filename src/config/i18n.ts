export const messages = {
  en: {
    selectEditor: "Please select an editor:",
    invalidOption: "Invalid option, using default: VS Code",
    foundInstallPath: "Found {editor} installation path: {path}",
    notInstallDir: "Not a {editor} installation directory: {path}",
    checkPathFailed: "Failed to check path: {path}",
    notFoundDefault: "\nCouldn't find {editor} in default locations.",
    inputInstallPath:
      "Please enter {editor} installation path (press Enter to skip): ",
    validatedPath: "Validated user input {editor} path: {path}",
    invalidPath: "Invalid path: {path}",
    fontModified: "Font modified successfully! Added fonts: {fonts}",
    restartEditor: "Please restart the editor for changes to take effect",
    selectOperation:
      "Please select operation type:\n1. Modify custom font\n2. Restore default font\nPlease enter option (1/2): ",
    invalidOperationType: "Invalid option, using default: Modify custom font",
    enterFontNames:
      "Please enter font names (separate multiple fonts with commas): ",
    noFontName: "No font name entered, operation cancelled",
    cssFileCreated: "Custom CSS file created",
    cssFileExists: "Custom CSS file already exists",
    cssFilePath: "CSS file path: {path}",
    htmlFileNotFound: "HTML file not found",
    customCssDeleted: "Custom CSS file deleted",
    cantDeleteCss: "Custom CSS file doesn't exist or can't be deleted",
    defaultFontRestored: "Default font restored, please restart editor",
    operationError: "Error during operation: {error}",
    configSaved: "Configuration saved",
    configLoadError: "Error loading config file: {error}",
  },
  zh: {
    selectEditor: "请选择要修改的编辑器：",
    invalidOption: "无效的选项，使用默认选项：VS Code",
    foundInstallPath: "找到 {editor} 安装路径: {path}",
    notInstallDir: "不是 {editor} 安装目录: {path}",
    checkPathFailed: "检查路径失败: {path}",
    notFoundDefault: "\n未在默认位置找到{editor}安装。",
    inputInstallPath: "请输入{editor}的安装路径（直接按回车跳过）: ",
    validatedPath: "已验证用户输入的 {editor} 路径: {path}",
    invalidPath: "无法访问路径: {path}",
    fontModified: "字体修改成功！已添加字体: {fonts}",
    restartEditor: "请重启编辑器以使修改生效",
    selectOperation:
      "请选择操作类型：\n1. 修改自定义字体\n2. 恢复默认字体\n请输入选项 (1/2): ",
    invalidOperationType: "无效的选项，使用默认选项：修改自定义字体",
    enterFontNames: "请输入要设置的字体名称（多个字体用逗号分隔）: ",
    noFontName: "未输入字体名称，操作取消",
    cssFileCreated: "已创建自定义CSS文件",
    cssFileExists: "自定义CSS文件已存在",
    cssFilePath: "CSS文件路径: {path}",
    htmlFileNotFound: "未找到HTML文件",
    customCssDeleted: "已删除自定义CSS文件",
    cantDeleteCss: "自定义CSS文件不存在或无法删除",
    defaultFontRestored: "已恢复默认字体，请重启编辑器以使修改生效",
    operationError: "执行过程中发生错误：{error}",
    configSaved: "已保存配置文件",
    configLoadError: "读取配置文件时出错: {error}",
  },
}

export type Language = keyof typeof messages
export type MessageKey = keyof typeof messages.en

export function getMessage(
  key: MessageKey,
  lang: Language = "en",
  params?: Record<string, string>,
): string {
  let message = messages[lang][key]

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value)
    })
  }

  return message
}

// Get system language
export function getSystemLanguage(): Language {
  const lang = process.env.LANG || process.env.LANGUAGE || "en"
  return lang.toLowerCase().startsWith("zh") ? "zh" : "en"
}
