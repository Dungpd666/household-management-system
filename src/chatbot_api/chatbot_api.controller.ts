import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Param,
    UseGuards,
    } from '@nestjs/common';
import { ChatbotApiService } from './chatbot_api.service';
import { SendMessageDto } from './dto/send-message.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

    @Controller('chatbot-api')
    export class ChatbotApiController {
    constructor(private readonly chatbotApiService: ChatbotApiService) {}

    @Post('send')
    async sendMessage(@Body() dto: SendMessageDto) {
        const response = await this.chatbotApiService.sendMessage(
        dto.message,
        dto.userId,
        );
        return {
        success: true,
        data: response,
        };
    }

    @Get('history/:userId')
    async getChatHistory(@Param('userId') userId: string) {
        const history = await this.chatbotApiService.getChatHistory(userId);
        return {
        success: true,
        data: history,
        };
    }

    @Delete('history/:userId')
    async clearChatHistory(@Param('userId') userId: string) {
        await this.chatbotApiService.clearChatHistory(userId);
        return {
        success: true,
        message: 'Chat history cleared successfully',
        };
    }

    @Get('health')
    async healthCheck() {
        const isHealthy = await this.chatbotApiService.healthCheck();
        return {
        success: true,
        status: isHealthy ? 'online' : 'offline',
        };
    }
}
