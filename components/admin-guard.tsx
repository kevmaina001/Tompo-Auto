"use client";

import { useUser } from "@clerk/nextjs";
import { ShieldX, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

// Get admin emails from environment variable
const getAdminEmails = (): string[] => {
  const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return emails.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
};

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, they'll be redirected by middleware
  if (!user) {
    return null;
  }

  // Check if user's email is in admin list
  const adminEmails = getAdminEmails();
  const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = userEmail && adminEmails.includes(userEmail);

  // Show access denied if not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access the admin panel. Only authorized administrators can access this area.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Signed in as: <span className="font-medium">{userEmail}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline">Go to Store</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Sign in with different account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User is authorized, render children
  return <>{children}</>;
}
