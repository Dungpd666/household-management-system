import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatbotApiService {
    private readonly logger = new Logger(ChatbotApiService.name);

    private readonly CHATBOT_API_URL =
    process.env.CHATBOT_API_URL || 'http://0.0.0.0:8000';

    constructor(private readonly httpService: HttpService) {}

    async sendMessage(message: string, userId?: string): Promise<any> {
        const payload = {
            message,
            session_id: userId?.toString() || 'anonymous',
            // timestamp: new Date().toISOString(),
            };

        // this.logger.debug(
        //   `Sending message to chatbot API: ${JSON.stringify(payload)}`,
        // );

        try {
        const response = await firstValueFrom(
            this.httpService.post(`${this.CHATBOT_API_URL}/chat`, payload),
        );

        //   this.logger.debug(`Chatbot response: ${JSON.stringify(response.data)}`);
        return response.data;
        } catch (error) {
        this.logger.error(`Chatbot API error: ${error.message}`);
        throw new HttpException(
            error.response?.data?.message || 'Chatbot service unavailable',
            error.response?.status || 500,
        );
        }
    }


    async getChatHistory(userId: string): Promise<any> {
        try {
        const response = await firstValueFrom(
            this.httpService.get(`${this.CHATBOT_API_URL}/chat/history/${userId}`),
        );
        return response.data;
        } catch (error) {
        this.logger.error(`Get chat history error: ${error.message}`);
        throw new HttpException(
            error.response?.data?.message || 'Failed to get chat history',
            error.response?.status || 500,
        );
        }
    }

    async clearChatHistory(userId: string): Promise<any> {
        try {
        const response = await firstValueFrom(
            this.httpService.delete(
            `${this.CHATBOT_API_URL}/chat/history/${userId}`,
            ),
        );
        return response.data;
        } catch (error) {
        this.logger.error(`Clear chat history error: ${error.message}`);
        throw new HttpException(
            error.response?.data?.message || 'Failed to clear chat history',
            error.response?.status || 500,
        );
        }
    }


    async healthCheck(): Promise<boolean> {
        try {
        const response = await firstValueFrom(
            this.httpService.get(`${this.CHATBOT_API_URL}/health`),
        );
        return response.status === 200;
        } catch {
        return false;
        }
    }
}
