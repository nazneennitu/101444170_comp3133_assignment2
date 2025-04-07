import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'auth_user';

  // ✅ Save auth token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // ✅ Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Save user object (as JSON)
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // ✅ Get user object
  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // ✅ Remove both token and user info
  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ✅ Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
