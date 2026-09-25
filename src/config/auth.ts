export const SESSION_COOKIE = "x-web-session";

export const HANDLE_MIN_LENGTH = 5;
export const HANDLE_MAX_LENGTH = 15;
export const HANDLE_PATTERN = /^[A-Za-z0-9_]+$/;
export const RESERVED_HANDLES = ["login", "logout", "register", "compose"];

export const IDENTIFIER_PATTERN = "^[a-zA-Z0-9@._+\\-]+$";

export const ONBOARDING_TITLE = "X - The Everything App / X";
export const RESET_CODE_LENGTH = 6;
export const RESET_CODE_RETRY_SECONDS = 15;

export const PASSWORD_MIN_LENGTH = 8;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;
export const PHONE_PATTERN = "^[0-9 ()+\\-]+$";
export const HANDLE_CHECK_DELAY_MS = 300;
export const BIRTH_YEAR_RANGE = 120;

export const DEFAULT_AVATAR_URL = "/avatars/default.svg";
export const GET_APP_QR_URL = "/get-app-qr.svg";
