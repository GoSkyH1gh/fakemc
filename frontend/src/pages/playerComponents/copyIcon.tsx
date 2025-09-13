import { motion } from "motion/react";
import copyIcon from "/src/assets/copy-icon.svg";
import * as Tooltip from "@radix-ui/react-tooltip";

function CopyIcon({ textToCopy }: { textToCopy: string }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <motion.button
            className="icon-button"
            onClick={() => {
              navigator.clipboard.writeText(textToCopy);
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.img
              src={copyIcon}
              alt="copy uuid to clipboard"
              className="copy-icon"
            />
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent">
            Copy UUID
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default CopyIcon;
