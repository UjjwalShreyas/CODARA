const fs = require('fs')
const path = require('path')
const os = require('os')
const { Octokit } = require('octokit')
const logger = require('../../utils/logger')
const env = require('../../config/env')
const zipExtractor = require('../fileProcessor/zipExtractor')

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN || undefined
})

const repoFetcher = {
  async fetchRepoFiles(owner, repo) {
    logger.log('Fetching repo via ZIP archive', { owner, repo })

    let zipPath = null
    let extractTo = null
    let extracted = false

    try {
      const repoInfo = await octokit.rest.repos.get({ owner, repo })
      const branch = repoInfo.data.default_branch

      const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`
      logger.log(`Downloading ZIP from ${zipUrl}`)

      const response = await fetch(zipUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to download ZIP: ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      zipPath = path.join(os.tmpdir(), `codara_${owner}_${repo}_${Date.now()}.zip`)
      extractTo = path.join(os.tmpdir(), `codara_ext_${owner}_${repo}_${Date.now()}`)

      fs.writeFileSync(zipPath, Buffer.from(buffer))

      await zipExtractor.extractZip(zipPath, extractTo)
      extracted = true
      
      fs.unlinkSync(zipPath) // clean up zip immediately after extraction
      zipPath = null

      const filesArray = await zipExtractor.readAllFiles(extractTo)
      
      logger.success(`Fetched ${filesArray.length} files from GitHub ZIP`)
      return filesArray
    } catch (error) {
      logger.error('Failed to fetch repo via ZIP', error)
      throw error
    } finally {
      if (zipPath && fs.existsSync(zipPath)) {
        try { fs.unlinkSync(zipPath) } catch (_) {}
      }
      if (extracted && extractTo) {
        try { await zipExtractor.cleanup(extractTo) } catch (_) {}
      }
    }
  }
}

module.exports = repoFetcher