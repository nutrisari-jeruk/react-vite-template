import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "./Form";
import { Input } from "../ui/input";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});
const consumers = [
  { name: "FormLabel", element: <FormLabel>Label</FormLabel> },
  {
    name: "FormControl",
    element: (
      <FormControl>
        <input />
      </FormControl>
    ),
  },
  {
    name: "FormDescription",
    element: <FormDescription>Description</FormDescription>,
  },
  { name: "FormMessage", element: <FormMessage>Error</FormMessage> },
];
function WithoutItem({ children }: { children: ReactNode }) {
  const form = useForm({ defaultValues: { email: "" } });
  return (
    <Form form={form} onSubmit={() => {}}>
      <FormField
        control={form.control}
        name="email"
        render={() => <>{children}</>}
      />
    </Form>
  );
}
for (const consumer of consumers) {
  it(`${consumer.name} rejects missing FormField context`, () => {
    expect(() => render(<FormItem>{consumer.element}</FormItem>)).toThrow(
      "useFormField should be used within <FormField>"
    );
  });
  it(`${consumer.name} rejects missing FormItem context`, () => {
    expect(() => render(<WithoutItem>{consumer.element}</WithoutItem>)).toThrow(
      "useFormField should be used within <FormItem>"
    );
  });
}
it("rejects the hook outside both providers", () => {
  function Outside() {
    useFormField();
    return null;
  }
  expect(() => render(<Outside />)).toThrow(
    "useFormField should be used within <FormField>"
  );
});
it("links two valid form fields without duplicate or undefined IDs", () => {
  function ValidForm() {
    const form = useForm({ defaultValues: { first: "", second: "" } });
    return (
      <Form form={form} onSubmit={() => {}}>
        {(["first", "second"] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeated</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{name} description</FormDescription>
                <FormMessage>{name} error</FormMessage>
              </FormItem>
            )}
          />
        ))}
      </Form>
    );
  }
  const { container } = render(<ValidForm />);
  const fields = screen.getAllByRole("textbox", { name: "Repeated" });
  expect(fields[0]).toHaveAccessibleDescription(
    "first description first error"
  );
  expect(fields[1]).toHaveAccessibleDescription(
    "second description second error"
  );
  const ids = Array.from(container.querySelectorAll("[id]")).map(
    (node) => node.id
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.some((id) => id.includes("undefined"))).toBe(false);
});
