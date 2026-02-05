import Realm from 'realm';
import { UserSchema, LocationSchema, SettingsSchema } from '@/models/realm';

/**
 * Realm Database Service
 * Quản lý offline storage cho User, Location, Settings
 */
class RealmService {
  private realm: Realm | null = null;
  private static instance: RealmService;

  private constructor() {}

  static getInstance(): RealmService {
    if (!RealmService.instance) {
      RealmService.instance = new RealmService();
    }
    return RealmService.instance;
  }

  /**
   * Initialize Realm database
   */
  async initialize(): Promise<void> {
    try {
      this.realm = await Realm.open({
        schema: [UserSchema, LocationSchema, SettingsSchema],
        schemaVersion: 1,
        onMigration: (oldRealm: Realm, newRealm: Realm) => {
          // Migration logic nếu cần
          console.log('Realm migration from version', oldRealm.schemaVersion, 'to', newRealm.schemaVersion);
        },
      });
      console.log('Realm initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Realm:', error);
      throw error;
    }
  }

  /**
   * Get Realm instance
   */
  getRealm(): Realm {
    if (!this.realm) {
      throw new Error('Realm not initialized. Call initialize() first.');
    }
    return this.realm;
  }

  /**
   * Close Realm connection
   */
  close(): void {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }

  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Save user to Realm
   */
  saveUser(user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    status?: string;
  }): void {
    const realm = this.getRealm();
    realm.write(() => {
      realm.create(
        'User',
        {
          _id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          status: user.status || 'online',
          lastSeen: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): UserSchema | null {
    const realm = this.getRealm();
    return realm.objectForPrimaryKey<UserSchema>('User', userId);
  }

  /**
   * Get current logged-in user (first user in DB)
   */
  getCurrentUser(): UserSchema | null {
    const realm = this.getRealm();
    const users = realm.objects<UserSchema>('User');
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): void {
    const realm = this.getRealm();
    const user = realm.objectForPrimaryKey<UserSchema>('User', userId);
    if (user) {
      realm.write(() => {
        realm.delete(user);
      });
    }
  }

  /**
   * Clear all users
   */
  clearAllUsers(): void {
    const realm = this.getRealm();
    realm.write(() => {
      const users = realm.objects<UserSchema>('User');
      realm.delete(users);
    });
  }

  // ============================================
  // LOCATION OPERATIONS
  // ============================================

  /**
   * Save location
   */
  saveLocation(location: {
    id: string;
    userId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
  }): void {
    const realm = this.getRealm();
    realm.write(() => {
      realm.create(
        'Location',
        {
          _id: location.id,
          userId: location.userId,
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed || 0,
          heading: location.heading || 0,
          accuracy: location.accuracy || 0,
          timestamp: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  }

  /**
   * Get latest location for user
   */
  getLatestLocation(userId: string): LocationSchema | null {
    const realm = this.getRealm();
    const locations = realm
      .objects<LocationSchema>('Location')
      .filtered('userId == $0', userId)
      .sorted('timestamp', true);
    return locations.length > 0 ? locations[0] : null;
  }

  /**
   * Get all locations for user
   */
  getUserLocations(userId: string): Realm.Results<LocationSchema> {
    const realm = this.getRealm();
    return realm
      .objects<LocationSchema>('Location')
      .filtered('userId == $0', userId)
      .sorted('timestamp', true);
  }

  /**
   * Delete old locations (keep last 100)
   */
  cleanupOldLocations(userId: string): void {
    const realm = this.getRealm();
    const locations = realm
      .objects<LocationSchema>('Location')
      .filtered('userId == $0', userId)
      .sorted('timestamp', true);
    
    if (locations.length > 100) {
      realm.write(() => {
        const toDelete = locations.slice(100);
        realm.delete(toDelete);
      });
    }
  }

  // ============================================
  // SETTINGS OPERATIONS
  // ============================================

  /**
   * Save settings
   */
  saveSettings(settings: {
    id: string;
    userId: string;
    ghostMode?: boolean;
    dndMode?: boolean;
    shareLocation?: boolean;
    theme?: string;
    language?: string;
  }): void {
    const realm = this.getRealm();
    realm.write(() => {
      realm.create(
        'Settings',
        {
          _id: settings.id,
          userId: settings.userId,
          ghostMode: settings.ghostMode ?? false,
          dndMode: settings.dndMode ?? false,
          shareLocation: settings.shareLocation ?? true,
          theme: settings.theme || 'light',
          language: settings.language || 'vi',
          updatedAt: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  }

  /**
   * Get settings for user
   */
  getSettings(userId: string): SettingsSchema | null {
    const realm = this.getRealm();
    const settings = realm
      .objects<SettingsSchema>('Settings')
      .filtered('userId == $0', userId);
    return settings.length > 0 ? settings[0] : null;
  }

  /**
   * Update specific setting
   */
  updateSetting(userId: string, key: keyof SettingsSchema, value: any): void {
    const realm = this.getRealm();
    const settings = this.getSettings(userId);
    if (settings) {
      realm.write(() => {
        (settings as any)[key] = value;
        settings.updatedAt = new Date();
      });
    }
  }
}

export default RealmService.getInstance();
