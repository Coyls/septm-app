"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDeleteAccount, useUpdateName } from "@/lib/query/hooks/useUser";
import { AppError } from "@/lib/types";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName?: string | null;
}

interface AccountFormProps {
  currentName?: string | null;
  onClose: () => void;
}

function AccountForm({ currentName }: AccountFormProps) {
  const [name, setName] = useState(currentName ?? "");
  const updateName = useUpdateName();
  const deleteAccount = useDeleteAccount();
  const { theme, setTheme } = useTheme();

  function handleUpdateName(e: React.ChangeEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) return;

    updateName.mutate(trimmed, {
      onSuccess: () => {
        toast.success("Nom mis à jour.");
      },
      onError: (err) => {
        if (err instanceof AppError && err.status === 429) return;
        toast.error("Impossible de mettre à jour le nom.");
      },
    });
  }

  function handleDeleteAccount() {
    deleteAccount.mutate(undefined, {
      onError: (err) => {
        if (err instanceof AppError && err.status === 429) return;
        toast.error("Impossible de supprimer le compte.");
      },
    });
  }

  return (
    <div className="space-y-6 py-2">
      {/* Name section */}
      <form onSubmit={handleUpdateName} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="account-name">Nom d&apos;affichage</Label>
          <Input
            id="account-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="Votre nom"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="cursor-pointer"
          disabled={
            updateName.isPending ||
            !name.trim() ||
            name.trim() === (currentName ?? "")
          }
        >
          {updateName.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>

      <Separator />

      {/* Theme */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Apparence</p>
          <p className="text-xs text-muted-foreground">
            Choisissez le thème de l&apos;interface.
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={theme === "light" ? "secondary" : "ghost"}
            size="sm"
            className="gap-1.5"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-3.5 w-3.5" />
            Clair
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "secondary" : "ghost"}
            size="sm"
            className="gap-1.5"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-3.5 w-3.5" />
            Sombre
          </Button>
        </div>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">Zone de danger</p>
          <p className="text-xs text-muted-foreground">
            La suppression du compte est définitive et irréversible.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
              />
            }
          >
            Supprimer mon compte
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes vos données personnelles
                seront définitivement supprimées. Les parties que vous avez
                créées ou auxquelles vous avez participé sont conservées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? "Suppression…" : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function AccountDialog({
  open,
  onOpenChange,
  currentName,
}: AccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mon compte</DialogTitle>
        </DialogHeader>
        {open && (
          <AccountForm
            currentName={currentName}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
