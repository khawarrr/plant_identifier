"use client";
import React from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-green-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Plant Identifier
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-green-200">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-green-200">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-green-200">
            Contact
          </Link>
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-white hover:text-green-200">
                  Sign In/Up
                </button>
              </SignInButton>
              {/* <SignUpButton mode="modal">
                <button className="text-white hover:text-green-200">
                  Sign Up
                </button>
              </SignUpButton> */}
            </>
          ) : (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
