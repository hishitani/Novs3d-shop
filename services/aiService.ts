import { GoogleGenAI } from '@google/genai';

/**
 * Service to generate AI product descriptions and shopping assistance
 */
export async function generateProductDescriptionAI(title: string, category: string, specs: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Напиши привлекательное, продающее и профессиональное описание для товара в интернет-магазине электроники и гаджетов. 
Товар: ${title}
Категория: ${category}
Ключевые характеристики: ${specs}

Описание должно быть на русском языке, состоять из 3-4 предложений, подчеркивать 3D технологичность, удобство и ключевые плюсы.`
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) return data.text.trim();
    }
  } catch (err) {
    console.warn('Backend AI proxy unavailable, trying fallback generation logic:', err);
  }

  // Smart fallback template generator
  return `Инновационный ${title.toLowerCase()} из категории ${category.toLowerCase()} — это воплощение стиля, передовых технологий и эргономики. Создан с применением премиальных материалов и оснащен высокой энергоэффективностью для максимального комфорта в повседневном использовании. Идеальный выбор для тех, кто ценит качество, надежность и современный 3D-дизайн.`;
}
