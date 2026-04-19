import { withBasePath } from "@/lib/basePath";

export default function Head() {
  return (
    <>
      <link rel="icon" href={withBasePath("/assets/logos/IMG_0340.PNG")} />
      <link rel="apple-touch-icon" href={withBasePath("/assets/logos/IMG_0340.PNG")} />
    </>
  );
}


