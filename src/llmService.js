/**
 * LLM Service using WebLLM
 * Runs language models entirely in the browser with WebGPU
 */
import * as webllm from '@mlc-ai/web-llm';

class LLMService {
  constructor() {
    this.engine = null;
    this.modelId = null;
    this.isLoading = false;
    this.isReady = false;
  }

  /**
   * Initialize the LLM engine with a specific model
   * @param {string} modelId - The model ID to load
   * @param {Function} progressCallback - Callback for loading progress
   */
  async initialize(modelId, progressCallback = null) {
    if (this.isReady && this.modelId === modelId) return;
    
    this.isLoading = true;
    this.modelId = modelId;

    try {
      console.log('🔄 Loading LLM model:', modelId);

      // Create engine with progress callback
      this.engine = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (progress) => {
          if (progressCallback) {
            progressCallback({
              status: 'loading',
              progress: Math.round(progress.progress * 100),
              message: progress.text
            });
          }
        }
      });

      this.isReady = true;
      console.log('✅ LLM model loaded successfully');

      if (progressCallback) {
        progressCallback({
          status: 'ready',
          progress: 100,
          message: 'LLM model ready'
        });
      }
    } catch (error) {
      console.error('❌ Failed to load LLM model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Generate a response from the LLM
   * @param {string} prompt - The prompt to send
   * @param {object} options - Generation options
   * @returns {string} - Generated response
   */
  async generate(prompt, options = {}) {
    if (!this.isReady) {
      throw new Error('LLM not initialized');
    }

    const defaultOptions = {
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.95,
    };

    const config = { ...defaultOptions, ...options };

    const response = await this.engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      top_p: config.top_p,
    });

    return response.choices[0].message.content;
  }

  /**
   * Generate a streaming response
   * @param {string} prompt - The prompt to send
   * @param {Function} onChunk - Callback for each token
   * @param {object} options - Generation options
   */
  async generateStream(prompt, onChunk, options = {}) {
    if (!this.isReady) {
      throw new Error('LLM not initialized');
    }

    const defaultOptions = {
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.95,
    };

    const config = { ...defaultOptions, ...options };

    const stream = await this.engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      top_p: config.top_p,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      if (onChunk) {
        onChunk(content, fullResponse);
      }
    }

    return fullResponse;
  }

  /**
   * Validate a quiz answer using RAG context
   * @param {string} question - The quiz question
   * @param {string} userAnswer - The user's answer
   * @param {string} context - Retrieved context from knowledge base
   * @returns {object} - Validation result with isCorrect, score, and feedback
   */
  async validateAnswer(question, userAnswer, context) {
    const prompt = `You are a quiz grader. Evaluate the student's answer based on the provided context.

CONTEXT FROM KNOWLEDGE BASE:
${context}

QUESTION: ${question}

STUDENT'S ANSWER: ${userAnswer}

Evaluate the answer and respond in this exact JSON format:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Brief explanation of what was correct/incorrect",
  "correctAnswer": "The correct/complete answer based on the context"
}

Be fair but accurate. Partial credit is allowed. The score should reflect how complete and accurate the answer is.`;

    const response = await this.generate(prompt, { temperature: 0.3, max_tokens: 400 });
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to parse LLM response as JSON, using fallback');
    }

    // Fallback response
    return {
      isCorrect: false,
      score: 50,
      feedback: response,
      correctAnswer: 'See the context for the correct answer.'
    };
  }

  /**
   * Generate a hint for a question
   * @param {string} question - The quiz question
   * @param {string} context - Retrieved context
   * @returns {string} - A helpful hint
   */
  async generateHint(question, context) {
    const prompt = `Based on this context, give a brief hint for the question without giving away the complete answer.

CONTEXT: ${context}

QUESTION: ${question}

Provide a short, helpful hint (1-2 sentences) that guides the student toward the answer without revealing it completely.`;

    return await this.generate(prompt, { temperature: 0.5, max_tokens: 100 });
  }

  /**
   * Generate final quiz summary
   * @param {Array} results - Array of question results
   * @returns {string} - Personalized summary
   */
  async generateSummary(results) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    const topicsPerformance = results.reduce((acc, r) => {
      if (!acc[r.topic]) {
        acc[r.topic] = { correct: 0, total: 0 };
      }
      acc[r.topic].total++;
      if (r.isCorrect) acc[r.topic].correct++;
      return acc;
    }, {});

    const prompt = `Generate a brief, encouraging summary for a student who completed a quiz.

RESULTS:
- Score: ${correctCount}/${totalCount} (${percentage}%)
- Topics: ${JSON.stringify(topicsPerformance)}

Write 2-3 sentences of personalized feedback:
1. Acknowledge their performance
2. Mention their strongest/weakest topics
3. Provide encouragement or study suggestions`;

    return await this.generate(prompt, { temperature: 0.7, max_tokens: 150 });
  }

  /**
   * Reset the engine
   */
  async reset() {
    if (this.engine) {
      await this.engine.resetChat();
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;
