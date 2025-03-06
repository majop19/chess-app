import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <Card>
        <CardContent>
          <CardTitle>Salut !</CardTitle>
          <p className="font-bold text-3xl">Bonjour je m'appelle matteo</p>
        </CardContent>
      </Card>
    </div>
  );
}
