import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

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
        validate(value: any) {
          try {
            if (!value) return false;
            // First check if it's a valid phone number
            if (!isValidPhoneNumber(value)) return false;
            
            // Parse the phone number to get additional validation
            const phoneNumber = parsePhoneNumber(value);
            return phoneNumber.isValid();
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number in international format (e.g., +1234567890)`;
        },
      },
    });
  };
} 