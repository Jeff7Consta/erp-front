import React from "react";
import { useForm, Controller, FieldValues, Path, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export type FormField<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: "text" | "number" | "email" | "password" | "textarea" | "select" | "checkbox" | "switch";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
};

interface DynamicFormProps<T extends FieldValues> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: Partial<T>;
  schema?: z.ZodType<any, any>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
}

function FormComponent<T extends FieldValues>({
  fields,
  onSubmit,
  defaultValues = {},
  schema,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  onCancel,
  loading = false,
}: DynamicFormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    defaultValues: defaultValues as T,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  React.useEffect(() => {
    reset(defaultValues as T);
  }, [defaultValues, reset]);

  const renderField = (field: FormField<T>, control: Control<T>) => {
    if (field.hidden) return null;

    switch (field.type) {
      case "textarea":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="mb-4">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={value as string || ""}
                  onChange={onChange}
                  ref={ref}
                  disabled={field.disabled || loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );

      case "select":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="mb-4">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Select
                  onValueChange={onChange}
                  defaultValue={value as string}
                  disabled={field.disabled || loading}
                >
                  <SelectTrigger id={field.name} className={errors[field.name] ? "border-red-500" : ""}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id={field.name}
                  checked={value as boolean}
                  onCheckedChange={onChange}
                  ref={ref}
                  disabled={field.disabled || loading}
                />
                <Label htmlFor={field.name}>{field.label}</Label>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm ml-2">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );

      case "switch":
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Switch
                  id={field.name}
                  checked={value as boolean}
                  onCheckedChange={onChange}
                  ref={ref}
                  disabled={field.disabled || loading}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm ml-2">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );

      default:
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="mb-4">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={value as string || ""}
                  onChange={onChange}
                  ref={ref}
                  disabled={field.disabled || loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            )}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => renderField(field, control))}
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button 
            type="button" 
            onClick={onCancel} 
            variant="outline"
            disabled={loading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

export default FormComponent;
