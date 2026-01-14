import { useState } from "react";
import ComponentDemo from "../components/ComponentDemo";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import Checkbox from "../components/Checkbox";
import Toggle from "../components/Toggle";
import Switch from "../components/Switch";
import Select from "../components/Select";
import Combobox from "../components/Combobox";
import Textarea from "../components/Textarea";
import Avatar from "../components/Avatar";
import AvatarGroup from "../components/AvatarGroup";

// Icon components for demos
const SearchIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export default function Components() {
  const [alerts, setAlerts] = useState<
    {
      id: number;
      variant: "info" | "success" | "warning" | "error";
      title: string;
      message: string;
      floating?: boolean;
      position?: "top-center" | "top-right" | "bottom-right" | "bottom-left";
      timeout?: number;
    }[]
  >([]);

  const showAlert = (
    variant: "info" | "success" | "warning" | "error",
    title: string,
    message: string,
    options: {
      floating?: boolean;
      position?: "top-center" | "top-right" | "bottom-right" | "bottom-left";
      timeout?: number;
    } = {}
  ) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, variant, title, message, ...options }]);
  };

  const dismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Render Alerts in their respective positions */}
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.variant}
          title={alert.title}
          dismissible
          onDismiss={() => dismissAlert(alert.id)}
          floating={alert.floating}
          position={alert.position}
          timeout={alert.timeout}
        >
          {alert.message}
        </Alert>
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Library
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive collection of reusable UI components built with
            React, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-8 space-y-1 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Components</h3>
              <a
                href="#avatar"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Avatar
              </a>
              <a
                href="#button"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Button
              </a>
              <a
                href="#input"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Input
              </a>
              <a
                href="#card"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Card
              </a>
              <a
                href="#badge"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Badge
              </a>
              <a
                href="#alert"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Alert
              </a>
              <a
                href="#checkbox"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Checkbox
              </a>
              <a
                href="#toggle"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Toggle
              </a>
              <a
                href="#switch"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Switch
              </a>
              <a
                href="#select"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Select
              </a>
              <a
                href="#combobox"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Combobox
              </a>
              <a
                href="#textarea"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Textarea
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-9">
            {/* Avatar Component */}
            <ComponentDemo
              title="Avatar"
              description="Display user avatars with images or initials, supporting various sizes, shapes, and status indicators."
              preview={
                <div className="space-y-8">
                  {/* Sizes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Sizes
                    </h4>
                    <div className="flex items-end gap-3">
                      <Avatar initials="XS" size="xs" />
                      <Avatar initials="SM" size="sm" />
                      <Avatar initials="MD" size="md" />
                      <Avatar initials="LG" size="lg" />
                      <Avatar initials="XL" size="xl" />
                      <Avatar initials="2X" size="2xl" />
                    </div>
                  </div>

                  {/* Shapes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Shapes
                    </h4>
                    <div className="flex items-center gap-3">
                      <Avatar initials="TG" shape="circle" size="lg" />
                      <Avatar initials="TG" shape="square" size="lg" />
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Colors
                    </h4>
                    <div className="flex items-center gap-3">
                      <Avatar initials="TG" backgroundColor="blue" size="lg" />
                      <Avatar initials="TG" backgroundColor="green" size="lg" />
                      <Avatar initials="TG" backgroundColor="red" size="lg" />
                      <Avatar
                        initials="TG"
                        backgroundColor="purple"
                        size="lg"
                      />
                      <Avatar
                        initials="TG"
                        backgroundColor="yellow"
                        size="lg"
                      />
                      <Avatar initials="TG" backgroundColor="gray" size="lg" />
                    </div>
                  </div>

                  {/* With Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      With Status Indicator
                    </h4>
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials="TG"
                        size="lg"
                        status
                        statusColor="green"
                      />
                      <Avatar
                        initials="TG"
                        size="lg"
                        status
                        statusColor="red"
                      />
                      <Avatar
                        initials="TG"
                        size="lg"
                        status
                        statusColor="yellow"
                      />
                      <Avatar
                        initials="TG"
                        size="lg"
                        status
                        statusColor="gray"
                      />
                    </div>
                  </div>

                  {/* Avatar Group */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Avatar Group
                    </h4>
                    <div className="space-y-4">
                      <AvatarGroup>
                        <Avatar initials="JD" backgroundColor="blue" />
                        <Avatar initials="AS" backgroundColor="green" />
                        <Avatar initials="MK" backgroundColor="purple" />
                        <Avatar initials="LW" backgroundColor="red" />
                      </AvatarGroup>
                      <AvatarGroup max={3}>
                        <Avatar initials="JD" backgroundColor="blue" />
                        <Avatar initials="AS" backgroundColor="green" />
                        <Avatar initials="MK" backgroundColor="purple" />
                        <Avatar initials="LW" backgroundColor="red" />
                        <Avatar initials="TH" backgroundColor="yellow" />
                      </AvatarGroup>
                    </div>
                  </div>
                </div>
              }
              code={`// Basic Avatar
<Avatar initials="TG" />

// Different Sizes
<Avatar initials="XS" size="xs" />
<Avatar initials="SM" size="sm" />
<Avatar initials="MD" size="md" />
<Avatar initials="LG" size="lg" />
<Avatar initials="XL" size="xl" />
<Avatar initials="2X" size="2xl" />

// Shapes
<Avatar initials="TG" shape="circle" />
<Avatar initials="TG" shape="square" />

// Colors
<Avatar initials="TG" backgroundColor="blue" />
<Avatar initials="TG" backgroundColor="green" />
<Avatar initials="TG" backgroundColor="purple" />

// With Status Indicator
<Avatar initials="TG" status statusColor="green" />
<Avatar initials="TG" status statusColor="red" />

// With Image
<Avatar src="https://example.com/avatar.jpg" alt="User" />

// Avatar Group
<AvatarGroup>
  <Avatar initials="JD" backgroundColor="blue" />
  <Avatar initials="AS" backgroundColor="green" />
  <Avatar initials="MK" backgroundColor="purple" />
</AvatarGroup>

// Avatar Group with Max
<AvatarGroup max={3}>
  <Avatar initials="JD" />
  <Avatar initials="AS" />
  <Avatar initials="MK" />
  <Avatar initials="LW" />
  <Avatar initials="TH" />
</AvatarGroup>`}
              props={[
                {
                  name: "size",
                  type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
                  default: "'md'",
                  description: "Size of the avatar",
                },
                {
                  name: "shape",
                  type: "'circle' | 'square'",
                  default: "'circle'",
                  description: "Shape of the avatar",
                },
                {
                  name: "src",
                  type: "string",
                  description: "Image source URL",
                },
                {
                  name: "alt",
                  type: "string",
                  default: "'Avatar'",
                  description: "Alt text for the image",
                },
                {
                  name: "initials",
                  type: "string",
                  description: "Initials to display (max 2 chars)",
                },
                {
                  name: "status",
                  type: "boolean",
                  default: "false",
                  description: "Show status indicator",
                },
                {
                  name: "statusColor",
                  type: "'green' | 'red' | 'yellow' | 'gray'",
                  default: "'green'",
                  description: "Status indicator color",
                },
                {
                  name: "statusPosition",
                  type: "'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'",
                  default: "'bottom-right'",
                  description: "Position of status indicator",
                },
                {
                  name: "backgroundColor",
                  type: "'blue' | 'gray' | 'red' | 'green' | 'yellow' | 'purple' | 'pink'",
                  default: "'blue'",
                  description: "Background color for initials",
                },
              ]}
            />

            {/* Button Component */}
            <ComponentDemo
              title="Button"
              description="Versatile button component with multiple variants, sizes, and icon support."
              preview={
                <>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline-primary">Outline</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button loading>Loading</Button>
                  <Button iconLeft={<SearchIcon />}>Search</Button>
                  <Button iconRight={<DownloadIcon />}>Download</Button>
                  <Button iconOnly={<PlusIcon />} aria-label="Add" />
                </>
              }
              code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline-primary">Outline</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Loading</Button>
<Button iconLeft={<SearchIcon />}>Search</Button>
<Button iconRight={<DownloadIcon />}>Download</Button>
<Button iconOnly={<PlusIcon />} aria-label="Add" />`}
              props={[
                {
                  name: "variant",
                  type: "'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-secondary' | 'outline-danger'",
                  default: "'primary'",
                  description: "Visual style of the button",
                },
                {
                  name: "size",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the button",
                },
                {
                  name: "loading",
                  type: "boolean",
                  default: "false",
                  description: "Shows loading spinner",
                },
                {
                  name: "iconLeft",
                  type: "ReactNode",
                  description: "Icon displayed on the left side",
                },
                {
                  name: "iconRight",
                  type: "ReactNode",
                  description: "Icon displayed on the right side",
                },
                {
                  name: "iconOnly",
                  type: "ReactNode",
                  description: "Creates an icon-only button",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the button",
                },
              ]}
            />

            {/* Input Component */}
            <ComponentDemo
              title="Input"
              description="Flexible input component with variants, icons, labels, and error states."
              preview={
                <div className="w-full space-y-4">
                  <Input placeholder="Default input" />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Search"
                    iconLeft={<SearchIcon />}
                    placeholder="Search..."
                  />
                  <Input
                    label="Email with icon"
                    iconRight={<MailIcon />}
                    placeholder="your@email.com"
                  />
                  <Input label="With error" error="This field is required" />
                  <Input
                    label="Success"
                    variant="success"
                    helperText="Looks good!"
                  />
                  <Input inputSize="sm" placeholder="Small input" />
                  <Input inputSize="lg" placeholder="Large input" />
                </div>
              }
              code={`<Input placeholder="Default input" />
<Input label="Email" type="email" placeholder="Enter your email" />
<Input label="Search" iconLeft={<SearchIcon />} placeholder="Search..." />
<Input label="Email with icon" iconRight={<MailIcon />} placeholder="your@email.com" />
<Input label="With error" error="This field is required" />
<Input label="Success" variant="success" helperText="Looks good!" />
<Input inputSize="sm" placeholder="Small input" />
<Input inputSize="lg" placeholder="Large input" />`}
              props={[
                {
                  name: "variant",
                  type: "'default' | 'error' | 'success'",
                  default: "'default'",
                  description: "Visual style of the input",
                },
                {
                  name: "inputSize",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the input",
                },
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the input",
                },
                {
                  name: "error",
                  type: "string",
                  description: "Error message to display",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below input",
                },
                {
                  name: "iconLeft",
                  type: "ReactNode",
                  description: "Icon on the left side",
                },
                {
                  name: "iconRight",
                  type: "ReactNode",
                  description: "Icon on the right side",
                },
              ]}
            />

            {/* Card Component */}
            <ComponentDemo
              title="Card"
              description="Container component with multiple variants for grouping content."
              preview={
                <>
                  <Card variant="default" className="w-64">
                    <p>Default card with shadow</p>
                  </Card>
                  <Card variant="outlined" className="w-64">
                    <p>Outlined card</p>
                  </Card>
                  <Card variant="elevated" className="w-64">
                    <p>Elevated card with stronger shadow</p>
                  </Card>
                  <Card variant="flat" className="w-64">
                    <p>Flat card with subtle background</p>
                  </Card>
                  <Card
                    title="Card with Title"
                    description="This card has a title and description"
                    className="w-64"
                  >
                    <p>Card content goes here</p>
                  </Card>
                </>
              }
              code={`<Card variant="default">
  <p>Default card with shadow</p>
</Card>
<Card variant="outlined">
  <p>Outlined card</p>
</Card>
<Card variant="elevated">
  <p>Elevated card with stronger shadow</p>
</Card>
<Card variant="flat">
  <p>Flat card with subtle background</p>
</Card>
<Card title="Card with Title" description="This card has a title and description">
  <p>Card content goes here</p>
</Card>`}
              props={[
                {
                  name: "variant",
                  type: "'default' | 'outlined' | 'elevated' | 'flat'",
                  default: "'default'",
                  description: "Visual style of the card",
                },
                {
                  name: "title",
                  type: "string",
                  description: "Optional title for the card",
                },
                {
                  name: "description",
                  type: "string",
                  description: "Optional description text",
                },
              ]}
            />

            {/* Badge Component */}
            <ComponentDemo
              title="Badge"
              description="Small status indicators with various colors and sizes."
              preview={
                <>
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge size="sm">Small</Badge>
                  <Badge size="lg">Large</Badge>
                  <Badge pill>Pill Shape</Badge>
                  <Badge dot variant="success">
                    With Dot
                  </Badge>
                </>
              }
              code={`<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>
<Badge pill>Pill Shape</Badge>
<Badge dot variant="success">With Dot</Badge>`}
              props={[
                {
                  name: "variant",
                  type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'",
                  default: "'default'",
                  description: "Color variant of the badge",
                },
                {
                  name: "size",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the badge",
                },
                {
                  name: "pill",
                  type: "boolean",
                  default: "false",
                  description: "Pill-shaped badge",
                },
                {
                  name: "dot",
                  type: "boolean",
                  default: "false",
                  description: "Shows a dot indicator",
                },
              ]}
            />

            {/* Alert Component */}
            <ComponentDemo
              title="Alert"
              description="Display important messages and notifications with flying animations and floating positioning."
              preview={
                <div className="w-full space-y-6">
                  {/* Trigger Top-Center Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Top Center Alerts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "info",
                            "Information",
                            "This is a floating informational alert!",
                            {
                              floating: true,
                              position: "top-center",
                              timeout: 5000,
                            }
                          )
                        }
                      >
                        Info (5s timeout)
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "success",
                            "Success!",
                            "Action completed successfully!",
                            {
                              floating: true,
                              position: "top-center",
                              timeout: 3000,
                            }
                          )
                        }
                      >
                        Success (3s timeout)
                      </Button>
                    </div>
                  </div>

                  {/* Trigger Top-Right Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Trigger Top-Right Alerts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "info",
                            "Information",
                            "This appears at the top-right corner!",
                            { floating: true, position: "top-right" }
                          )
                        }
                      >
                        Show Info (Top-Right)
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "success",
                            "Success!",
                            "Auto-dismisses in 3 seconds!",
                            {
                              floating: true,
                              position: "top-right",
                              timeout: 3000,
                            }
                          )
                        }
                      >
                        Show with 3s Timeout
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "error",
                            "Error",
                            "This stays until dismissed.",
                            { floating: true, position: "top-right" }
                          )
                        }
                      >
                        Show Error
                      </Button>
                    </div>
                  </div>

                  {/* Trigger Bottom-Right Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Trigger Toast Alerts (Bottom-Right)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "info",
                            "Info",
                            "New notification received!",
                            {
                              floating: true,
                              position: "bottom-right",
                              timeout: 4000,
                            }
                          )
                        }
                      >
                        Info Toast (4s)
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "success",
                            "Saved!",
                            "Your changes have been saved.",
                            {
                              floating: true,
                              position: "bottom-right",
                              timeout: 3000,
                            }
                          )
                        }
                      >
                        Success Toast (3s)
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "warning",
                            "Warning",
                            "Action cannot be undone.",
                            { floating: true, position: "bottom-right" }
                          )
                        }
                      >
                        Warning Toast
                      </Button>
                    </div>
                  </div>

                  {/* Trigger Bottom-Left Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Trigger Bottom-Left Alerts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "info",
                            "Info",
                            "Bottom-left notification!",
                            {
                              floating: true,
                              position: "bottom-left",
                              timeout: 3000,
                            }
                          )
                        }
                      >
                        Show Info (3s)
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          showAlert(
                            "success",
                            "Success",
                            "Operation completed!",
                            { floating: true, position: "bottom-left" }
                          )
                        }
                      >
                        Show Success
                      </Button>
                    </div>
                  </div>

                  {/* Static Examples */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Static Examples (Always Visible)
                    </h4>
                    <div className="space-y-3">
                      <Alert variant="info">
                        This is an informational message with fly-in animation.
                      </Alert>
                      <Alert variant="success" title="Success!">
                        Your changes have been saved successfully.
                      </Alert>
                      <Alert variant="warning" title="Warning">
                        Please review your information before proceeding.
                      </Alert>
                      <Alert variant="error" title="Error" dismissible>
                        Something went wrong. Please try again.
                      </Alert>
                    </div>
                  </div>
                </div>
              }
              code={`// Interactive Demo with State Management
const [alerts, setAlerts] = useState([]);

const showAlert = (variant, title, message, options = {}) => {
  const id = Date.now();
  setAlerts(prev => [...prev, { id, variant, title, message, ...options }]);
};

const dismissAlert = (id) => {
  setAlerts(prev => prev.filter(alert => alert.id !== id));
};

// Trigger alerts with different positions and timeouts
<Button onClick={() =>
  showAlert('success', 'Success!', 'Action completed!', {
    floating: true,
    position: 'top-center',
    timeout: 3000  // Auto-dismiss after 3 seconds
  })
}>
  Show Top-Center Alert (3s)
</Button>

<Button onClick={() =>
  showAlert('info', 'Info', 'New notification!', {
    floating: true,
    position: 'top-right',
    timeout: 5000  // Auto-dismiss after 5 seconds
  })
}>
  Show Top-Right Alert (5s)
</Button>

<Button onClick={() =>
  showAlert('warning', 'Warning', 'Please review!', {
    floating: true,
    position: 'bottom-right'
    // No timeout - stays until dismissed
  })
}>
  Show Bottom-Right Alert
</Button>

// Render all alerts dynamically
{alerts.map(alert => (
  <Alert
    key={alert.id}
    variant={alert.variant}
    title={alert.title}
    dismissible
    onDismiss={() => dismissAlert(alert.id)}
    floating={alert.floating}
    position={alert.position}
    timeout={alert.timeout}
  >
    {alert.message}
  </Alert>
))}

// Static alerts (always visible)
<Alert variant="info">
  This is an informational message with fly-in animation.
</Alert>

<Alert variant="success" title="Success!" floating position="top-right" timeout={5000}>
  Auto-dismisses after 5 seconds!
</Alert>

<Alert variant="error" title="Error" dismissible>
  Something went wrong. Please try again.
</Alert>`}
              props={[
                {
                  name: "variant",
                  type: "'info' | 'success' | 'warning' | 'error'",
                  default: "'info'",
                  description: "Severity level of the alert",
                },
                {
                  name: "title",
                  type: "string",
                  description: "Optional title for the alert",
                },
                {
                  name: "icon",
                  type: "ReactNode",
                  description: "Custom icon (defaults provided)",
                },
                {
                  name: "dismissible",
                  type: "boolean",
                  default: "false",
                  description: "Shows dismiss button",
                },
                {
                  name: "onDismiss",
                  type: "() => void",
                  description: "Callback when dismissed",
                },
                {
                  name: "floating",
                  type: "boolean",
                  default: "false",
                  description: "Makes alert fixed position",
                },
                {
                  name: "position",
                  type: "'top-center' | 'top-right' | 'bottom-right' | 'bottom-left'",
                  default: "'top-center'",
                  description: "Position of the floating alert",
                },
                {
                  name: "timeout",
                  type: "number",
                  description:
                    "Auto-dismiss after milliseconds (e.g., 3000 = 3s)",
                },
              ]}
            />

            {/* Checkbox Component */}
            <ComponentDemo
              title="Checkbox"
              description="Standard checkbox input with label and helper text."
              preview={
                <div className="space-y-4">
                  <Checkbox label="Accept terms and conditions" />
                  <Checkbox
                    label="Subscribe to newsletter"
                    helperText="Get weekly updates"
                  />
                  <Checkbox
                    label="Checkbox with error"
                    error="This field is required"
                  />
                  <Checkbox label="Disabled checkbox" disabled />
                </div>
              }
              code={`<Checkbox label="Accept terms and conditions" />
<Checkbox label="Subscribe to newsletter" helperText="Get weekly updates" />
<Checkbox label="Checkbox with error" error="This field is required" />
<Checkbox label="Disabled checkbox" disabled />`}
              props={[
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the checkbox",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below checkbox",
                },
                {
                  name: "error",
                  type: "string",
                  description: "Error message to display",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the checkbox",
                },
              ]}
            />

            {/* Toggle Component */}
            <ComponentDemo
              title="Toggle"
              description="Toggle switch for binary options."
              preview={
                <div className="space-y-4">
                  <Toggle label="Enable notifications" />
                  <Toggle
                    label="Dark mode"
                    helperText="Switch between light and dark theme"
                  />
                  <Toggle label="Disabled toggle" disabled />
                  <Toggle label="Label on left" labelPosition="left" />
                  <Toggle
                    label="Left label with helper"
                    labelPosition="left"
                    helperText="Helper text for left label variant"
                  />
                  <Toggle leftLabel="Light" rightLabel="Dark" />
                  <Toggle leftLabel="Light" rightLabel="Dark" />
                  <Toggle
                    leftLabel="Yes"
                    rightLabel="No"
                    disabled
                    helperText="Theme selection disabled"
                  />
                </div>
              }
              code={`<Toggle label="Enable notifications" />
<Toggle label="Dark mode" helperText="Switch between light and dark theme" />
<Toggle label="Disabled toggle" disabled />
<Toggle label="Label on left" labelPosition="left" />
<Toggle
  label="Left label with helper"
  labelPosition="left"
  helperText="Helper text for left label variant"
/>
<Toggle leftLabel="Light" rightLabel="Dark" />
<Toggle leftLabel="Light" rightLabel="Dark" defaultChecked={true} />
<Toggle
  leftLabel="Light"
  rightLabel="Dark"
  disabled
  helperText="Theme selection disabled"
/>`}
              props={[
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the toggle (single label mode)",
                },
                {
                  name: "leftLabel",
                  type: "string",
                  description:
                    "Left label text (dual label mode - use with rightLabel)",
                },
                {
                  name: "rightLabel",
                  type: "string",
                  description:
                    "Right label text (dual label mode - use with leftLabel)",
                },
                {
                  name: "labelPosition",
                  type: '"left" | "right"',
                  default: '"right"',
                  description:
                    "Position of the label relative to the toggle (single label mode only)",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below toggle",
                },
                {
                  name: "checked",
                  type: "boolean",
                  description: "Controlled checked state",
                },
                {
                  name: "defaultChecked",
                  type: "boolean",
                  description: "Initial checked state",
                },
                {
                  name: "onCheckedChange",
                  type: "(checked: boolean) => void",
                  description: "Callback when toggled",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the toggle",
                },
              ]}
            />

            {/* Switch Component */}
            <ComponentDemo
              title="Switch"
              description="Switch component with icons for binary options."
              preview={
                <div className="space-y-4">
                  <Switch
                    label="Switch Version"
                    leftIcon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
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
                    label="Switch Version"
                    leftIcon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    }
                    defaultChecked={true}
                  />
                  <Switch
                    label="Theme Switch"
                    leftIcon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    }
                    helperText="Switch between light and dark theme"
                  />
                  <Switch
                    label="Disabled Switch"
                    leftIcon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    }
                    disabled
                    helperText="This switch is disabled"
                  />
                </div>
              }
              code={`<Switch
  label="Switch Version"
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
/>
<Switch
  label="Switch Version"
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
  defaultChecked={true}
/>
<Switch
  label="Theme Switch"
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
  helperText="Switch between light and dark theme"
/>
<Switch
  label="Disabled Switch"
  leftIcon={<SunIcon />}
  rightIcon={<MoonIcon />}
  disabled
  helperText="This switch is disabled"
/>`}
              props={[
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the switch",
                },
                {
                  name: "leftIcon",
                  type: "ReactNode",
                  description:
                    "Left icon element (icon mode - use with rightIcon)",
                },
                {
                  name: "rightIcon",
                  type: "ReactNode",
                  description:
                    "Right icon element (icon mode - use with leftIcon)",
                },
                {
                  name: "labelPosition",
                  type: '"left" | "right"',
                  default: '"right"',
                  description:
                    "Position of the label relative to the switch (single label mode only)",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below switch",
                },
                {
                  name: "checked",
                  type: "boolean",
                  description: "Controlled checked state",
                },
                {
                  name: "defaultChecked",
                  type: "boolean",
                  description: "Initial checked state",
                },
                {
                  name: "onCheckedChange",
                  type: "(checked: boolean) => void",
                  description: "Callback when switched",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the switch",
                },
              ]}
            />

            {/* Select Component */}
            <ComponentDemo
              title="Select"
              description="Dropdown select input with label and error states."
              preview={
                <div className="w-full space-y-4">
                  <Select label="Label">
                    <option value="">Dropdown</option>
                    <option value="1">Item 1</option>
                    <option value="2">Item 2</option>
                    <option value="3">Item 3</option>
                  </Select>
                  <Select label="Label" defaultValue="1">
                    <option value="">Dropdown</option>
                    <option value="1">Item 1</option>
                    <option value="2">Item 2</option>
                    <option value="3">Item 3</option>
                  </Select>
                  <Select label="Label" disabled>
                    <option value="">Dropdown</option>
                    <option value="1">Item 1</option>
                    <option value="2">Item 2</option>
                    <option value="3">Item 3</option>
                  </Select>
                </div>
              }
              code={`<Select label="Country" placeholder="Select a country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="ca">Canada</option>
</Select>
<Select label="Size" selectSize="sm">
  <option value="sm">Small</option>
  <option value="md">Medium</option>
  <option value="lg">Large</option>
</Select>
<Select label="Category" error="Please select a category">
  <option value="">Select category</option>
  <option value="tech">Technology</option>
  <option value="health">Health</option>
</Select>`}
              props={[
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the select",
                },
                {
                  name: "selectSize",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the select",
                },
                {
                  name: "error",
                  type: "string",
                  description: "Error message to display",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below select",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the select",
                },
              ]}
            />

            {/* Combobox Component */}
            <ComponentDemo
              title="Combobox"
              description="Searchable dropdown with autocomplete functionality and keyboard navigation."
              preview={
                <div className="w-full space-y-4">
                  <Combobox
                    label="Country"
                    placeholder="Search countries..."
                    options={[
                      { value: "us", label: "United States" },
                      { value: "uk", label: "United Kingdom" },
                      { value: "ca", label: "Canada" },
                      { value: "au", label: "Australia" },
                      { value: "de", label: "Germany" },
                      { value: "fr", label: "France" },
                      { value: "jp", label: "Japan" },
                    ]}
                  />
                  <Combobox
                    label="Fruits"
                    placeholder="Type to search..."
                    iconLeft={<SearchIcon />}
                    options={[
                      { value: "apple", label: "Apple" },
                      { value: "banana", label: "Banana" },
                      { value: "cherry", label: "Cherry" },
                      { value: "grape", label: "Grape" },
                      { value: "orange", label: "Orange" },
                    ]}
                    helperText="Start typing to filter options"
                  />
                  <Combobox
                    label="Category"
                    placeholder="Select category..."
                    options={[
                      { value: "tech", label: "Technology" },
                      { value: "health", label: "Health" },
                      { value: "finance", label: "Finance" },
                    ]}
                    error="This field is required"
                  />
                  <Combobox
                    label="Small"
                    comboboxSize="sm"
                    placeholder="Small combobox..."
                    options={[
                      { value: "1", label: "Option 1" },
                      { value: "2", label: "Option 2" },
                    ]}
                  />
                </div>
              }
              code={`const options = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

<Combobox
  label="Country"
  placeholder="Search countries..."
  options={options}
/>

<Combobox
  label="Fruits"
  placeholder="Type to search..."
  iconLeft={<SearchIcon />}
  options={fruitsOptions}
  helperText="Start typing to filter options"
/>

<Combobox
  label="Category"
  placeholder="Select category..."
  options={categoryOptions}
  error="This field is required"
/>

<Combobox
  label="Small"
  comboboxSize="sm"
  placeholder="Small combobox..."
  options={smallOptions}
/>`}
              props={[
                {
                  name: "options",
                  type: "ComboboxOption[]",
                  description: "Array of options with value and label",
                },
                {
                  name: "value",
                  type: "string",
                  description: "Selected value (controlled)",
                },
                {
                  name: "onChange",
                  type: "(value: string) => void",
                  description: "Callback when option is selected",
                },
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the combobox",
                },
                {
                  name: "placeholder",
                  type: "string",
                  default: "'Search...'",
                  description: "Placeholder text",
                },
                {
                  name: "comboboxSize",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the combobox",
                },
                {
                  name: "iconLeft",
                  type: "ReactNode",
                  description: "Icon on the left side",
                },
                {
                  name: "error",
                  type: "string",
                  description: "Error message to display",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below combobox",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the combobox",
                },
              ]}
            />

            {/* Textarea Component */}
            <ComponentDemo
              title="Textarea"
              description="Multi-line text input with resizing capability."
              preview={
                <div className="w-full space-y-4">
                  <Textarea
                    label="Message"
                    placeholder="Enter your message..."
                  />
                  <Textarea
                    label="Description"
                    helperText="Provide a detailed description"
                  />
                  <Textarea label="Comments" error="This field is required" />
                  <Textarea textareaSize="sm" placeholder="Small textarea" />
                </div>
              }
              code={`<Textarea label="Message" placeholder="Enter your message..." />
<Textarea label="Description" helperText="Provide a detailed description" />
<Textarea label="Comments" error="This field is required" />
<Textarea textareaSize="sm" placeholder="Small textarea" />`}
              props={[
                {
                  name: "label",
                  type: "string",
                  description: "Label text for the textarea",
                },
                {
                  name: "textareaSize",
                  type: "'sm' | 'md' | 'lg'",
                  default: "'md'",
                  description: "Size of the textarea",
                },
                {
                  name: "error",
                  type: "string",
                  description: "Error message to display",
                },
                {
                  name: "helperText",
                  type: "string",
                  description: "Helper text below textarea",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the textarea",
                },
              ]}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
