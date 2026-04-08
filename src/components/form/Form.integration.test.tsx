/**
 * Form Integration Tests
 *
 * Tests complete form workflows with validation and submission
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

const registrationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
    bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

function RegistrationForm({
  onSubmit,
}: {
  onSubmit: (data: RegistrationFormData) => void;
}) {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      bio: "",
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <FormDescription>Must be at least 8 characters</FormDescription>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Bio (Optional)</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="terms"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <Checkbox
                label="I accept the terms and conditions"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />

      <Button type="submit">Register</Button>
    </Form>
  );
}

describe("Form Integration Tests", () => {
  it("validates all fields on submit", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("validates password match", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password456");
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid data", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.type(screen.getByLabelText("Bio (Optional)"), "Test bio");
    await user.click(
      screen.getByLabelText("I accept the terms and conditions")
    );
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      const callArgs = handleSubmit.mock.calls[0];
      expect(callArgs[0]).toEqual({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        bio: "Test bio",
        terms: true,
      });
    });
  });
});
