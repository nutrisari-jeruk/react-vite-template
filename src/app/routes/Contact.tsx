import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, FormInput, FormTextarea } from "@/components";
import { ROUTES } from "@/config/constants";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleClear = () => {
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <Button variant="outline-secondary" size="sm" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have a question or feedback? We'd love to hear from you!
          </p>
        </div>

        {showSuccess && (
          <Alert
            variant="success"
            title="Success!"
            dismissible
            timeout={3000}
            onDismiss={() => setShowSuccess(false)}
            className="mb-6"
          >
            Your message has been sent successfully. We'll get back to you soon!
          </Alert>
        )}

        <Card className="mb-8 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                id="name"
                label="Name"
                type="text"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <FormInput
                id="email"
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <FormTextarea
                id="message"
                label="Message"
                placeholder="Tell us what's on your mind..."
                rows={6}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                Send Message
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:underline"
              >
                +1 (234) 567-890
              </a>
            </p>
            <p>
              <strong>Hours:</strong> Mon-Fri, 9AM-5PM EST
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ContactPage;
