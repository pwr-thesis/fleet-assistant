/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIcon],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    isChatboxOpen = false;
    messages: string[] = [];
    newMessage = '';
    isButtonDisabled = false;
    userLogin = '';

    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.userLogin = this.authService.getUserInfo()?.email || '';
        this.loadChatState();
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    async sendMessage(): Promise<void> {
        if (!this.newMessage.trim()) return;
        this.disableButton();

        this.messages.push(`You: ${this.newMessage}`);
        this.newMessage = '';

        const chatHistory = this.buildChatHistory();

        try {
            const response = await this.chatService
                .sendMessage(chatHistory)
                .toPromise();
            const botMessage = response.choices[0].message.content;
            this.messages.push(`Bot: ${botMessage}`);
        } catch (error) {
            console.error('Error in chat service:', error);
            this.messages.push(
                'Bot: Sorry, there was an error processing your request. Try again!'
            );
        }

        this.saveChatState();
    }

    disableButton(): void {
        this.isButtonDisabled = true;
        setTimeout(() => {
            this.isButtonDisabled = false;
        }, 30000);
    }

    buildChatHistory(): any[] {
        const history = [
            {
                role: 'system',
                content:
                    'You are an AI assistant that helps people find information.',
            },
        ];

        this.messages.forEach((msg) => {
            const role = msg.startsWith('You:') ? 'user' : 'assistant';
            history.push({
                role,
                content: msg.replace(/^(You:|Bot:)/, '').trim(),
            });
        });

        return history;
    }

    toggleChatbox(): void {
        this.isChatboxOpen = !this.isChatboxOpen;
        this.saveChatState();
    }

    saveChatState(): void {
        const chatKey = this.getChatKey();
        localStorage.setItem(chatKey, JSON.stringify(this.messages));
        localStorage.setItem(
            `${chatKey}_isChatboxOpen`,
            JSON.stringify(this.isChatboxOpen)
        );
    }

    loadChatState(): void {
        const chatKey = this.getChatKey();
        const savedMessages = localStorage.getItem(chatKey);

        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        }

    }

    clearChatHistory(): void {
        const chatKey = this.getChatKey();
        localStorage.removeItem(chatKey);
        this.messages = [];
    }

    private getChatKey(): string {
        return `chat_${this.userLogin}`;
    }
}
