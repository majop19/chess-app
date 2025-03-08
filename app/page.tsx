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
        </CardContent>
      </Card>
    </div>
  );
}
