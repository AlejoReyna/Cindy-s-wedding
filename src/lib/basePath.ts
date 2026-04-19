export const BASE_PATH = "/cindy_y_jorge";

export const withBasePath = (path: string) => {
  if (!path.startsWith("/")) {
    return path;
  }

  return `${BASE_PATH}${path}`;
};
