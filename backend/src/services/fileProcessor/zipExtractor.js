const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const logger = require('../../utils/logger')

class ZipExtractor {
  async extractZip(zipPath, extractTo) {
    logger.log('Extracting ZIP file', { zipPath, extractTo })

    try {
      const zip = new AdmZip(zipPath)
      zip.extractAllTo(extractTo, true)
      logger.success('ZIP extracted')
      return extractTo
    } catch (error) {
      logger.error('ZIP extraction failed', error)
      throw error
    }
  }

  async readAllFiles(baseDir, currentDir, filesArray = []) {
    currentDir = currentDir || baseDir
    if (!fs.existsSync(currentDir)) return filesArray

    const files = fs.readdirSync(currentDir)
    
    for (const file of files) {
      if (['node_modules', '.git', 'dist', 'build', '.next'].includes(file)) continue

      const absolutePath = path.join(currentDir, file)
      if (fs.statSync(absolutePath).isDirectory()) {
        await this.readAllFiles(baseDir, absolutePath, filesArray)
      } else {
        if (file.match(/\.(png|jpg|jpeg|gif|ico|svg|pdf|zip|tar|gz|exe|dll|ttf|woff|woff2)$/i)) continue
        if (fs.statSync(absolutePath).size > 1024 * 1024) continue
        
        try {
          const content = fs.readFileSync(absolutePath, 'utf8')
          if (content.indexOf('\0') !== -1) continue; // skip binaries

          filesArray.push({
            path: path.relative(baseDir, absolutePath).replace(/\\/g, '/'),
            content: content
          })
        } catch(e) {
          logger.warn(`Failed to read file ${file}`)
        }
      }
    }
    return filesArray
  }

  async cleanup(extractedPath) {
    logger.log('Cleaning up extracted files', { path: extractedPath })

    try {
      fs.rmSync(extractedPath, { recursive: true, force: true })
      logger.success('Cleanup complete')
    } catch (error) {
      logger.warn('Cleanup failed (non-blocking)', error)
    }
  }
}

module.exports = new ZipExtractor()