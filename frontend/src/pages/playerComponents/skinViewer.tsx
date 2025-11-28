import ReactSkinview3d from "react-skinview3d";
import { Dialog } from "radix-ui";
import "./dialog.css";
import { motion } from "motion/react";
import View3DIcon from "/src/assets/view-3d-icon.svg";

type SkinViewProps = {
  skinUrl: string;
  capeUrl: string | null;
  username: string;
};

function SkinView({ skinUrl, capeUrl, username }: SkinViewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.1,
            type: "spring",
            delay: 0.2,
            ease: "easeOut",
          }}
          data-tooltip="View in 3D"
          className="tooltip skin-button fill-button"
        >
          <img src={View3DIcon} alt="View skin in 3d viewer" />
        </motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title>{username}'s skin</Dialog.Title>
          <Dialog.Description />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: "easeInOut", duration: 0.3 }}
            className="skin-container"
          >
            <ReactSkinview3d
              skinUrl={skinUrl}
              capeUrl={capeUrl || undefined}
              height="300"
              width="300"
            />
          </motion.div>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SkinView;
