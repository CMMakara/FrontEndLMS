/**
 * Resolves avatar image URLs consistently across all components.
 * Handles:
 * - Full URLs (http://, https://, blob:, data:)
 * - Database stored paths with leading '/uploads/' or 'uploads/'
 * - Default placeholder images or missing values, returning a clean UI-Avatars URL
 */
export const getAvatarUrl = (profileImage, fallbackName = "Member") => {
  if (!profileImage || typeof profileImage !== "string") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Member")}&background=4f46e5&color=fff&bold=true`;
  }

  const clean = profileImage.trim();
  if (
    !clean ||
    clean === "undefined" ||
    clean === "null" ||
    clean.includes("default-profile.png") ||
    clean.includes("default-profile")
  ) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Member")}&background=4f46e5&color=fff&bold=true`;
  }

  // Already a full remote URL, blob URL (from file upload preview), or data URL
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("blob:") ||
    clean.startsWith("data:")
  ) {
    return clean;
  }

  // Strip redundant leading '/uploads/' or 'uploads/' and leading slashes
  const cleanPath = clean.replace(/^(\/)?uploads\//i, "").replace(/^\/+/, "");
  const base = (import.meta.env.VITE_API_URL || "http://localhost:3000/uploads/").replace(/\/?$/, "/");
  return `${base}${cleanPath}`;
};
