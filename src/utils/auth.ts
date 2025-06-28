import { StorageManager } from './storage';
import type { User } from '../types';

export class AuthManager {
  private static currentUser: User | null = null;

  static login(username: string, password: string): boolean {
    // Demo credentials with multiple users
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        name: 'Administrator',
        role: 'admin' as const,
        isActive: true,
        password: 'admin123'
      },
      {
        id: '2',
        username: 'teacher1',
        name: 'Malika Karimova',
        role: 'teacher' as const,
        isActive: true,
        password: 'teacher123'
      },
      {
        id: '3',
        username: 'teacher2',
        name: 'Nodira Tosheva',
        role: 'teacher' as const,
        isActive: true,
        password: 'teacher123'
      }
    ];

    const users = StorageManager.load<any[]>('users', defaultUsers);

    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    
    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      };
      StorageManager.save('currentUser', this.currentUser);
      StorageManager.save('isLoggedIn', true);
      return true;
    }

    return false;
  }

  static logout(): void {
    this.currentUser = null;
    StorageManager.remove('currentUser');
    StorageManager.save('isLoggedIn', false);
  }

  static getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.currentUser = StorageManager.load('currentUser', null);
    }
    return this.currentUser;
  }

  static isLoggedIn(): boolean {
    return StorageManager.load('isLoggedIn', false) && this.getCurrentUser() !== null;
  }

  static changePassword(oldPassword: string, newPassword: string): boolean {
    const users = StorageManager.load<any[]>('users', []);
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) return false;

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return false;

    if (users[userIndex].password === oldPassword) {
      users[userIndex].password = newPassword;
      StorageManager.save('users', users);
      return true;
    }
    return false;
  }

  static getAllUsers(): any[] {
    return StorageManager.load('users', []);
  }

  static addUser(userData: any): boolean {
    const users = StorageManager.load<any[]>('users', []);
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isActive: true
    };
    users.push(newUser);
    StorageManager.save('users', users);
    return true;
  }
}