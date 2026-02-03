
import { groq } from '../../config/groq.js'
import config from '../../config/config.js';
import qdrant from '../../config/qdrant.js';
import { embedTexts } from '../../helpers/embedText.js';
import { errorResponse, successResponse } from '../../helpers/response.js';


export const queryDocument = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question || question.trim().length === 0) {
            return errorResponse(res, 9998, 'Question is required');
        }

        const apiKey = req.apiKey;
        const userId = apiKey.user_id;
        const documentId = apiKey.document_id;


        apiKey.usage_count += 1;
        apiKey.last_used_at = new Date();
        await apiKey.save();

        const { embeddings: questionEmbedding } = await embedTexts([question]);
        const collectionName = `${config.qdrant.collectionPrefix}_${userId}`;
        const searchResult = await qdrant.search(collectionName, {
            vector: questionEmbedding[0],
            limit: 5,
        });

        if (!searchResult || !searchResult.length) {
            return errorResponse(res, 1102, 'No relevant data found');
        }

        const contextChunks = searchResult
            .map(r => r.payload.text)
            .join('\n\n');



        const systemPrompt = `You are a retrieval - augmented assistant.
                                CRITICAL RULES:
                                1. You MUST answer using ONLY the information provided in the Context section.
                                2. You MUST NOT use any external knowledge, prior training data, or assumptions.
                                3. If the Context does NOT contain enough information to answer the question, you MUST respond exactly with:
                                        "I don’t have enough information in the provided context to answer that question."

                                Do NOT explain why.
                                Do NOT add suggestions.
                                Do NOT guess.
                                Do NOT hallucinate.

                                            Context:
                                        { ${contextChunks} }

                                User Question:
                                        { ${question} }

                                        Answer:`



        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: systemPrompt }
            ],
            "model": config.groq.model,
            "temperature": 0.7,
            "max_completion_tokens": 8192,
            "top_p": 1,
            "stream": false,
            "reasoning_effort": "medium",
            // "stop": null
        });

        if (!chatCompletion?.choices || !chatCompletion.choices[0]?.message?.content) {
            return errorResponse(res, 9999, 'Failed to generate response');
        }

        const answer = chatCompletion.choices[0].message.content;

        return successResponse(
            res,
            2001,
            { answer }
        );
    } catch (error) {
        let message = 'Something went wrong';


        if (error?.response?.data) {
            message =
                error.response.data?.error?.message ||
                error.response.data?.message ||
                `Request failed with status code ${error.response.status}`;
        }
        else if (error?.message) {
            message = error.message;
        }

        console.error('Query document error:', message);
        return errorResponse(res, 9999, message);
    }
};


