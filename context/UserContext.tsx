"use client";

import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext({
  userProfile: null,
  setUserProfile: (_: any) => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<any>(null);
  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
