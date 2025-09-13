import * as Dialog from "@radix-ui/react-dialog";
import helpIcon from "/src/assets/help-icon.svg";

function DistributionHelpDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="icon-button">
          <img src={helpIcon} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title>How This Diagram Works</Dialog.Title>
          <Dialog.Description />
          <div>sample explain text</div>
          <Dialog.Close>Great!</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default DistributionHelpDialog;
