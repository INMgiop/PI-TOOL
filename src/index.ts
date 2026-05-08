import * as fs from "fs"
import * as path from "path"

console.log("Pi arrancando...")

function extractFunctions(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")
  const functions: string[] = []

  for (const line of lines) {
    const tsMatch = line.match(/function\s+(\w+)\s*\(/)
    const arrowMatch = line.match(/const\s+(\w+)\s*=\s*.*=>/)
    const pyMatch = line.match(/def\s+(\w+)\s*\(/)

    if (tsMatch) functions.push(`[TS] ${tsMatch[1]}()`)
    if (arrowMatch) functions.push(`[TS] ${arrowMatch[1]}()`)
    if (pyMatch) functions.push(`[PY] ${pyMatch[1]}()`)
  }

  return functions
}

function scanFolder(folderPath: string): void {
  const files = fs.readdirSync(folderPath)

  console.log(`Pi escaneando: ${folderPath}`)
  console.log("---")

  for (const file of files) {
    const fullPath = path.join(folderPath, file)
    const ext = path.extname(file)

    if (ext === ".ts" || ext === ".py") {
      const functions = extractFunctions(fullPath)

      if (functions.length > 0) {
        console.log(`Archivo: ${file}`)
        functions.forEach(fn => console.log(`  -> ${fn}`))
      }
    }
  }
}

const targetFolder = process.argv[2] || "."
scanFolder(targetFolder)