// client/src/api.js
import { Capacitor } from "@capacitor/core";

export const BASE_URL = Capacitor.isNativePlatform()
  ? "https://jamongclean.co.kr"
  : "";