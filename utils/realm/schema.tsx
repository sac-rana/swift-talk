import { Realm } from '@realm/react';
import { User as U, Group as G } from '../types';

export class User extends Realm.Object<User> {
  id!: string;
  name!: string;
  photo!: string;
  about!: string;
  phoneNumber!: string;
  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      photo: 'string',
      about: 'string',
      phoneNumber: 'string',
    },
  };
}

export class Message extends Realm.Object<
  Message,
  'type' | 'text' | 'file' | 'sender' | 'recipientType' | 'createdAt'
> {
  id!: string;
  type!: 'text' | 'image' | 'video' | 'document';
  text!: string;
  file!: string;
  sender!: U;
  recipientType!: 'user' | 'group';
  recipient!: U | G;
  createdAt!: Date;
  static schema: Realm.ObjectSchema = {
    name: 'Message',
    primaryKey: 'id',
    properties: {
      id: 'string',
      type: 'string',
      text: 'string',
      file: 'string',
      sender: '{}',
      recipientType: 'string',
      recipient: '{}',
      createdAt: 'date',
    },
  };
}

export class Group extends Realm.Object<Group> {
  id!: string;
  name!: string;
  participants!: string[];
  admin!: string;
  photo!: string;
  description!: string;
  createdAt!: Date;
  static schema: Realm.ObjectSchema = {
    name: 'Group',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', indexed: true },
    },
  };
}
