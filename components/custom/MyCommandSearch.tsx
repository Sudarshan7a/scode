import {} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "../ui/label";
import MyCheckBox from "./MyCheckBox";
import MyRadioGroup from "./MyRadioGroup";

export function MyCommandSearch({
  title,
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
    <Command className="h-fit p-1">
      <CommandInput
        className="placeholder:text-foreground border-mysecondary p-1"
        placeholder={`Search ${title.toLowerCase()}...`}
      />
      <CommandList>
        <CommandEmpty className="">No results found.</CommandEmpty>
        {/* <ScrollArea className=" px-6 scrollbar-hide "> */}
        {/* Filters Section */}
        {filters && filters.length > 0 && (
          <CommandGroup>
            {filters.map((filter) => (
              <CommandItem key={filter.title}>
                <div className="flex flex-col items-start space-x-2">
                  <Label className="text-sm font-medium">{filter.title}</Label>
                  <div className="mt-2 space-y-2">
                    {filter.options.map((option) => (
                      <MyCheckBox key={option} description={option} />
                    ))}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {/* Sort By Section */}
        {sortBy && sortBy.length > 0 && (
          <CommandGroup className="scrollbar-hide">
            {sortBy.map((option) => (
              <CommandItem key={option.title}>
                <div className="flex flex-col items-start space-x-2">
                  <Label className="text-sm font-medium">{option.title}</Label>
                  {option.radio ? (
                    <MyRadioGroup lists={option.options} />
                  ) : (
                    <div className="mt-2 space-y-2">
                      {option.options.map((option) => (
                        <MyCheckBox key={option} description={option} />
                      ))}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {/* </ScrollArea> */}
      </CommandList>
    </Command>
  );
}
export default MyCommandSearch;
