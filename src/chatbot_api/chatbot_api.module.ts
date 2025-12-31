import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatbotApiService } from './chatbot_api.service';
import { ChatbotApiController } from './chatbot_api.controller';

@Module({
    imports: [
        HttpModule.register({
        timeout: 30000,
        maxRedirects: 5,
        }),
    ],
    controllers: [ChatbotApiController],
    providers: [ChatbotApiService],
    exports: [ChatbotApiService],
})
export class ChatbotApiModule {}
