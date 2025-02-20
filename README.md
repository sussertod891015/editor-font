# Editor Font Customizer

English | [简体中文](README.zh.md)

A simple command-line tool for customizing editor fonts. Supports both English and Chinese interfaces with automatic system language detection.

> **Note**: Currently only supports Windows. macOS support coming soon.

## Features

- Support for multiple editors
- Automatic editor installation path detection
- Custom font settings (multiple fonts supported)
- Default font restoration
- Bilingual interface (English/Chinese)
- User-friendly command-line interface

## Usage

1. Select an editor
2. Choose operation type:
   - Modify custom font
   - Restore default font
3. If modifying font, enter font names (separate multiple fonts with commas)

## Operation Process

### Customize Font

1. The program automatically searches for editor installation path
2. If not found, you can manually input the installation path
3. Enter desired font names
4. Program creates necessary CSS configuration file
5. Restart editor to apply changes

### Restore Default Font

1. Select restore default font option
2. Program automatically removes custom CSS file
3. Restart editor to apply changes

## Important Notes

- Restart editor for changes to take effect
- Ensure font names are correct and installed on your system
- Backup original configuration before making changes
- This tool currently only works on Windows systems
- After modifying fonts, you may see a warning message saying "Installation appears to be corrupt" when opening the editor. This is because the custom CSS modification affects VS Code's file integrity check (SHA-256 checksums). This warning is expected and **does not affect the editor's functionality** - you can safely ignore it or click "Don't Show Again".

## Language Support

The tool automatically detects system language and switches interface:

- English (default)
- Chinese (switches automatically when system language is Chinese)

## System Requirements

- Windows 7 or later
- Node.js 12 or later
- Editor installed on your system

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Feedback

If you encounter any issues or have suggestions for improvements, please raise them in GitHub Issues.
