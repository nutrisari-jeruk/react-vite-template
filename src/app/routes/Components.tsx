import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
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
  Spinner,
  Progress,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Toggle,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components";
import { ROUTES } from "@/config/constants";
import { cn } from "@/utils/cn";

const COMPONENT_SECTIONS = [
  "alerts",
  "avatars",
  "badges",
  "buttons",
  "cards",
  "checkbox",
  "combobox",
  "inputs",
  "select",
  "spinners",
  "progress",
  "switch",
  "tabs",
  "accordions",
  "textarea",
  "toggle",
  "tooltips",
] as const;

function ComponentsPage() {
  const [fruit, setFruit] = useState<string | undefined>();
  const [withError, setWithError] = useState<string | undefined>();
  const [withHelper, setWithHelper] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState<string>("");
  const shouldReduceMotion = useReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    COMPONENT_SECTIONS.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      if (shouldReduceMotion) {
        window.scrollTo({ top: y, behavior: "auto" });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-12rem)] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <Button variant="outline-secondary" size="sm" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-balance text-gray-900">
            Component Library
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-gray-600">
            A collection of accessible, reusable UI components built with
            Tailwind CSS.
          </p>
        </div>

        <div className="flex gap-8">
          <div className="min-w-0 flex-1">
            <div className="space-y-8">
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
                title="Cards"
                description="Card components"
                preview={
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card
                      title="Default Card"
                      description="This is a default card"
                    >
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
                    <Card
                      variant="flat"
                      title="Flat"
                      description="Minimal style"
                    >
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
                title="Spinners"
                description="Loading indicators with multiple variants"
                preview={
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-700">
                        Spinner Variant
                      </p>
                      <div className="flex items-center gap-4">
                        <Spinner size="xs" label="XS" />
                        <Spinner size="sm" label="SM" />
                        <Spinner size="md" label="MD" />
                        <Spinner size="lg" label="LG" />
                        <Spinner size="xl" label="XL" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-700">
                        Dots Variant
                      </p>
                      <div className="flex items-center gap-4">
                        <Spinner size="xs" variant="dots" />
                        <Spinner size="sm" variant="dots" />
                        <Spinner size="md" variant="dots" />
                        <Spinner size="lg" variant="dots" />
                        <Spinner size="xl" variant="dots" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-700">
                        Bars Variant
                      </p>
                      <div className="flex items-center gap-4">
                        <Spinner size="xs" variant="bars" />
                        <Spinner size="sm" variant="bars" />
                        <Spinner size="md" variant="bars" />
                        <Spinner size="lg" variant="bars" />
                        <Spinner size="xl" variant="bars" />
                      </div>
                    </div>
                  </div>
                }
                code={`<Spinner size="md" variant="spinner" label="Loading..." />
<Spinner size="lg" variant="dots" />
<Spinner size="xl" variant="bars" label="Processing..." />`}
              />

              <ComponentDemo
                title="Progress"
                description="Progress indicators for loading states"
                preview={
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Linear Progress
                      </p>
                      <div className="space-y-4">
                        <Progress value={30} max={100} size="sm" />
                        <Progress value={50} max={100} size="md" />
                        <Progress value={70} max={100} size="lg" />
                        <Progress
                          value={90}
                          max={100}
                          label="Loading file..."
                          showValue
                        />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Circular Progress
                      </p>
                      <div className="flex items-center gap-6">
                        <Progress
                          value={25}
                          max={100}
                          variant="circular"
                          size="sm"
                        />
                        <Progress
                          value={50}
                          max={100}
                          variant="circular"
                          size="md"
                        />
                        <Progress
                          value={75}
                          max={100}
                          variant="circular"
                          size="lg"
                        />
                        <Progress
                          value={100}
                          max={100}
                          variant="circular"
                          size="lg"
                          showValue
                        />
                      </div>
                    </div>
                  </div>
                }
                code={`// Linear progress
<Progress value={60} max={100} label="Loading..." showValue />

// Circular progress
<Progress value={75} max={100} variant="circular" size="lg" showValue />`}
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
                title="Tabs"
                description="Tab panels for organizing content"
                preview={
                  <div className="max-w-2xl">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                        <Card className="p-6">
                          <h3 className="mb-2 text-lg font-semibold">
                            Overview
                          </h3>
                          <p className="text-gray-600">
                            This is the overview tab content. Click on different
                            tabs to see the content switch with smooth
                            animations.
                          </p>
                        </Card>
                      </TabsContent>
                      <TabsContent value="features">
                        <Card className="p-6">
                          <h3 className="mb-2 text-lg font-semibold">
                            Features
                          </h3>
                          <p className="text-gray-600">
                            This tab shows the features of the product or
                            component.
                          </p>
                        </Card>
                      </TabsContent>
                      <TabsContent value="settings">
                        <Card className="p-6">
                          <h3 className="mb-2 text-lg font-semibold">
                            Settings
                          </h3>
                          <p className="text-gray-600">
                            Configure your preferences in this tab.
                          </p>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                }
                code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="features">Features</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content</p>
  </TabsContent>
  <TabsContent value="features">
    <p>Features content</p>
  </TabsContent>
</Tabs>`}
              />

              <ComponentDemo
                title="Accordions"
                description="Collapsible content sections"
                preview={
                  <div className="max-w-2xl">
                    <Accordion defaultValue="section-1">
                      <AccordionItem value="section-1">
                        <AccordionTrigger>Getting Started</AccordionTrigger>
                        <AccordionPanel>
                          <Card className="p-6">
                            <p className="text-gray-600">
                              Learn the basics of using this component library.
                              Each section can be expanded independently.
                            </p>
                          </Card>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem value="section-2">
                        <AccordionTrigger>Advanced Features</AccordionTrigger>
                        <AccordionPanel>
                          <Card className="p-6">
                            <p className="text-gray-600">
                              Explore more advanced configurations and
                              customization options available in the components.
                            </p>
                          </Card>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem value="section-3">
                        <AccordionTrigger>Best Practices</AccordionTrigger>
                        <AccordionPanel>
                          <Card className="p-6">
                            <p className="text-gray-600">
                              Follow these guidelines to ensure consistent and
                              accessible user interfaces across your
                              application.
                            </p>
                          </Card>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </div>
                }
                code={`<Accordion defaultValue="section-1">
  <AccordionItem value="section-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionPanel>
      <p>Content for section 1</p>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem value="section-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionPanel>
      <p>Content for section 2</p>
    </AccordionPanel>
  </AccordionItem>
</Accordion>`}
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
                title="Tooltips"
                description="Tooltip components with different variants and placements"
                preview={
                  <div className="space-y-8">
                    <Card className="bg-white p-6">
                      <div className="flex flex-wrap items-center justify-center gap-6">
                        <Tooltip
                          content="Tooltip"
                          variant="dark"
                          placement="top"
                        >
                          <Button variant="primary">Top</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="dark"
                          placement="bottom"
                        >
                          <Button variant="primary">Bottom</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="dark"
                          placement="left"
                        >
                          <Button variant="primary">Left</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="dark"
                          placement="right"
                        >
                          <Button variant="primary">Right</Button>
                        </Tooltip>
                      </div>
                    </Card>
                    <Card variant="flat" className="bg-gray-900 p-6">
                      <div className="flex flex-wrap items-center justify-center gap-6">
                        <Tooltip
                          content="Tooltip"
                          variant="light"
                          placement="top"
                        >
                          <Button variant="secondary">Top</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="light"
                          placement="bottom"
                        >
                          <Button variant="secondary">Bottom</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="light"
                          placement="left"
                        >
                          <Button variant="secondary">Left</Button>
                        </Tooltip>
                        <Tooltip
                          content="Tooltip"
                          variant="light"
                          placement="right"
                        >
                          <Button variant="secondary">Right</Button>
                        </Tooltip>
                      </div>
                    </Card>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                      <Tooltip content="Hover over me for more info">
                        <span className="cursor-pointer text-blue-600 underline">
                          Hover me
                        </span>
                      </Tooltip>
                      <Tooltip content="This is a disabled tooltip" disabled>
                        <Button variant="secondary" disabled>
                          Disabled
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                }
                code={`<Tooltip content="Tooltip" variant="dark" placement="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip content="Tooltip" variant="light" placement="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip content="Hover over me for more info">
  <span className="underline">Hover me</span>
</Tooltip>

<Tooltip content="Disabled tooltip" disabled>
  <Button disabled>Disabled</Button>
</Tooltip>`}
              />
            </div>
          </div>

          <aside className="sticky top-24 hidden h-[calc(100dvh-8rem)] w-64 shrink-0 lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.15,
                ease: "easeOut",
              }}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <h2 className="mb-4 text-sm font-semibold text-balance text-gray-900">
                Table of Contents
              </h2>
              <nav className="space-y-1">
                {COMPONENT_SECTIONS.map((section) => {
                  const isActive = activeSection === section;
                  const label =
                    section.charAt(0).toUpperCase() + section.slice(1);

                  return (
                    <a
                      key={section}
                      href={`#${section}`}
                      onClick={(e) => handleTocClick(e, section)}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-gray-100 font-medium text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComponentsPage;
