export type InputType = "email" | "mobile" | "invalid";

export function checkNumberOrEmail(input: string): InputType {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^01[3-9]\d{8}$/; 

  if (emailRegex.test(input)) return "email";
  if (mobileRegex.test(input)) return "mobile";
  return "invalid";
}