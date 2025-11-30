import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationIcon from "../icons/NotificationIcon";
import ComingSoonDialog from "./ComingSoonDialog";

export function MyNotifications() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <Button
        variant="link"
        className="hover:bg-mysecondary/20"
        onClick={() => setShowComingSoon(true)}
      >
        <NotificationIcon className="scale-175" />
      </Button>
      <ComingSoonDialog
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
        featureName="Notifications"
      />
    </>
  );
}
export default MyNotifications;
