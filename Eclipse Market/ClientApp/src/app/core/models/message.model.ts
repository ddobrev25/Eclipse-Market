export type Message = {
  id: number;
  body: string;
  timeSent: string;
  userName: string;
  chatId: number;
};

export type MessageGetAllByChatIdResponse = {
  primaryMessages: Message[];
  secondaryMessages: Message[];
};

export type MessageSendRequest = {
  body: string;
  chatId: number;
}

export type MessageEditRequest = {
  id: number;
  newBody: string;
};

export type Message$ = {
  combinedMessages: Message[]
}

export type Chat$ = {
  chatId: number;
  topicListingTitle: string;
  primaryMessages: Message[] | null;
  secondaryMessages: Message[] | null;
  combinedMessages: Message[] | null;
}[];

