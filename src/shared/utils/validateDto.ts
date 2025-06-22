import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export async function validateDto<T extends object>(
  dtoClass: new (...args: any[]) => T,
  payload: any
): Promise<{ instance: T; errors: null | any[] }> {
  const instance = plainToInstance(dtoClass, payload);

  const errors = await validate(instance);

  if (errors.length > 0) {
    const formattedErrors = errors.map((e) => ({
      property: e.property,
      constraints: e.constraints,
    }));
    return { instance, errors: formattedErrors };
  }

  return { instance, errors: null };
}
