"use client";

import {
  acceptRequest,
  cancelRequest,
  getFriends,
  getReceivedRequests,
  getSentRequests,
  rejectRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/api/friends";
import { queryKeys } from "@/lib/query/keys";
import type {
  FriendEntry,
  ReceivedRequest,
  SendFriendRequestBody,
  SentRequest,
} from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFriends() {
  return useQuery({
    queryKey: queryKeys.friends.list(),
    queryFn: getFriends,
  });
}

export function useReceivedRequests() {
  return useQuery({
    queryKey: queryKeys.friends.received(),
    queryFn: getReceivedRequests,
  });
}

export function useSentRequests() {
  return useQuery({
    queryKey: queryKeys.friends.sent(),
    queryFn: getSentRequests,
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendFriendRequestBody) => sendFriendRequest(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.sent() });
      toast.success("Demande d'ami envoyée !");
    },
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId: string) => acceptRequest(senderId),
    onMutate: async (senderId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.friends.received(),
      });
      const previous = queryClient.getQueryData<ReceivedRequest[]>(
        queryKeys.friends.received(),
      );
      queryClient.setQueryData<ReceivedRequest[]>(
        queryKeys.friends.received(),
        (old) => old?.filter((r) => r.senderId !== senderId) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeys.friends.received(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.received() });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list() });
    },
    onSuccess: () => {
      toast.success("Demande acceptée !");
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId: string) => rejectRequest(senderId),
    onMutate: async (senderId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.friends.received(),
      });
      const previous = queryClient.getQueryData<ReceivedRequest[]>(
        queryKeys.friends.received(),
      );
      queryClient.setQueryData<ReceivedRequest[]>(
        queryKeys.friends.received(),
        (old) => old?.filter((r) => r.senderId !== senderId) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeys.friends.received(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.received() });
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) => cancelRequest(receiverId),
    onMutate: async (receiverId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.friends.sent() });
      const previous = queryClient.getQueryData<SentRequest[]>(
        queryKeys.friends.sent(),
      );
      queryClient.setQueryData<SentRequest[]>(
        queryKeys.friends.sent(),
        (old) => old?.filter((r) => r.receiverId !== receiverId) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeys.friends.sent(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.sent() });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => removeFriend(friendId),
    onMutate: async (friendId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.friends.list() });
      const previous = queryClient.getQueryData<FriendEntry[]>(
        queryKeys.friends.list(),
      );
      queryClient.setQueryData<FriendEntry[]>(
        queryKeys.friends.list(),
        (old) => old?.filter((f) => f.friend.id !== friendId) ?? [],
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeys.friends.list(), context?.previous);
      toast.error("Impossible de retirer cet ami");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list() });
    },
  });
}
