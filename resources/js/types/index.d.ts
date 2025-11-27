import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Task {
    id: number
    subject: string
    title: string
    description: string
    class_name: string
    uploader_id: number
    progress: number 
    due_date: string
}

export type CommentType = {
  id: number;
  user_id: number;
  sub_task_id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: User; // eager-loaded user
};

export type SubTaskType = {
  id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
};