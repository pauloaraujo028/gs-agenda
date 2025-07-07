"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/prisma";
import { generateUniqueUsername } from "@/lib/utils";
import { registerSchema } from "@/schemas/auth/register";
import bcrypt from "bcryptjs";
import z from "zod";

export const register = async (data: z.infer<typeof registerSchema>) => {
  try {
    const validatedFields = registerSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Falha ao criar a conta, verifique os dados digitados",
      };
    }

    const { firstName, lastName, email, password, confirmPassword } =
      validatedFields.data;

    if (password !== confirmPassword) {
      return {
        error: "As senhas não conferem",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return {
        error: "Usuário já existe",
      };
    }

    const username = await generateUniqueUsername(firstName, lastName);

    const lowercaseEmail = email.toLowerCase();

    await db.user.create({
      data: {
        firstName,
        lastName,
        email: lowercaseEmail,
        password: hashedPassword,
        username: username || "Default",
      },
    });

    return {
      success: "Cadastro realizado com sucesso",
    };
  } catch {
    return {
      error: "Erro ao cadastrar usuário, tente novamente mais tarde",
    };
  }
};
