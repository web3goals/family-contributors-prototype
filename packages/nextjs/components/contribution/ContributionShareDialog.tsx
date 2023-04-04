import { useState } from "react";
import ContributionShareActions from "./ContributionShareActions";
import { Dialog, DialogContent } from "@mui/material";

/**
 * Dialog to share a contribution.
 */
export default function ContributionShareDialog(props: { id: string; isClose?: boolean; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent sx={{ my: 2 }}>
        <ContributionShareActions id={props.id} />
      </DialogContent>
    </Dialog>
  );
}
