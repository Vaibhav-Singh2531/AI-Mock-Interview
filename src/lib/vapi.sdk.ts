import Vapi from "@vapi-ai/web";

const token = import.meta.env.VITE_VAPI_WEB_TOKEN;

if (!token) {
  throw new Error("Missing VITE_VAPI_WEB_TOKEN in env");
}

export const vapi = new Vapi(token);
