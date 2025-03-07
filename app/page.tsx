"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Home() {
  const session = useSession();

  const user = session?.data?.user;

  return (
    <div>
      <Card>
        <CardContent>
          <CardTitle>Salut !</CardTitle>
          <p className="font-bold text-3xl">Bonjour je m'appelle matteo</p>
          <Button onClick={() => signIn()} variant="destructive">
            Sign In
          </Button>
          <Button onClick={() => signOut()}>Sign out</Button>
          <div>
            <p>{user?.id}</p>
            <p>{user?.email}</p>
            <p>{user?.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
