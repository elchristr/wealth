
import { GoogleGenAI } from "@google/genai";
import { Asset, PortfolioStats } from "../types";

export const getPortfolioAdvice = async (stats: PortfolioStats, assets: Asset[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const assetDetails = assets.map(a => `${a.name}: ${a.amount} ${a.symbol} (Value: ${stats.currency}${a.valueFiat})`).join(', ');
  const prompt = `
    As a world-class financial advisor specialized in crypto, analyze this portfolio:
    Total Balance: ${stats.currency}${stats.totalBalance}
    Total Earnings: ${stats.currency}${stats.totalEarnings}
    Assets: ${assetDetails}
    
    Provide 3 concise, bulleted recommendations for optimization. 
    Focus on APY, diversification, and market sentiment.
    Keep it professional and encouraging.
    Format as plain text with bullets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to load AI insights at this time. Please check your market strategy manually.";
  }
};
