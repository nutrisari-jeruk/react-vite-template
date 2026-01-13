import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextarea from "../components/FormTextarea";
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

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be at most 100 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be at most 1000 characters"),
  priority: z.enum(["low", "medium", "high"], {
    message: "Please select a priority",
  }),
});

type ContactForm = z.infer<typeof contactFormSchema>;

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

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function FormValidationExample() {
  const [submittedData, setSubmittedData] = useState<
    UserRegistrationForm | ContactForm | null
  >(null);
  const [activeForm, setActiveForm] = useState<"registration" | "contact">(
    "registration"
  );

  const registrationForm = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onBlur",
    defaultValues: {
      acceptTerms: false,
    },
  });

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });

  const onRegistrationSubmit = (data: UserRegistrationForm) => {
    setSubmittedData(data);
    registrationForm.reset();
  };

  const onContactSubmit = (data: ContactForm) => {
    setSubmittedData(data);
    contactForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Zod Form Validation Examples</h1>
      <p className="text-gray-600 mb-8">
        Comprehensive examples of form validation using Zod + React Hook Form
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveForm("registration");
            setSubmittedData(null);
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeForm === "registration"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          User Registration
        </button>
        <button
          onClick={() => {
            setActiveForm("contact");
            setSubmittedData(null);
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeForm === "contact"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Contact Form
        </button>
      </div>

      {activeForm === "registration" && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">User Registration Form</h2>
          <p className="text-sm text-gray-600 mb-6">
            Demonstrates: string validation, email, number constraints, regex
            patterns, password matching, custom refinements
          </p>

          <form
            onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)}
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
      )}

      {activeForm === "contact" && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
          <p className="text-sm text-gray-600 mb-6">
            Demonstrates: basic validation, enums, textarea validation, min/max
            length constraints
          </p>

          <form
            onSubmit={contactForm.handleSubmit(onContactSubmit)}
            className="space-y-4"
          >
            <FormInput
              id="contact-name"
              label="Name"
              placeholder="Your full name"
              error={contactForm.formState.errors.name?.message}
              {...contactForm.register("name")}
            />

            <FormInput
              id="contact-email"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              error={contactForm.formState.errors.email?.message}
              {...contactForm.register("email")}
            />

            <FormInput
              id="subject"
              label="Subject"
              placeholder="How can we help?"
              error={contactForm.formState.errors.subject?.message}
              {...contactForm.register("subject")}
            />

            <FormSelect
              id="priority"
              label="Priority"
              options={priorityOptions}
              error={contactForm.formState.errors.priority?.message}
              {...contactForm.register("priority")}
            />

            <FormTextarea
              id="message"
              label="Message"
              placeholder="Please describe your inquiry in detail..."
              rows={6}
              error={contactForm.formState.errors.message?.message}
              {...contactForm.register("message")}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={contactForm.formState.isSubmitting}
              >
                Send Message
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => contactForm.reset()}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      )}

      {submittedData && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Form Submitted Successfully!
          </h3>
          <div className="bg-white rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold text-blue-800 mb-4">
          Validation Features Demonstrated
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>String Validation:</strong> Min/max length, regex
              patterns, email validation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Number Validation:</strong> Type coercion, min/max values,
              integer constraints
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Complex Rules:</strong> Password strength, password
              matching with refinements
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Enum Validation:</strong> Select dropdowns with predefined
              values
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Optional Fields:</strong> Bio field with optional
              validation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Checkbox Validation:</strong> Required checkbox with
              literal type
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Real-time Validation:</strong> Validation on blur with
              instant feedback
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>
              <strong>Custom Error Messages:</strong> User-friendly error
              messages for all validations
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
