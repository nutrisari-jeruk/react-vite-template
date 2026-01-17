import { Link } from "react-router-dom";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  ComponentDemo,
  Input,
  Select,
  Switch,
  Textarea,
  Toggle,
} from "@/components";
import { ROUTES } from "@/config/constants";

function ComponentsPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
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
            description="Toggle switch component"
            preview={
              <div className="space-y-4">
                <Switch label="Enable notifications" />
                <Switch label="Dark mode" />
                <Switch label="Disabled" disabled />
              </div>
            }
            code={`<Switch label="Enable notifications" />
<Switch label="Dark mode" />
<Switch label="Disabled" disabled />`}
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
