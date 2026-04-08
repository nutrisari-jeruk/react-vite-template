import { describe, it, expect, beforeEach } from "vitest";
import {
  setPageTitle,
  setMetaDescription,
  setCanonicalUrl,
  setOgTitle,
  setPageMetadata,
  resetMetadata,
} from "../metadata";

describe("metadata", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    document.title = originalTitle;
    document.head.innerHTML = "";
  });

  describe("setPageTitle", () => {
    it("sets title with site name suffix", () => {
      setPageTitle("Home");

      expect(document.title).toBe("Home | RSUD R.T. Notopuro");
    });

    it("uses bare title when matching site name", () => {
      setPageTitle("RSUD R.T. Notopuro");

      expect(document.title).toBe("RSUD R.T. Notopuro");
    });
  });

  describe("setMetaDescription", () => {
    it("creates meta description when missing", () => {
      setMetaDescription("Test description");

      const meta = document.querySelector('meta[name="description"]');
      expect(meta).toBeInTheDocument();
      expect((meta as HTMLMetaElement).content).toBe("Test description");
    });

    it("updates existing meta description", () => {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Old";
      document.head.appendChild(meta);

      setMetaDescription("New description");

      expect((meta as HTMLMetaElement).content).toBe("New description");
    });
  });

  describe("setCanonicalUrl", () => {
    it("creates canonical link when missing", () => {
      setCanonicalUrl("https://example.com/page");

      const link = document.querySelector('link[rel="canonical"]');
      expect(link).toBeInTheDocument();
      expect((link as HTMLLinkElement).href).toBe("https://example.com/page");
    });
  });

  describe("setOgTitle", () => {
    it("updates og:title when element exists", () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      document.head.appendChild(meta);

      setOgTitle("OG Title");

      expect((meta as HTMLMetaElement).content).toBe("OG Title");
    });
  });

  describe("setPageMetadata", () => {
    it("sets title and description", () => {
      setPageMetadata({ title: "Page", description: "Page desc" });

      expect(document.title).toContain("Page");
      const descMeta = document.querySelector('meta[name="description"]');
      expect((descMeta as HTMLMetaElement)?.content).toBe("Page desc");
    });
  });

  describe("resetMetadata", () => {
    it("resets to default values", () => {
      setPageTitle("Other");
      resetMetadata();

      expect(document.title).toBe("RSUD R.T. Notopuro");
    });
  });
});
