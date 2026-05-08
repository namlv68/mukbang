import { GoogleGenAI } from '@google/genai';

export const executeAiWithFallback = async (
  apiKeys: string[],
  activeKeyIndex: number,
  setActiveKeyIndex: (index: number) => void,
  taskFn: (genAI: GoogleGenAI) => Promise<any>
) => {
  if (!apiKeys || apiKeys.length === 0) {
    throw new Error("Không tìm thấy API Key nào. Vui lòng thêm API Key.");
  }

  let lastError: any = null;

  for (let i = activeKeyIndex; i < apiKeys.length; i++) {
    try {
      const genAI = new GoogleGenAI({ apiKey: apiKeys[i] });
      const result = await taskFn(genAI);
      if (i !== activeKeyIndex) {
        setActiveKeyIndex(i);
      }
      return result;
    } catch (err: any) {
      console.warn(`API Key at index ${i} failed:`, err);
      lastError = err;
    }
  }

  for (let i = 0; i < activeKeyIndex; i++) {
    try {
      const genAI = new GoogleGenAI({ apiKey: apiKeys[i] });
      const result = await taskFn(genAI);
      setActiveKeyIndex(i);
      return result;
    } catch (err: any) {
      console.warn(`API Key at index ${i} failed:`, err);
      lastError = err;
    }
  }

  throw new Error("Tất cả API keys đều bị lỗi. Vui lòng kiểm tra lại.\n\nChi tiết: " + (lastError?.message || "Unknown"));
};
