import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import FormTextarea from "../components/FormTextarea";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline-primary" size="sm">
              <span>← Back to Home</span>
            </Button>
          </Link>
        </div>

        <Card variant="elevated">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contact Us
            </h1>
            <p className="text-gray-600">
              Have a question or feedback? We'd love to hear from you!
            </p>
          </div>

          {submitted && (
            <div className="mb-6">
              <Alert
                variant="success"
                title="Success!"
                dismissible
                onDismiss={() => setSubmitted(false)}
              >
                Your message has been sent successfully. We'll get back to you
                soon!
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="name"
              label="Name"
              type="text"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <FormTextarea
              id="message"
              label="Message"
              rows={6}
              placeholder="Tell us what's on your mind..."
              required
              value={formData.message}
              onChange={handleChange}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
              >
                Send Message
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                size="lg"
                onClick={() =>
                  setFormData({ name: "", email: "", message: "" })
                }
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8">
          <Card variant="outlined">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    support@example.com
                  </a>
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    href="tel:+1234567890"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    +1 (234) 567-890
                  </a>
                </p>
                <p>
                  <span className="font-medium">Hours:</span> Mon-Fri, 9AM-5PM
                  EST
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
