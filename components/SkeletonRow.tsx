import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[50px] mx-auto" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
      </div>
    </TableCell>
  </TableRow>
);

export default SkeletonRow;
