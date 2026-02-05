/**
 * Realm Database Schemas
 * Defines data models for offline storage
 */

import Realm from 'realm';

/**
 * User Schema
 * Stores user profile information
 */
export class UserSchema extends Realm.Object<UserSchema> {
  _id!: string;
  email!: string;
  name!: string;
  avatar?: string;
  status!: string;
  lastSeen!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      email: 'string',
      name: 'string',
      avatar: 'string?',
      status: { type: 'string', default: 'online' },
      lastSeen: 'date',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

/**
 * Location Schema
 * Stores location history for users
 */
export class LocationSchema extends Realm.Object<LocationSchema> {
  _id!: string;
  userId!: string;
  latitude!: number;
  longitude!: number;
  speed!: number;
  heading!: number;
  accuracy!: number;
  timestamp!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Location',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      userId: 'string',
      latitude: 'double',
      longitude: 'double',
      speed: { type: 'double', default: 0 },
      heading: { type: 'double', default: 0 },
      accuracy: { type: 'double', default: 0 },
      timestamp: 'date',
    },
  };
}

/**
 * Settings Schema
 * Stores user preferences and settings
 */
export class SettingsSchema extends Realm.Object<SettingsSchema> {
  _id!: string;
  userId!: string;
  ghostMode!: boolean;
  dndMode!: boolean;
  shareLocation!: boolean;
  theme!: string;
  language!: string;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Settings',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      userId: 'string',
      ghostMode: { type: 'bool', default: false },
      dndMode: { type: 'bool', default: false },
      shareLocation: { type: 'bool', default: true },
      theme: { type: 'string', default: 'light' },
      language: { type: 'string', default: 'vi' },
      updatedAt: 'date',
    },
  };
}
