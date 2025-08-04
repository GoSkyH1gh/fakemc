import ReactSkinview3d from "react-skinview3d";
import * as Dialog from "@radix-ui/react-dialog";
import "./dialog.css";
import { motion } from "motion/react";
import View3DIcon from "/src/assets/view-3d-icon.svg";

function SkinView({ skinUrl, capeUrl, username }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, type: "spring", delay: 0.5, ease: "easeOut" }}
          data-tooltip="View in 3D"
          className="tooltip"
        >
          <img src={View3DIcon} alt="view skin in 3d viewer" />
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
              capeUrl={capeUrl}
              height="300"
              width="300"
              options={{ zoom: "0.95" }}
            />
          </motion.div>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SkinView;
