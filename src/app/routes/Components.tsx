import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  Combobox,
  ComponentDemo,
  Input,
  Select,
  Switch,
  Textarea,
  Toggle,
} from "@/components";
import { ROUTES } from "@/config/constants";

function ComponentsPage() {
  const [fruit, setFruit] = useState<string | undefined>();
  const [withError, setWithError] = useState<string | undefined>();
  const [withHelper, setWithHelper] = useState<string | undefined>();

  return (
    <div className="min-h-[calc(100dvh-12rem)] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <Button variant="outline-secondary" size="sm" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Component Library
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            A collection of accessible, reusable UI components built with
            Tailwind CSS.
          </p>
        </div>

        <div className="space-y-8">
          <ComponentDemo
            title="Buttons"
            description="Button components with various styles and states"
            preview={
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline-primary">Outline</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
              </div>
            }
            code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline-primary">Outline</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>`}
          />

          <ComponentDemo
            title="Inputs"
            description="Text input components with labels and validation"
            preview={
              <div className="grid max-w-md gap-4">
                <Input label="Default Input" placeholder="Enter text..." />
                <Input
                  label="With Error"
                  error="This field is required"
                  placeholder="Enter text..."
                />
                <Input
                  label="With Helper"
                  helperText="This is helper text"
                  placeholder="Enter text..."
                />
              </div>
            }
            code={`<Input label="Default Input" placeholder="Enter text..." />
<Input label="With Error" error="This field is required" />
<Input label="With Helper" helperText="This is helper text" />`}
          />

          <ComponentDemo
            title="Select"
            description="Dropdown select component"
            preview={
              <div className="max-w-md">
                <Select label="Choose an option">
                  <option value="">Select...</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </Select>
              </div>
            }
            code={`<Select label="Choose an option">
  <option value="">Select...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>`}
          />

          <ComponentDemo
            title="Combobox"
            description="Searchable dropdown with type-to-filter"
            preview={
              <div className="grid max-w-md gap-4">
                <div>
                  <Combobox
                    options={[
                      { value: "1", label: "Option 1" },
                      { value: "2", label: "Option 2" },
                      { value: "3", label: "Option 3" },
                      { value: "apple", label: "Apple" },
                      { value: "banana", label: "Banana" },
                    ]}
                    label="Choose a fruit"
                    placeholder="Type to search..."
                    value={fruit}
                    onChange={(v) => setFruit(v ?? undefined)}
                  />
                </div>
                <div>
                  <Combobox
                    options={[
                      { value: "a", label: "Option A" },
                      { value: "b", label: "Option B" },
                    ]}
                    label="With error"
                    error="This field is required"
                    value={withError}
                    onChange={(v) => setWithError(v ?? undefined)}
                  />
                </div>
                <div>
                  <Combobox
                    options={[{ value: "1", label: "Only option" }]}
                    label="With helper"
                    helperText="Pick one from the list"
                    value={withHelper}
                    onChange={(v) => setWithHelper(v ?? undefined)}
                  />
                </div>
                <div>
                  <Combobox
                    options={[
                      { value: "1", label: "Option 1" },
                      { value: "2", label: "Option 2" },
                    ]}
                    label="Disabled"
                    disabled
                  />
                </div>
              </div>
            }
            code={`<Combobox
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "apple", label: "Apple" },
  ]}
  label="Choose a fruit"
  placeholder="Type to search..."
/>
<Combobox options={options} label="With error" error="This field is required" />
<Combobox options={options} label="Disabled" disabled />`}
          />

          <ComponentDemo
            title="Textarea"
            description="Multi-line text input"
            preview={
              <div className="max-w-md">
                <Textarea
                  label="Message"
                  placeholder="Enter your message..."
                  rows={4}
                />
              </div>
            }
            code={`<Textarea
  label="Message"
  placeholder="Enter your message..."
  rows={4}
/>`}
          />

          <ComponentDemo
            title="Checkbox"
            description="Checkbox input with label"
            preview={
              <div className="space-y-2">
                <Checkbox label="Accept terms and conditions" />
                <Checkbox label="Subscribe to newsletter" />
                <Checkbox label="Disabled checkbox" disabled />
              </div>
            }
            code={`<Checkbox label="Accept terms and conditions" />
<Checkbox label="Subscribe to newsletter" />
<Checkbox label="Disabled checkbox" disabled />`}
          />

          <ComponentDemo
            title="Switch"
            description="Segmented control switch component"
            preview={
              <div className="space-y-4">
                <Switch
                  leftLabel="Light mode"
                  rightLabel="Dark mode"
                  leftIcon={
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  }
                  rightIcon={
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  }
                />
                <Switch
                  leftIcon={
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  }
                  rightIcon={
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  }
                />
                <Switch
                  label="Theme"
                  leftLabel="Light"
                  rightLabel="Dark"
                  disabled
                />
              </div>
            }
            code={`<Switch
  leftLabel="Light mode"
  rightLabel="Dark mode"
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
/>

<Switch
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
/>

<Switch
  label="Theme"
  leftLabel="Light"
  rightLabel="Dark"
  disabled
/>`}
          />

          <ComponentDemo
            title="Toggle"
            description="Toggle with labels on both sides"
            preview={
              <div className="space-y-4">
                <Toggle leftLabel="Light" rightLabel="Dark" />
                <Toggle label="Enable feature" />
              </div>
            }
            code={`<Toggle leftLabel="Light" rightLabel="Dark" />
<Toggle label="Enable feature" />`}
          />

          <ComponentDemo
            title="Badges"
            description="Badge components"
            preview={
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge pill>Pill Badge</Badge>
                <Badge dot>With Dot</Badge>
              </div>
            }
            code={`<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge pill>Pill Badge</Badge>
<Badge dot>With Dot</Badge>`}
          />

          <ComponentDemo
            title="Alerts"
            description="Alert notifications"
            preview={
              <div className="space-y-4">
                <Alert variant="info" title="Info">
                  This is an informational message.
                </Alert>
                <Alert variant="success" title="Success">
                  Operation completed successfully!
                </Alert>
                <Alert variant="warning" title="Warning">
                  Please review before proceeding.
                </Alert>
                <Alert variant="error" title="Error">
                  Something went wrong.
                </Alert>
              </div>
            }
            code={`<Alert variant="info" title="Info">
  This is an informational message.
</Alert>
<Alert variant="success" title="Success">
  Operation completed successfully!
</Alert>`}
          />

          <ComponentDemo
            title="Cards"
            description="Card components"
            preview={
              <div className="grid gap-4 md:grid-cols-2">
                <Card title="Default Card" description="This is a default card">
                  Card content goes here.
                </Card>
                <Card
                  variant="outlined"
                  title="Outlined"
                  description="With border style"
                >
                  Card content goes here.
                </Card>
                <Card
                  variant="elevated"
                  title="Elevated"
                  description="With shadow"
                >
                  Card content goes here.
                </Card>
                <Card variant="flat" title="Flat" description="Minimal style">
                  Card content goes here.
                </Card>
              </div>
            }
            code={`<Card title="Default Card" description="This is a default card">
  Card content goes here.
</Card>
<Card variant="outlined" title="Outlined">
  Card content goes here.
</Card>`}
          />

          <ComponentDemo
            title="Avatars"
            description="Avatar components"
            preview={
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar size="xs" initials="XS" />
                  <Avatar size="sm" initials="SM" />
                  <Avatar size="md" initials="MD" />
                  <Avatar size="lg" initials="LG" />
                  <Avatar size="xl" initials="XL" />
                </div>
                <div className="flex items-center gap-4">
                  <Avatar initials="JD" backgroundColor="blue" />
                  <Avatar initials="AB" backgroundColor="green" />
                  <Avatar initials="CD" backgroundColor="red" />
                  <Avatar initials="EF" backgroundColor="purple" status />
                </div>
                <div>
                  <AvatarGroup max={4}>
                    <Avatar initials="A1" backgroundColor="blue" />
                    <Avatar initials="A2" backgroundColor="green" />
                    <Avatar initials="A3" backgroundColor="red" />
                    <Avatar initials="A4" backgroundColor="purple" />
                    <Avatar initials="A5" backgroundColor="yellow" />
                    <Avatar initials="A6" backgroundColor="pink" />
                  </AvatarGroup>
                </div>
              </div>
            }
            code={`<Avatar size="md" initials="JD" />
<Avatar initials="AB" backgroundColor="green" status />
<AvatarGroup max={4}>
  <Avatar initials="A1" backgroundColor="blue" />
  <Avatar initials="A2" backgroundColor="green" />
  ...
</AvatarGroup>`}
          />
        </div>
      </div>
    </div>
  );
}

export default ComponentsPage;
