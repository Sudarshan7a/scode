import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import NotificationIcon from "../icons/NotificationIcon";
import MyAlert from "./MyAlert";
import { NOTIFICATION_DATA } from "@/constants/NotificationData";
import { ScrollArea } from "../ui/scroll-area";

export function MyNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="link" className="hover:bg-mysecondary/20 ">
          <NotificationIcon className="scale-175" />
        </Button>
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent className="min-w-[40%] w-120 mt-1 border-mysecondary border-2 mr-4">
        <ScrollArea className="max-h-[80vh] w-full">
          {NOTIFICATION_DATA.map((group) => (
            <div key={group.label}>
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              <DropdownMenuGroup className="mb-1">
                {group.items.map((item) => (
                  <DropdownMenuItem key={item.key} className="m-0 p-0">
                    <MyAlert
                      title={item.title}
                      description={item.description}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {group.label !== "Earlier" && (
                <Separator className="bg-mysecondary w-[80%]" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default MyNotifications;
