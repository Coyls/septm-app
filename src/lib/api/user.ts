import { apiFetch } from "./fetch";

export function updateName(name: string): Promise<{ success: true }> {
  return apiFetch("/user/name", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export function deleteAccount(): Promise<true> {
  return apiFetch("/user", { method: "DELETE" });
}
