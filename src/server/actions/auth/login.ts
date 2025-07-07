"use server";

import { getUserByEmail } from "@/data/user";
import { loginSchema } from "@/schemas/auth/login";
import { signIn } from "@/server/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/server/routes";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

export const login = async (data: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Falha ao fazer login, verifique os dados digitados",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { error: "Email ou senha incorretos" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Email ou senha incorretos" };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    revalidatePath("/dashboard");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Email ou senha incorretos",
          };
        default:
          return {
            error: "Erro ao fazer login, tente novamente mais tarde",
          };
      }
    }

    throw error;
  }

  return {
    success: "Login realizado com sucesso!",
  };
};

export const validateLoginCredentials = async (
  data: z.infer<typeof loginSchema>,
) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Verifique o formato do email e senha.",
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password) {
    return { error: "Email ou senha incorretos." };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: "Email ou senha incorretos." };
  }

  return { success: "Credenciais válidas." };
};
