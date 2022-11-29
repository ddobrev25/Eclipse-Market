import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ChatGetAllByUserIdResponse,
  ChatGetByIdResponse,
} from 'src/app/core/models/chat.model';
import {
  Message,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/http/chat.service';
import { MsgService } from 'src/app/core/services/http/message.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.scss'],
})
export class AccountMessagesComponent implements OnInit {
  @ViewChild('msgInput') msgInput!: ElementRef;
  @ViewChild('editDialog') editDialog!: ElementRef;

  fetchSubs?: Subscription;
  fetchChatsSubs?: Subscription;
  messageSubs?: Subscription;
  sendMessageSubs?: Subscription;

  chatIsSelected: boolean = false;
  chats: ChatGetAllByUserIdResponse = [];
  selectedChat?: ChatGetByIdResponse;

  primaryMessages?: Message[];
  secondaryMessages?: Message[];
  combinedMessages?: Message[];

  constructor(
    private userDataService: UserDataService,
    private chatService: ChatService,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    this.fetchChatsSubs = this.userDataService.userData.subscribe({
      next: (data) => {
        if (data && data.chats) {
          this.chats = data.chats;
          return;
        } else {
          this.fetchSubs = this.chatService.getAllByUserId().subscribe({
            next: (resp: ChatGetAllByUserIdResponse) => {
              const tempBody = {
                chats: resp
              }
              this.userDataService.setUserData(tempBody);
              this.chats = resp;
            },
            error: (err) => console.log(err),
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  separateMessage(message: Message): boolean {
    if (this.primaryMessages?.includes(message)) {
      return true;
    }
    return false;
  }

  onSelectChat(selectedChat: ChatGetByIdResponse) {
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
    this.messageSubs = this.msgService
      .getAllByChatId(this.selectedChat.id)
      .subscribe({
        next: (resp: MessageGetAllByChatIdResponse) => {
          console.log(resp);
          this.primaryMessages = resp.primaryMessages;
          this.secondaryMessages = resp.secondaryMessages;
          this.combinedMessages = [
            ...this.primaryMessages,
            ...this.secondaryMessages,
          ];
          this.combinedMessages.sort(function (a, b) {
            return a.timeSent.localeCompare(b.timeSent);
          });
          this.combinedMessages.reverse();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onSendMessage() {
    if (this.selectedChat) {
      const body: MessageSendRequest = {
        body: this.msgInput.nativeElement.value,
        chatId: this.selectedChat.id,
      };
      this.sendMessageSubs = this.msgService.send(body).subscribe({
        next: (resp: any) => {
          this.msgInput.nativeElement.value = null;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  onRightClick(event: any) {
    event.preventDefault();

    const dialogEl = event.target.parentNode.nextSibling;
    dialogEl.classList.toggle('visible');
  }

  test(event: any) {
    const dialogEl = event.target.parentNode.nextSibling;
    dialogEl.classList.toggle('visible');
  }

  ngOnDestroy() {
    this.chatIsSelected = false;
    this.fetchSubs?.unsubscribe();
    this.fetchChatsSubs?.unsubscribe();
    this.messageSubs?.unsubscribe();
    this.sendMessageSubs?.unsubscribe();
  }
}
