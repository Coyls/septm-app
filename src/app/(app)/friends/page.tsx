"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReceivedRequests } from "@/lib/query/hooks/useFriends";
import { FriendsTab } from "./_components/friends-tab";
import { InviteTab } from "./_components/invite-tab";
import { ReceivedTab } from "./_components/received-tab";

export default function FriendsPage() {
  const { data: received } = useReceivedRequests();
  const pendingCount = received?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Amis</h1>

      <Tabs defaultValue="friends">
        <TabsList className="w-full ">
          <TabsTrigger value="friends" className="flex-1 cursor-pointer">
            Mes amis
          </TabsTrigger>
          <TabsTrigger value="received" className="flex-1 gap-2 cursor-pointer">
            Demandes reçues
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invite" className="flex-1 cursor-pointer">
            Inviter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          <FriendsTab />
        </TabsContent>
        <TabsContent value="received" className="mt-4">
          <ReceivedTab />
        </TabsContent>
        <TabsContent value="invite" className="mt-4">
          <InviteTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
