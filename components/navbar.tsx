'use client'

import Link from 'next/link';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { CartButton } from './cart-button';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-green-800 text-white p-4">
      <div className="max-w-7xl mx-auto px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <Link href="/" className="hover:text-green-200 transition-colors">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/products" className="hover:text-green-200 transition-colors">
                Products
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="absolute right-4 top-4 flex items-center space-x-4">
          <CartButton />
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="hover:text-green-200 transition-colors">
                Hi, {session.user?.name || session.user?.email}
              </Link>
              <Button variant="ghost" onClick={() => signOut()} className="hover:text-green-200">
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hover:text-green-200 transition-colors">
                Login
              </Link>
              <Link href="/register" className="hover:text-green-200 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
