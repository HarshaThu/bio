import { Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class RecommendationAnalysisTool extends Tool {
  name = "recommendation_analysis";
  description = "Analyze if product recommendations are relevant for the current context";

  private model: ChatOpenAI;

  constructor(apiKey: string) {
    super();
    this.model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      openAIApiKey: apiKey
    });
  }

  async _call(input: string): Promise<string> {
    try {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a product recommendation specialist for a gardening e-commerce site. " +
          "Analyze the user's query and chat context to determine if suggesting products would be helpful. " +
          "Respond with ONLY 'YES' if product suggestions would be relevant, or 'NO' if they wouldn't be. " +
          "Consider suggesting products when:\n" +
          "1. User asks about specific gardening problems that products could solve\n" +
          "2. User mentions needing tools or materials\n" +
          "3. User discusses starting a garden or plant care\n" +
          "4. User asks about soil, fertilizers, or plant nutrition"
        ),
        new HumanMessage(input)
      ]);

      return typeof response.content === 'string' ? response.content : 'NO';
    } catch (error) {
      console.error("Error in recommendation analysis:", error);
      return "NO";
    }
  }
}
