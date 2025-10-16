import * as Dialog from "@radix-ui/react-dialog";
import helpIcon from "/src/assets/help-icon.svg";
import { motion, stagger } from "motion/react";

function DistributionHelpDialog() {
  const animationVariants = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="icon-button">
          <img src={helpIcon} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay HelpOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title>Understanding this chart</Dialog.Title>
          <Dialog.Description />
          <div>
            This chart shows how players are distributed across several value
            ranges.
            <motion.ul
              className="ul"
              variants={animationVariants}
              initial={"initial"}
              animate={"animate"}
              transition={{
                delayChildren: stagger(100, {
                  startDelay: 50,
                  ease: "easeInOut",
                }),
              }}
            >
              <motion.li>
                Each bar represents a range of values — taller bars mean more
                players in that range.
              </motion.li>
              <motion.li>
                The highlighted bar marks where your current value falls.
              </motion.li>
              <motion.li>
                The summary below compares your position with all recorded
                players (shown as a percentile).
              </motion.li>
            </motion.ul>
            This layout is used for various stats throughout the app, so you can
            quickly see how your performance stacks up.
          </div>
          <Dialog.Close>Great!</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default DistributionHelpDialog;
