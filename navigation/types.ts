import { GroupChatRoom } from '../utils/types';

type RootStackParamList = {
  Home: undefined;
  Invitations: undefined;
  QRInvite: undefined;
  ScanQR: {
    type: 'individual' | 'group';
  };
  Profile: undefined;
  EditProfile: undefined;
  Chat: {
    room:
      | {
          type: 'group';
          participants: string[];
          admin: string;
          photo: string;
          name: string;
          id: string;
        }
      | {
          id: string;
          type: 'individual';
          other: {
            name: string;
            photo: string;
            about: string;
            phoneNumber: string;
            id: string;
          };
        };
  };
  CreateGroup: undefined;
  JoinGroup: undefined;
  GroupQR: {
    room: GroupChatRoom;
  };
};

export type { RootStackParamList };
