"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminClientesPage() {
  const [companyName, setCompanyName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: companyName,
        owner_email: ownerEmail,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Error al crear la cuenta" });
    } else {
      setMessage({
        type: "ok",
        text: `Cuenta creada. Invitacion enviada a ${ownerEmail}.`,
      });
      setCompanyName("");
      setOwnerEmail("");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Alta de cliente</CardTitle>
          <CardDescription className="text-muted-foreground">
            Crea una cuenta nueva e invita al dueno por email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  message.type === "error"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-green-500/20 bg-green-500/10 text-green-400"
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">Nombre de la empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerEmail">Email del dueno</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
