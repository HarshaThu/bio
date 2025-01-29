import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ProductSearchTool } from "../tools/product-search-tool";
import { RecommendationAnalysisTool } from "../tools/recommendation-analysis-tool";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  imageUrl?: string;
}

interface ChatState {
  messages: ChatMessage[];
  suggestedProducts?: any[];
}

export class ChatAgent {
  private model: ChatOpenAI;
  private productSearchTool: ProductSearchTool;
  private recommendationTool: RecommendationAnalysisTool;
  private chain: RunnableSequence;

  constructor(apiKey: string) {
    this.model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: apiKey
    });

    this.productSearchTool = new ProductSearchTool();
    this.recommendationTool = new RecommendationAnalysisTool(apiKey);

    const analyzePrompt = PromptTemplate.fromTemplate(
      "User Query: {query}\nContext: {context}\nAnalyze if product suggestions would be helpful."
    );

    // Create a chain that analyzes, searches products, and generates responses
    this.chain = RunnableSequence.from([
      {
        query: (input: { message: string; state: ChatState }) => input.message,
        context: (input: { message: string; state: ChatState }) => 
          input.state.messages.slice(-3).map(m => m.content).join("\n")
      },
      {
        shouldRecommend: async (input) => {
          const result = await this.recommendationTool.call(
            `User Query: ${input.query}\nContext: ${input.context}`
          );
          return result === "YES";
        },
        originalInput: (input) => input
      },
      {
        suggestedProducts: async (input) => {
          if (!input.shouldRecommend) return [];
          const productsJson = await this.productSearchTool.call(input.originalInput.query);
          return JSON.parse(productsJson);
        },
        message: (input) => input.originalInput.message,
        state: (input) => input.originalInput.state
      },
      async (input) => {
        const messages = [
          new SystemMessage(
            "You are an AI-powered gardening assistant. Your purpose is to help users with gardening-related queries, " +
            "plant care advice, and product recommendations for gardening. You must:\n" +
            "- Only respond to questions about gardening, plants, soil, fertilizers, gardening tools, and related topics\n" +
            "- If a user asks about non-gardening topics, politely explain that you can only assist with gardening-related matters\n" +
            "- When analyzing images, focus on plant identification, disease diagnosis, or garden design elements\n" +
            "- Provide accurate, practical gardening advice based on best practices\n" +
            "- Be specific about plant care requirements, seasons, and growing conditions"
          ),
          ...input.state.messages.map(m => 
            m.role === "user" 
              ? new HumanMessage(m.content)
              : new AIMessage(m.content)
          ),
          new HumanMessage(input.message)
        ];

        const response = await this.model.invoke(messages);
        const content = typeof response.content === 'string' ? response.content : '';

        return {
          content,
          suggestedProducts: input.suggestedProducts
        };
      }
    ]);
  }

  async chat(message: string, imageUrl?: string): Promise<{
    content: string;
    suggestedProducts?: any[];
  }> {
    const state: ChatState = {
      messages: [],
      suggestedProducts: []
    };

    return this.chain.invoke({ message, state });
  }
}
