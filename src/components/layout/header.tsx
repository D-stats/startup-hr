'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/i18n/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

interface HeaderProps {
  user: {
    email?: string;
    user_metadata?: {
      name?: string;
    };
  };
  organization: {
    name: string;
    slug: string;
  };
}

export function Header({ user, organization }: HeaderProps): JSX.Element {
  const router = useRouter();
  const t = useTranslations();

  const handleSignOut = async () => {
    // TODO: Implement sign out without Supabase
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">{t('navigation.dashboard')}</h1>
        <span className="text-sm text-muted-foreground">・ {organization.name}</span>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user.user_metadata?.name ?? t('common.user')}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              {t('navigation.personalSettings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('common.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
