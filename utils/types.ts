type User = {
  id: string;
  name: string;
  photo: string;
  about: string;
  phoneNumber: string;
};

type Group = {
  id: string;
  name: string;
  participants: string[];
  admin: string;
  photo: string;
  description: string;
  createdAt: Date;
};

type Message = {
  id: string;
  type: 'text' | 'image' | 'video' | 'document';
  text: string;
  file: string;
  sender: User;
  createdAt: Date;
} & (
  | { recipientType: 'user'; recipient: User }
  | { recipientType: 'group'; recipient: Group }
);

type Invitation = {
  id: string;
  recipient: User;
  createdAt: Date;
} & (
  | { senderType: 'user'; sender: User }
  | { senderType: 'group'; sender: Group }
);

export { User, Group, Message, Invitation };
