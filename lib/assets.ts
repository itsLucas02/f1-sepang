const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicAsset(pathname: string) {
  if (!pathname.startsWith("/")) {
    throw new Error(`Public asset paths must start with '/': ${pathname}`);
  }

  return `${BASE_PATH}${pathname}`;
}
