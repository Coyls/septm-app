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

export function ScorePageHeader({
  gameId,
  isPending,
  disabled,
  onSubmit,
}: {
  gameId: string;
  isPending: boolean;
  disabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold">Saisie des scores</h1>
        <p className="text-sm text-muted-foreground">
          Partie #{gameId.slice(0, 8)}…
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger render={<Button disabled={disabled} />}>
          {isPending ? "Enregistrement…" : "Finaliser la partie"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finaliser la partie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les scores seront enregistrés
              définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
