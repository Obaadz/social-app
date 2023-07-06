import bcrypt from "bcrypt";

const saltRounds = 10;

export default async (password: string) => await bcrypt.hash(password, saltRounds);
