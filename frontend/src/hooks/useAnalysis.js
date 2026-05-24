import { useState } from 'react'
import api from '../services/api'

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const analyzeSnippet = async (code, language) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.analyzeSnippet(code, language)
      setData(result.data)
      return result.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const analyzeGithub = async (repoUrl) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.analyzeGithub(repoUrl)
      setData(result.data)
      return result.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const uploadAndAnalyze = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.uploadZip(file)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    data,
    analyzeSnippet,
    analyzeGithub,
    uploadAndAnalyze
  }
}