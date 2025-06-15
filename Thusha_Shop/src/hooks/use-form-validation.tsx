
import { useState } from 'react';
import { z } from 'zod';
import { useToast } from './use-toast';

export interface ValidationError {
  path: string[];
  message: string;
}

export function useFormValidation<T extends z.ZodSchema<any>>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = (data: any): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field];
  };

  const clearErrors = () => setErrors({});

  const showValidationToast = () => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return {
    errors,
    validate,
    getFieldError,
    clearErrors,
    showValidationToast,
  };
}
