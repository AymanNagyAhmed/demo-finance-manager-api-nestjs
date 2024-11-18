import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Custom validator decorator that uses libphonenumber-js for robust phone validation
 */
export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;
          try {
            return isValidPhoneNumber(value);
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number`;
        },
      },
    });
  };
} 