import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
} from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Badge>Walrus + Sui</Badge>

          <h1 className="font-heading mt-4 text-6xl">TrestoForm</h1>

          <p className="text-muted-foreground mt-2 max-w-xl">
            Privacy-first verifiable forms built on Walrus.
          </p>
        </div>

        <Card className="rounded-3xl border-border">
          <CardHeader>
            <CardTitle>Create Form</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input placeholder="Form title..." />

            <div className="flex gap-3">
              <Button>Create</Button>

              <Button variant="secondary">Preview</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
