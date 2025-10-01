
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShoppingBag, Heart, Key } from "lucide-react";
import PasswordChangeForm from './PasswordChangeForm';
import OrderHistory from './OrderHistory';
import WishlistSection from './WishlistSection';

interface AccountTabsProps {
  children?: React.ReactNode;
  defaultTab?: string;
}

const AccountTabs: React.FC<AccountTabsProps> = ({ children, defaultTab = "profile" }) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
        </TabsTrigger>
        {/* <TabsTrigger value="wishlist" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Wishlist</span>
        </TabsTrigger> */}
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <div className="space-y-6">
          {children}
        </div>
      </TabsContent>
      
      <TabsContent value="orders">
        <OrderHistory />
      </TabsContent>
      
      <TabsContent value="wishlist">
        <WishlistSection />
      </TabsContent>
      
      <TabsContent value="security">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Security Settings</h2>
          <div className="max-w-md mx-auto">
            <PasswordChangeForm />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AccountTabs;
