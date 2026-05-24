const prompts = {
  explainCode: (code, language, mode = 'beginner', repoName = '', folderTree = '') => `
You are a senior technical code mentor explaining the logic, architecture, and purpose of the project ${repoName ? `"${repoName}"` : 'workspace'} (${language}) to a developer with ${mode}-level experience.

Project Name: ${repoName || 'Workspace Project'}
Directory Structure:
${folderTree || 'N/A'}

Selected Code Files:
\`\`\`${language}
${code}
\`\`\`

Instructions:
1. Read the code files and directory structure in depth to understand what this repository is actually about (its core domain/application purpose) and what features are implemented inside it.
2. Explain the actual business logic, custom workflows, and code mechanics. Do not just name the tech stack or mention boilerplate details like imports/rate-limiting.
3. Keep the explanation professional and highly technical. Avoid silly analogies (e.g., comparing routers or middlewares to nightclub bouncers, recipes, or theme parks).
4. Ensure the explanation depth increases clearly based on the developer's experience level.

Depth Required:
${mode === 'beginner' ? 
  'Write ONE simple, clear paragraph (4-5 sentences). Explain what the project is about, what its main purpose is, and how the code processes data from the frontend to the backend in plain, professional terms.' : ''}
${mode === 'intermediate' ? 
  'Write 2-3 detailed paragraphs. Explain how the project is structured, what modules/routes/components are inside it, how they work together, and how the core features (such as forms, booking, pages) are technically implemented in the code.' : ''}
${mode === 'advanced' ? 
  'Write 3-4 deep technical paragraphs. Walk through the execution flow, explain the architectural design patterns (like Client-Server, MVC), discuss security/session/auth handling, database query logic, error handling, potential bottlenecks, and specific recommendations for refactoring or performance optimization.' : ''}

Return plain text only. No markdown. No bullet points. No headers. No code blocks. Just clean paragraphs separated by newlines.
`,

  explainCodeAllModes: (code, language, repoName = '', folderTree = '') => `
You are a senior technical code mentor explaining the logic, architecture, and purpose of the project ${repoName ? `"${repoName}"` : 'workspace'} (${language}) at three different levels of depth: beginner, intermediate, and advanced.

Project Name: ${repoName || 'Workspace Project'}
Directory Structure:
${folderTree || 'N/A'}

Selected Code Files:
\`\`\`${language}
${code}
\`\`\`

Instructions:
1. Read the code files and directory structure in depth to understand what this repository is actually about (its core domain/application purpose) and what features are implemented inside it.
2. Explain the actual business logic, custom workflows, and code mechanics. Do not just name the tech stack or mention boilerplate details like imports/rate-limiting.
3. Keep the explanation professional and highly technical. Avoid silly analogies (e.g., comparing routers or middlewares to nightclub bouncers, recipes, or theme parks).
4. Ensure the depth and length of the explanations increase significantly for each mode.

Please generate explanations for:
1. "beginner": Write ONE simple, clear paragraph (4-5 sentences). Explain what the project is about, what its main purpose is, and how the code processes data from the frontend to the backend in plain, professional terms.
2. "intermediate": Write 2-3 detailed paragraphs. Explain how the project is structured, what modules/routes/components are inside it, how they work together, and how the core features (such as forms, booking, pages) are technically implemented in the code.
3. "advanced": Write 3-4 deep technical paragraphs. Walk through the execution flow, explain the architectural design patterns (like Client-Server, MVC), discuss security/session/auth handling, database query logic, error handling, potential bottlenecks, and specific recommendations for refactoring or performance optimization.

Return a JSON object with keys "beginner", "intermediate", and "advanced".
Do NOT wrap the values in markdown, code blocks, or extra headers. Just plain paragraphs.

Return valid JSON only.
`,

  generateInterviewQuestions: (code, language) => `
Generate 5 interview questions an interviewer might ask about this ${language} code.
Return as JSON array with "question", "answer", and "followUp" fields.

Code:
\`\`\`${language}
${code}
\`\`\`

Focus on:
- Algorithm/logic understanding
- Complexity analysis
- Edge cases
- Alternative approaches
- Best practices

Return valid JSON only.
`,

  generateLearningRoadmap: (weaknesses, techStack) => `
Based on these code weaknesses, generate a personalized learning roadmap.

Weaknesses: ${weaknesses.join(', ')}
Tech Stack: ${techStack.join(', ')}

Return JSON with this structure:
{
  "learningRoadmap": [
    {
      "topic": "Topic name",
      "description": "Why learn this",
      "resources": ["resource 1", "resource 2"]
    }
  ],
  "nextSteps": "Immediate action"
}

Return valid JSON only.
`,

  analyzeArchitecture: (folderTree, techStack) => `
Analyze this project's architecture:

Folder structure:
\`\`\`
${folderTree}
\`\`\`

Tech stack: ${techStack.join(', ')}

Provide:
1. Architecture type (monolith, microservices, etc)
2. Design patterns detected
3. Separation of concerns assessment
4. Suggestions for improvement

Keep it concise and technical.
`,

  generateExplanation: (code, language) => `
Provide a detailed but concise explanation of this ${language} code.
Include complexity analysis (time and space).

Code:
\`\`\`${language}
${code}
\`\`\`

Format as JSON:
{
  "explanation": "Main explanation",
  "complexity": {
    "time": "O(...)",
    "space": "O(...)"
  },
  "keyConcepts": ["concept1", "concept2"]
}

Return valid JSON only.
`
}

module.exports = prompts