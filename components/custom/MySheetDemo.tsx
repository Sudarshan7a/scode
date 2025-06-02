import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MyCommandSearch from "./MyCommandSearch";

export function MySheetDemo({
  title,
  headTitle,
  headDescription,
  filters,
  sortBy,
}: {
  title: string;
  headTitle?: string;
  headDescription?: string;
  filters?: {
    title: string;
    options: string[];
  }[];
  sortBy?: {
    title: string;
    radio?: boolean;
    options: string[];
  }[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="shadow-mysecondary border-mysecondary"
        >
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-start">
        <SheetHeader>
          <SheetTitle className="text-foreground">{headTitle}</SheetTitle>
          <SheetDescription className="text-foreground">
            {headDescription}
          </SheetDescription>
        </SheetHeader>
        <MyCommandSearch title="Search" filters={filters} sortBy={sortBy} />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default MySheetDemo;
