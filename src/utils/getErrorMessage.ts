import { ZodError } from "zod";

export default (error: any): string => {
  if (error instanceof ZodError) {
    const errorsAfterParse = JSON.parse(error.message);

    return errorsAfterParse[0]?.message || error.message || "Something went wrong";
  }

  return error.message || "Something went wrong";
};
