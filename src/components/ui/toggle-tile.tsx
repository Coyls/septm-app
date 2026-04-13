import { cn } from "@/lib/utils";
import Image from "next/image";

interface ToggleTileProps {
  label: string;
  sublabel?: string;
  image?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
  className?: string;
}

function ToggleTile({
  label,
  sublabel,
  image,
  checked,
  disabled = false,
  onChange,
  className,
}: ToggleTileProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative flex flex-row items-center rounded-lg border text-left transition-all h-14 overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked
          ? "border-primary/60 bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
          : "border-border bg-card text-muted-foreground",
        disabled
          ? "cursor-default"
          : "cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
        className,
      )}
    >
      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 px-3 py-2.5 flex-1">
        <span className="text-sm font-medium leading-tight">{label}</span>
        {sublabel && (
          <span className="text-xs text-(--text-weak) leading-tight">
            {sublabel}
          </span>
        )}
      </div>

      {/* Extension image — full height, flush right */}
      {image ? (
        <div className="relative shrink-0 h-full w-24">
          {/* Gradient fade to blend with tile background */}
          <div className="absolute inset-y-0 left-0 w-6 z-10 bg-linear-to-r from-card to-transparent" />
          <Image
            src={image}
            alt={label}
            fill
            className={cn(
              "object-cover transition-opacity",
              checked ? "opacity-80" : "opacity-30",
            )}
          />
        </div>
      ) : (
        /* Active indicator dot (fallback when no image) */
        <span
          className={cn(
            "shrink-0 mr-3 h-1.5 w-1.5 rounded-full transition-colors",
            checked ? "bg-primary" : "bg-border",
          )}
        />
      )}
    </button>
  );
}

export { ToggleTile };
export type { ToggleTileProps };
