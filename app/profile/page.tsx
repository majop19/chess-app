import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { FormProfile } from "./FormProfile";

export default async function ProfilePage() {
  const session = await getRequiredAuthSession();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      imageCloudinary: {
        select: {
          url: true,
        },
      },
    },
  });

  return (
    <div className="w-4xl h-4xl mx-auto p-4 items-center">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Section Profil */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user?.imageCloudinary?.url ?? user?.image ?? undefined}
              alt="Profil"
              className="rounded-md "
            />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">
              Compte créé le {user?.createdAt.toDateString()}
            </p>
          </div>
        </div>

        {/* Section Messages reçus */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Messages reçus</h3>
          <div className="space-y-4">
            {[
              {
                id: 164,
                sender: "matteo",
                text: "usdvududssdfiksd dsjbfds dsfhbdh df h. Mfjshfd",
              },
            ].map((msg) => (
              <Card key={msg.id} className="bg-gray-100">
                <CardHeader>
                  <CardTitle className="text-md font-medium">
                    {msg.sender}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{msg.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Formulaire de modification du profil */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
          <FormProfile />
        </div>

        {/* Section Amis */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Amis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 1423,
                avatar: session.user.image,
                name: session.user.name,
                online: true,
              },
            ].map((friend) => (
              <Card key={friend.id} className="p-4 flex flex-col items-center">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p>{friend.name}</p>
                <span
                  className={`mt-1 text-sm ${
                    friend.online ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {friend.online ? "En ligne" : "Hors ligne"}
                </span>
                <Button variant="outline" size="sm" className="mt-2">
                  Envoyer un message
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
