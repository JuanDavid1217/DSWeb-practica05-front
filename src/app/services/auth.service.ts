import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.checkAuthentication();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }

  private checkAuthentication(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}
