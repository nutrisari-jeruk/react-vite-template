import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";

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
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "other", label: "Other" },
];

export default function FormValidationExample() {
  const [submittedData, setSubmittedData] =
    useState<UserRegistrationForm | null>(null);

  const registrationForm = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = (data: UserRegistrationForm) => {
    setSubmittedData(data);
    registrationForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">User Registration Form</h1>
      <p className="text-gray-600 mb-8">
        Form validation using Zod + React Hook Form
      </p>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
        <p className="text-sm text-gray-600 mb-6">
          Fill in the details below to create your account
        </p>

        <form
          onSubmit={registrationForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormInput
            id="username"
            label="Username"
            placeholder="johndoe123"
            error={registrationForm.formState.errors.username?.message}
            {...registrationForm.register("username")}
          />

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={registrationForm.formState.errors.email?.message}
            {...registrationForm.register("email")}
          />

          <FormInput
            id="age"
            label="Age"
            type="number"
            placeholder="25"
            error={registrationForm.formState.errors.age?.message}
            {...registrationForm.register("age")}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            error={registrationForm.formState.errors.password?.message}
            {...registrationForm.register("password")}
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={registrationForm.formState.errors.confirmPassword?.message}
            {...registrationForm.register("confirmPassword")}
          />

          <FormSelect
            id="country"
            label="Country"
            options={countryOptions}
            error={registrationForm.formState.errors.country?.message}
            {...registrationForm.register("country")}
          />

          <FormTextarea
            id="bio"
            label="Bio (Optional)"
            placeholder="Tell us about yourself..."
            rows={4}
            error={registrationForm.formState.errors.bio?.message}
            {...registrationForm.register("bio")}
          />

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <input
                id="acceptTerms"
                type="checkbox"
                className="mt-1"
                {...registrationForm.register("acceptTerms")}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the terms and conditions
              </label>
            </div>
            {registrationForm.formState.errors.acceptTerms && (
              <span className="text-sm text-red-600">
                {registrationForm.formState.errors.acceptTerms.message}
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={registrationForm.formState.isSubmitting}
            >
              Register
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => registrationForm.reset()}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>

      {submittedData && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Registration Successful!
          </h3>
          <div className="bg-white rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
