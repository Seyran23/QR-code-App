import { cn } from "@/lib/utils";
import { MoveDown, MoveUp } from "lucide-react";

const GrowthIndicator = ({ value }: { value: number }) => (
  <span
    className={cn(
      "flex items-center text-sm",
      value > 0 ? "text-green-500" : "text-red-500"
    )}
  >
    {value > 0 ? <MoveUp /> : <MoveDown />} {Math.abs(value)}%
  </span>
);

export default GrowthIndicator;
