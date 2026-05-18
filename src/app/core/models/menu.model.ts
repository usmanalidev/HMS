/**
 * ROLE: Sidebar/navigation item model with role-based visibility.
 * WHEN IT RUNS: Built by MenuService and rendered in MainLayoutComponent.
 * WHAT IT DOES: Describes route, icon, label, and which roles may see each item.
 */

import type { UserRole } from './user.model';

/** Single entry in the application sidebar navigation. */
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
  children?: MenuItem[];
  badge?: number;
  dividerAfter?: boolean;
}
