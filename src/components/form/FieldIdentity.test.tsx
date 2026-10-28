import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Select } from "../ui/select";
import { Combobox } from "../ui/combobox";
import { FormSelect } from "../FormSelect";

const options = [{ value: "one", label: "One" }];
type FieldProps = { label: string; id?: string; error?: string };
const fields: {
  name: string;
  role: "textbox" | "checkbox" | "combobox";
  render: (props: FieldProps) => ReactNode;
}[] = [
  { name: "Input", role: "textbox", render: (props) => <Input {...props} /> },
  {
    name: "Textarea",
    role: "textbox",
    render: (props) => <Textarea {...props} />,
  },
  {
    name: "Checkbox",
    role: "checkbox",
    render: (props) => <Checkbox {...props} />,
  },
  {
    name: "Select",
    role: "combobox",
    render: (props) => (
      <Select {...props}>
        <option value="one">One</option>
      </Select>
    ),
  },
  {
    name: "Combobox",
    role: "combobox",
    render: (props) => <Combobox {...props} options={options} />,
  },
  {
    name: "FormSelect",
    role: "combobox",
    render: (props) => <FormSelect {...props} options={options} />,
  },
];
for (const field of fields) {
  describe(`${field.name} field identity`, () => {
    it("keeps repeated labels unique and associates each error with its own control", () => {
      const { container } = render(
        <>
          {field.render({ label: "Repeated", error: "First error" })}
          {field.render({ label: "Repeated", error: "Second error" })}
        </>
      );
      const controls = screen.getAllByRole(field.role, { name: "Repeated" });
      expect(controls).toHaveLength(2);
      const ids = Array.from(container.querySelectorAll("[id]")).map(
        (node) => node.id
      );
      expect(new Set(ids).size).toBe(ids.length);
      expect(controls[0]).toHaveAccessibleDescription("First error");
      expect(controls[1]).toHaveAccessibleDescription("Second error");
    });
    it("preserves an explicit ID and label association", () => {
      render(field.render({ label: "Explicit", id: "caller-field" }));
      expect(
        screen.getByRole(field.role, { name: "Explicit" })
      ).toHaveAttribute("id", "caller-field");
    });
    it("keeps its generated identity when the label changes", () => {
      const { rerender } = render(field.render({ label: "Original" }));
      const id = screen.getByRole(field.role, { name: "Original" }).id;
      expect(id).not.toBe("");
      rerender(field.render({ label: "Renamed" }));
      expect(screen.getByRole(field.role, { name: "Renamed" })).toHaveAttribute(
        "id",
        id
      );
    });
  });
}
it("clicking the second repeated label focuses the second text input", async () => {
  render(
    <>
      <Input label="Email" />
      <Input label="Email" />
    </>
  );
  await userEvent.click(screen.getAllByText("Email", { selector: "label" })[1]);
  expect(screen.getAllByRole("textbox")[1]).toHaveFocus();
});
