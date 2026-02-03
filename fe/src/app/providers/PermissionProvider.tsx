"use client";

import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/features/Auth/AuthSlice";
import { AUTH_ROLE, AUTH_SESSION_TOKEN } from "../../../constants/tokenKey";

const PermissionContext = createContext({});

export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = Cookies.get(AUTH_SESSION_TOKEN);
    const role = Cookies.get(AUTH_ROLE) as "Admin" | "Customer" | undefined;

    if (token && role) {
      dispatch(setAuth({ token, role }));
    }
  }, []);

  return (
    <PermissionContext.Provider value={{}}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionIndex = () => useContext(PermissionContext);
