// Global CSS module type declarations
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

// Specific declaration for Stream Video SDK CSS
declare module "@stream-io/video-react-sdk/dist/css/styles.css" {
  const content: Record<string, string>;
  export default content;
}
