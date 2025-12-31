import axiosClient from './axiosClient';

export type ChatbotSendRequest = {
  message: string;
  userId?: string;
};

export type ChatbotSendResponse = {
  success: boolean;
  data: unknown;
};

export type ChatbotHealthResponse = {
  success: boolean;
  status: 'online' | 'offline' | string;
};

const BASE = '/chatbot-api';

const extractText = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (!data || typeof data !== 'object') return String(data ?? '');

  const obj = data as Record<string, unknown>;
  const candidates = [
    obj.answer,
    obj.message,
    obj.response,
    obj.text,
    obj.result,
    obj.output,
  ];
  const firstText = candidates.find((v) => typeof v === 'string' && v.trim().length > 0) as string | undefined;
  if (firstText) return firstText;

  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
};

export const chatbotApi = {
  send: async (payload: ChatbotSendRequest) => {
    const res = await axiosClient.post<ChatbotSendResponse>(`${BASE}/send`, payload);
    return {
      raw: res.data,
      text: extractText(res.data?.data),
    };
  },

  health: async () => {
    const res = await axiosClient.get<ChatbotHealthResponse>(`${BASE}/health`);
    return res.data;
  },
};
