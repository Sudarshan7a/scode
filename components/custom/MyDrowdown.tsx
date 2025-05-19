import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MyDropdownProps {
  title: string;
  items: string[];
  classname?: string;
}

function MyDropdown({ title, items, classname }: MyDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:ring-0 focus:outline-none border-mysecondary-hover border-1 text-white rounded-md px-4 py-2 shadow-md hover:cursor-pointer">
        {title}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={classname}>
        {items.map((item) => (
          <DropdownMenuItem
            className="hover:cursor-pointer font-medium font-secondary hover:text-white"
            key={item}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MyDropdown;
