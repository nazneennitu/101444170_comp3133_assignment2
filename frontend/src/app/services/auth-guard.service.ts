import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);
  const token = session.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
