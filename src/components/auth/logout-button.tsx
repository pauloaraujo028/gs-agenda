"use client";

import { logout } from "@/server/actions/auth";

type LogoutButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <span onClick={onClick} className={`${className}`}>
      {children}
    </span>
  );
};
