/**
 * Metadata utility for managing page titles and meta tags.
 *
 * Provides a centralized way to update document metadata when routes change.
 */

const SITE_NAME = "RSUD R.T. Notopuro";

type PageMetadata = {
  title: string;
  description?: string;
};

/**
 * Sets the page title with site name suffix.
 * @param title - The page title (without site name suffix)
 */
export function setPageTitle(title: string): void {
  document.title = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
}

/**
 * Updates the meta description.
 * @param description - The meta description content
 */
export function setMetaDescription(description: string): void {
  let meta = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;

  // Also update og:description
  const ogDesc = document.querySelector(
    'meta[property="og:description"]'
  ) as HTMLMetaElement;
  if (ogDesc) {
    ogDesc.content = description;
  }

  // Update twitter:description
  const twitterDesc = document.querySelector(
    'meta[name="twitter:description"]'
  ) as HTMLMetaElement;
  if (twitterDesc) {
    twitterDesc.content = description;
  }
}

/**
 * Updates the canonical URL.
 * @param url - The canonical URL
 */
export function setCanonicalUrl(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;

  // Also update og:url
  const ogUrl = document.querySelector(
    'meta[property="og:url"]'
  ) as HTMLMetaElement;
  if (ogUrl) {
    ogUrl.content = url;
  }

  // Update twitter:url
  const twitterUrl = document.querySelector(
    'meta[name="twitter:url"]'
  ) as HTMLMetaElement;
  if (twitterUrl) {
    twitterUrl.content = url;
  }
}

/**
 * Updates Open Graph title.
 * @param title - The OG title
 */
export function setOgTitle(title: string): void {
  const ogTitle = document.querySelector(
    'meta[property="og:title"]'
  ) as HTMLMetaElement;
  if (ogTitle) {
    ogTitle.content = title;
  }

  // Also update twitter:title
  const twitterTitle = document.querySelector(
    'meta[name="twitter:title"]'
  ) as HTMLMetaElement;
  if (twitterTitle) {
    twitterTitle.content = title;
  }
}

/**
 * Sets all page metadata at once.
 * @param metadata - The page metadata object
 */
export function setPageMetadata(metadata: PageMetadata): void {
  if (metadata.title) {
    setPageTitle(metadata.title);
    setOgTitle(metadata.title);
  }
  if (metadata.description) {
    setMetaDescription(metadata.description);
  }
}

/**
 * Resets metadata to default homepage values.
 */
export function resetMetadata(): void {
  setPageTitle(SITE_NAME);
  setMetaDescription(
    `${SITE_NAME} - Modern hospital information system for efficient patient management and medical services.`
  );
  setCanonicalUrl(window.location.origin + "/");
}
