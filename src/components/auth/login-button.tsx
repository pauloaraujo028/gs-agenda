"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: Implementar modal</span>;
  }

  return (
    <Button onClick={onClick} className="cursor-pointer" asChild={asChild}>
      {children}
    </Button>
  );
};
