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
      const zipPath = path.join(os.tmpdir(), `codara_${owner}_${repo}_${Date.now()}.zip`)
      const extractTo = path.join(os.tmpdir(), `codara_ext_${owner}_${repo}_${Date.now()}`)

      fs.writeFileSync(zipPath, Buffer.from(buffer))

      await zipExtractor.extractZip(zipPath, extractTo)
      fs.unlinkSync(zipPath) // clean up zip

      const filesArray = await zipExtractor.readAllFiles(extractTo)
      
      // Cleanup the extracted folder asynchronously
      zipExtractor.cleanup(extractTo)

      logger.success(`Fetched ${filesArray.length} files from GitHub ZIP`)
      return filesArray
    } catch (error) {
      logger.error('Failed to fetch repo via ZIP', error)
      throw error
    }
  }
}

module.exports = repoFetcher