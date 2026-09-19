/**
 * Resolves avatar image URLs consistently across all components.
 * Supports:
 * - VITE_PROFILE_URL environment variable (default: http://localhost:3000/uploads/profiles)
 * - VITE_API_URL environment variable fallback
 * - Full URLs (http://, https://, blob:, data:)
 * - Database stored paths with or without leading '/uploads/', '/profiles/', etc.
 * - Default profile fallback (default-profile.png)
 */

export const getProfileBaseUrl = () => {
  const profileUrl = import.meta.env.VITE_PROFILE_URL;
  if (profileUrl && typeof profileUrl === "string" && profileUrl.trim()) {
    return profileUrl.trim().replace(/\/+$/, "");
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/uploads/";
  const cleanApiUrl = apiUrl.trim().replace(/\/+$/, "");
  return `${cleanApiUrl}/profiles`;
};

export const DEFAULT_PROFILE_IMAGE = `${getProfileBaseUrl()}/default-profile.png`;

export const isDefaultAvatar = (profileImage) => {
  if (!profileImage || typeof profileImage !== "string") return true;
  const clean = profileImage.trim().toLowerCase();
  return (
    !clean ||
    clean === "undefined" ||
    clean === "null" ||
    clean.includes("default-profile")
  );
};

export const getAvatarUrl = (profileImage, fallbackName = "Member") => {
  const profileBase = getProfileBaseUrl();
  const defaultProfileUrl = `${profileBase}/default-profile.png`;

  if (!profileImage || typeof profileImage !== "string") {
    return defaultProfileUrl;
  }

  const clean = profileImage.trim();
  if (
    !clean ||
    clean === "undefined" ||
    clean === "null" ||
    clean.toLowerCase().includes("default-profile")
  ) {
    return defaultProfileUrl;
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

  // Clean path: strip leading '/uploads/profiles/', 'uploads/profiles/', '/uploads/', 'uploads/', '/profiles/', 'profiles/', or leading '/'
  const cleanPath = clean
    .replace(/^(\/)?uploads\/(profiles\/)?/i, "")
    .replace(/^(\/)?profiles\//i, "")
    .replace(/^\/+/, "");

  return `${profileBase}/${cleanPath}`;
};

export const handleAvatarError = (e, fallbackName = "Member") => {
  e.target.onerror = null;
  const defaultUrl = DEFAULT_PROFILE_IMAGE;
  if (e.target.src !== defaultUrl) {
    e.target.src = defaultUrl;
  } else {
    // If even the default profile fails (e.g. backend server offline), fallback to generated avatar
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Member")}&background=4f46e5&color=fff&bold=true`;
  }
};
