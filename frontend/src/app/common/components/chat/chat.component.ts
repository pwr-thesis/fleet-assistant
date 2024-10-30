import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: string[] = ["AI BOT to answer your questions"];
  newMessage = '';

  sendMessage(): void {
    console.log("Метод sendMessage вызван");
      if (this.newMessage.trim()) {
          console.log("if", this.messages)
          this.messages.push(`You: ${this.newMessage}`);
          this.newMessage = '';
          this.getBotResponse();
      }
      else{
        console.log("else")
      }
  }

  getBotResponse(): void {
      setTimeout(() => {
          this.messages.push("Bot: This is a sample response.");
      }, 1000);
  }
}
