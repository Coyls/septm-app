import type {
  FriendEntry,
  FriendRequest,
  ReceivedRequest,
  RelationshipStatusResponse,
  SendFriendRequestBody,
  SentRequest,
} from "@/lib/types";
import { apiFetch } from "./fetch";

export function getFriends(): Promise<FriendEntry[]> {
  return apiFetch("/friend-request/friends");
}

export function getReceivedRequests(): Promise<ReceivedRequest[]> {
  return apiFetch("/friend-request/received");
}

export function getSentRequests(): Promise<SentRequest[]> {
  return apiFetch("/friend-request/sent");
}

export function getRelationshipStatus(
  targetUserId: string,
): Promise<RelationshipStatusResponse> {
  return apiFetch(`/friend-request/status/${targetUserId}`);
}

export function sendFriendRequest(
  body: SendFriendRequestBody,
): Promise<FriendRequest> {
  return apiFetch("/friend-request/invite", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function acceptRequest(
  senderId: string,
): Promise<{ senderId: string; receiverId: string; status: "ACCEPTED" }> {
  return apiFetch(`/friend-request/${senderId}/accept`, { method: "PATCH" });
}

export function rejectRequest(
  senderId: string,
): Promise<{ senderId: string; receiverId: string }> {
  return apiFetch(`/friend-request/${senderId}/reject`, { method: "DELETE" });
}

export function cancelRequest(
  receiverId: string,
): Promise<{ senderId: string; receiverId: string }> {
  return apiFetch(`/friend-request/${receiverId}/cancel`, { method: "DELETE" });
}

export function removeFriend(friendId: string): Promise<{ success: true }> {
  return apiFetch(`/friend-request/friends/${friendId}`, { method: "DELETE" });
}
