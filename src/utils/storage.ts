// Local Storage utilities for data persistence
export class StorageManager {
  private static prefix = 'kindergarten_srm_';

  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.error('Ma\'lumotlarni saqlashda xatolik:', error);
    }
  }

  static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  static exportData(): string {
    const data = {
      children: this.load('children', []),
      attendance: this.load('attendance', []),
      payments: this.load('payments', []),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.children) this.save('children', data.children);
      if (data.attendance) this.save('attendance', data.attendance);
      if (data.payments) this.save('payments', data.payments);
      return true;
    } catch (error) {
      console.error('Ma\'lumotlarni import qilishda xatolik:', error);
      return false;
    }
  }
}