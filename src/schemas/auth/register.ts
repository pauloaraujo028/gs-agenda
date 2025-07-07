import * as z from "zod";

export const registerSchema = z.object({
  username: z.optional(z.string()),
  firstName: z.string().min(1, {
    message: "O nome é obrigatório",
  }),
  lastName: z.string().min(1, {
    message: "O nome é obrigatório",
  }),
  email: z.string().email({
    message: "Digite um e-mail válido",
  }),
  password: z.string().min(4, {
    message: "A senha é obrigatória",
  }),
  confirmPassword: z.string().min(4, {
    message: "A confirmação de senha é obrigatória",
  }),
});
