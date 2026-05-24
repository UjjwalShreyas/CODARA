const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const logger = require('../../utils/logger')
const securityLogger = require('../../utils/securityLogger')
const LIMITS = require('../../config/limits')

// Characters that are never legitimate in archive entry names
const DANGEROUS_ENTRY_PATTERN = /[\x00-\x1f]/

class ZipExtractor {
  /**
   * Safely extract a ZIP file with multiple layers of path-traversal prevention.
   *
   * Security measures:
   *  1. Normalize entry names via both posix AND win32 path resolution
   *  2. Reject entries whose resolved path escapes the target directory
   *  3. Block symbolic links (AdmZip attr check)
   *  4. Reject entries with null bytes or control characters
   *  5. Enforce max entry count and cumulative extracted size
   *  6. Extract entries individually instead of using extractAllTo()
   */
  async extractZip(zipPath, extractTo) {
    logger.log('Extracting ZIP file', { zipPath, extractTo })

    try {
      const zip = new AdmZip(zipPath)
      const entries = zip.getEntries()
      const resolvedExtractTo = path.resolve(extractTo)

      // ── Guard: entry count ──────────────────────────────────────
      if (entries.length > LIMITS.zip.maxFiles) {
        throw new Error(
          `ZIP contains too many entries (${entries.length}), limit: ${LIMITS.zip.maxFiles}`
        )
      }

      let totalExtractedSize = 0

      for (const entry of entries) {
        const entryName = entry.entryName

        // ── Guard: control characters / null bytes ────────────────
        if (DANGEROUS_ENTRY_PATTERN.test(entryName)) {
          securityLogger.logSuspiciousActivity('unknown-ip', 'ZIP_DANGEROUS_ENTRY_NAME', {
            entryName,
            zipPath
          })
          throw new Error('Malformed ZIP archive: dangerous characters in entry name')
        }

        // ── Guard: path traversal (normalise via both posix AND native) ──
        // 1. Collapse any ".." and "." segments on the raw name
        const normalizedName = path.posix.normalize(entryName)
        // 2. Resolve to an absolute path under the target directory
        const targetPath = path.resolve(resolvedExtractTo, normalizedName)

        if (!targetPath.startsWith(resolvedExtractTo + path.sep) &&
            targetPath !== resolvedExtractTo) {
          securityLogger.logSuspiciousActivity('unknown-ip', 'ZIP_SLIP_ATTEMPT', {
            entryName,
            normalizedName,
            resolvedTarget: targetPath,
            zipPath
          })
          throw new Error('Malformed ZIP archive: path traversal detected')
        }

        // ── Guard: symlinks ───────────────────────────────────────
        // AdmZip stores Unix file attributes in the upper 16 bits of attr
        const isSymlink = entry.attr && ((entry.attr >>> 16) & 0o170000) === 0o120000
        if (isSymlink) {
          securityLogger.logSuspiciousActivity('unknown-ip', 'ZIP_SYMLINK_BLOCKED', {
            entryName,
            zipPath
          })
          throw new Error('Malformed ZIP archive: symbolic links are not allowed')
        }

        // ── Guard: cumulative extracted size (zip-bomb prevention) ─
        if (!entry.isDirectory) {
          totalExtractedSize += entry.header.size // uncompressed size
          if (totalExtractedSize > LIMITS.zip.maxSize) {
            securityLogger.logSuspiciousActivity('unknown-ip', 'ZIP_BOMB_DETECTED', {
              totalExtractedSize,
              limit: LIMITS.zip.maxSize,
              zipPath
            })
            throw new Error('ZIP archive exceeds maximum uncompressed size limit')
          }
        }
      }

      // ── All guards passed – extract entries individually ────────
      for (const entry of entries) {
        const normalizedName = path.posix.normalize(entry.entryName)
        const targetPath = path.resolve(resolvedExtractTo, normalizedName)

        if (entry.isDirectory) {
          fs.mkdirSync(targetPath, { recursive: true })
        } else {
          // Ensure parent directory exists
          fs.mkdirSync(path.dirname(targetPath), { recursive: true })
          fs.writeFileSync(targetPath, entry.getData())
        }
      }

      logger.success('ZIP extracted safely', {
        entries: entries.length,
        totalSize: totalExtractedSize
      })
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

      // ── Guard: symlink traversal during read ───────────────────
      const lstat = fs.lstatSync(absolutePath)
      if (lstat.isSymbolicLink()) {
        logger.warn(`Skipping symlink: ${file}`)
        continue
      }

      if (lstat.isDirectory()) {
        await this.readAllFiles(baseDir, absolutePath, filesArray)
      } else {
        if (file.match(/\.(png|jpg|jpeg|gif|ico|svg|pdf|zip|tar|gz|exe|dll|ttf|woff|woff2)$/i)) continue
        if (lstat.size > 1024 * 1024) continue
        
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