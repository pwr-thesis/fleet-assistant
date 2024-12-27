import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './service/chat.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/service/auth.service';

export interface History {
    role: string;
    content: string;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIcon],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    isChatboxOpen = false;
    messages: string[] = [
        'Bot: Hello! 👋 I’m your Fleet Assistant AI Bot, here to help you manage your fleet more efficiently. 🚛🚗',
    ];
    newMessage = '';
    isButtonDisabled = false;

    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
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
        } catch {
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
        }, 60000);
    }

    buildChatHistory(): History[] {
        const history = [
            {
                role: 'system',
                content: this.botPrompt,
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
        localStorage.setItem('chatHistory', JSON.stringify(this.messages));
    }

    loadChatState(): void {
        const savedMessages = localStorage.getItem('chatHistory');

        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        }
    }

    clearChatHistory(): void {
        localStorage.removeItem('chatHistory');
        this.messages = [];
    }

    private botPrompt =
        'You are the AI Bot for the Fleet Assistant Web System. ' +
        'Your role is to assist users in managing their fleet operations effectively by providing information, guidance, and support within the vehicles and their maintenance. ' +
        "Here's what you need to know about your role:\n" +
        '\n' +
        '    Purpose:\n' +
        '        Help users with their cars.\n' +
        '        Assist in managing vehicles, drivers, and other fleet-related operations.\n' +
        '\n' +
        '    Tone and behavior:\n' +
        '        Be professional, friendly, and clear in your responses.\n' +
        '        Answer mx. 100 words in each message. \n' +
        '        Guide users step-by-step if they need help with complex operations.\n' +
        '        Avoid overly technical language unless requested.\n' +
        '\n' +
        '    Context:\n' +
        '        The system is used by a variety of users, from a single service provider to multiple users in the future.\n' +
        '        Always ensure your responses are accurate and relevant to the user’s query.\n' +
        '\n' +
        'From now on, respond as though you are embedded in this system. Acknowledge and confirm any configuration changes requested by the user.';
}
