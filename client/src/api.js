// client/src/api.js
import axios from "axios";
import { Capacitor } from "@capacitor/core";

export const BASE_URL = Capacitor.isNativePlatform()
  ? "https://jamongclean.co.kr"
  : "";

  axios.defaults.baseURL = BASE_URL || undefined;
  