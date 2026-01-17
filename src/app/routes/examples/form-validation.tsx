import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Textarea, Checkbox, Button } from "@/components/ui";

const userRegistrationSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    age: z
      .string()
      .min(1, "Age is required")
      .refine((val) => !isNaN(Number(val)), "Age must be a number")
      .refine(
        (val) => Number.isInteger(Number(val)),
        "Age must be a whole number"
      )
      .refine((val) => Number(val) >= 18, "You must be at least 18 years old")
      .refine((val) => Number(val) <= 120, "Age must be realistic"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().min(1, "Please select a country"),
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters")
      .max(500, "Bio must be at most 500 characters")
      .optional()
      .or(z.literal("")),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
];

export default function FormValidationExample() {
  const [submittedData, setSubmittedData] =
    useState<UserRegistrationForm | null>(null);

  const form = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = (data: UserRegistrationForm) => {
    setSubmittedData(data);
    form.reset();
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-2 text-4xl font-bold">Zod Form Validation</h1>
      <p className="mb-8 text-gray-600">
        Form validation using Zod + React Hook Form
      </p>

      <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">User Registration</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="username"
            label="Username"
            placeholder="johndoe123"
            error={form.formState.errors.username?.message}
            {...form.register("username")}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          <Input
            id="age"
            label="Age"
            type="number"
            placeholder="25"
            error={form.formState.errors.age?.message}
            {...form.register("age")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />

          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <Select
                id="country"
                label="Country"
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                error={form.formState.errors.country?.message}
              >
                <option value="">Select an option</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />

          <Textarea
            id="bio"
            label="Bio (Optional)"
            placeholder="Tell us about yourself..."
            rows={4}
            error={form.formState.errors.bio?.message}
            {...form.register("bio")}
          />

          <Checkbox
            id="acceptTerms"
            label="I accept the terms and conditions"
            error={form.formState.errors.acceptTerms?.message}
            {...form.register("acceptTerms")}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Register
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>

      {submittedData && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-green-800">
            Form Submitted Successfully!
          </h3>
          <div className="rounded-lg bg-white p-4">
            <pre className="overflow-x-auto text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-4 text-xl font-bold text-blue-800">
          Validation Features
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• String validation: min/max length, regex patterns</li>
          <li>• Email validation</li>
          <li>• Number constraints</li>
          <li>• Password matching with refinements</li>
          <li>• Enum validation for selects</li>
          <li>• Real-time validation on blur</li>
        </ul>
      </div>
    </div>
  );
}
