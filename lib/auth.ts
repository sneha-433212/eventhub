export function getAuthUser() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") return null;

  try {
    const parsed = JSON.parse(token);

    if (parsed && typeof parsed === "object") {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}