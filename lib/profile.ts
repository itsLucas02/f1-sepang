export function parseDisplayName(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const displayName = value.trim().replace(/\s+/g, " ");
  return displayName.length >= 2 && displayName.length <= 24 ? displayName : null;
}
