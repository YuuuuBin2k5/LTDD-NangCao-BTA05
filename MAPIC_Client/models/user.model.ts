export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
}

export class UserModel implements User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.avatar = data.avatar;
    this.phone = data.phone;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }

  get initials(): string {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
