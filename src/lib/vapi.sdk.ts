import VapiAny from "@vapi-ai/web";

// Extract default export if it's wrapped in an object (Vite CJS interop issue)
const Vapi = (VapiAny as any).default || VapiAny;

const token = import.meta.env.VITE_VAPI_WEB_TOKEN;

if (!token) {
  throw new Error("Missing VITE_VAPI_WEB_TOKEN in env");
}

export const vapi = new Vapi(token);
