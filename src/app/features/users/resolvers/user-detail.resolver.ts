/**
 * LEARNING: ResolveFn runs before route activation; return Observable/Promise or plain data.
 * Errors can redirect via Router.parseUrl — here we propagate to error handler.
 */

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import type { User } from '../../../core/models/user.model';
import { UserService } from '../services/user.service';

export const userDetailResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  if (!id) {
    throw new Error('User id is required');
  }
  return userService.getUserById(id);
};
