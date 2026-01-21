
import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types";

export const getInventoryInsights = async (products: Product[], sales: Sale[]) => {
  // Always use { apiKey: process.env.API_KEY } directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const inventorySummary = products.map(p => `${p.name} (Stock: ${p.stock}, Precio: ${p.price})`).join(", ");
  const salesSummary = sales.slice(0, 20).map(s => `Venta ${s.id}: $${s.total} el ${new Date(s.date).toLocaleDateString()}`).join(", ");

  const prompt = `Actúa como un experto consultor de negocios. Analiza el siguiente inventario y las ventas recientes de mi tienda física. 
  Proporciona 3 recomendaciones estratégicas cortas y accionables para mejorar mis ingresos o gestión de stock.
  Inventario: ${inventorySummary}
  Ventas recientes: ${salesSummary}
  Responde en formato JSON con la siguiente estructura: { "insights": [ { "title": "...", "description": "..." } ] }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    // response.text is a property, not a method.
    const result = JSON.parse(response.text || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return [
      { title: "Analiza tu stock", description: "Revisa los productos con bajo movimiento para realizar promociones." },
      { title: "Optimiza pedidos", description: "Los productos estrella parecen estar agotándose rápido." }
    ];
  }
};
