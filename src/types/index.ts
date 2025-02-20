export interface Editor {
  name: string
  exeName: string
  configKey: string
  defaultPaths: string[]
  templatePath?: string
}

export interface EditorConfig {
  [key: string]: Editor
}

export interface EditorPaths {
  path: string
  cssPath: string
}

export interface UserConfig {
  vscodePath?: string
  cursorPath?: string
  traePath?: string
  [key: string]: string | undefined
}
