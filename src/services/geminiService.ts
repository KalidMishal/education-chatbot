
import { Message } from "../types/chat";

// Base URL for Google's Gemini API
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL_NAME = "gemini-1.5-flash";

// Get history messages in the right format for Gemini
export const formatMessagesForGemini = (messages: Message[]) => {
  return messages
    .filter(message => message.role !== 'system')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    }));
};

// Helper function to create system message
export const createSystemMessage = (): Message => {
  return {
    id: "system-1",
    role: "system",
    content: `You are LankaEduAI, an AI-powered educational counselor for students in Sri Lanka.
Your primary role is to provide accurate, helpful information about the education system, opportunities, and pathways in Sri Lanka.

Key areas you should be knowledgeable about:
- Sri Lankan school system (primary, secondary, tertiary education)
- National examinations (Grade 5 scholarship, O/L, A/L)
- University admission process
- Vocational and technical education options
- International education opportunities and scholarships
- Career guidance related to educational paths
- Current educational policies and reforms in Sri Lanka

When answering:
- Be accurate, clear, and concise
- Provide context specific to Sri Lanka's education system
- Be respectful of cultural sensitivities
- Admit when you don't have specific information
- Suggest resources for further information when appropriate
- Do not provide any political opinions

Remember that your advice can significantly impact students' educational decisions, so prioritize accuracy over speculation.`,
    timestamp: new Date(),
  };
};

// Call the Gemini API
export const generateChatResponse = async (messages: Message[], apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  // Create system message for context, but don't send it directly to Gemini
  const systemMessage = createSystemMessage();
  
  // Filter out existing system messages from the conversation
  const nonSystemMessages = messages.filter(msg => msg.role !== "system");
  
  // For the first user message, prepend the system instructions
  if (nonSystemMessages.length > 0 && nonSystemMessages[0].role === "user") {
    // Clone the first user message to avoid mutating the original message
    const firstUserMessage = { ...nonSystemMessages[0] };
    
    // Prepend system instructions to the first user message content
    firstUserMessage.content = `[Instructions for you: ${systemMessage.content}]\n\nUser's question: ${firstUserMessage.content}`;
    
    // Replace the first message with our modified version
    nonSystemMessages[0] = firstUserMessage;
  }
  
  // Format messages for Gemini API (no system messages, just user and model)
  const formattedMessages = formatMessagesForGemini(nonSystemMessages);
  
  try {
    const response = await fetch(
      `${API_URL}/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get response from Gemini API");
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
