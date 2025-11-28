import { Dialog } from "radix-ui";
import { UserCapeData } from "../../client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";

type CapeGalleryProps = {
  capeData: UserCapeData[] | null | "not found" | "error";
  capeStatus: null | "loading" | "loaded";
};

function CapeGallery({ capeData, capeStatus }: CapeGalleryProps) {
  let capeElements;
  if (capeData === null) {
    capeElements = <p>There's nothing to show here</p>;
  } else if (capeData === "not found") {
    capeElements = <p>No capes were found for this player</p>;
  } else if (capeData === "error") {
    capeElements = <p>Something went wrong while fetching capes</p>;
  } else {
    capeElements = capeData.map((cape) => <CapeElement cape={cape} />);
  }

  if (capeStatus === "loading") {
    <p>Loading capes...</p>;
  }

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
          className="skin-button fill-button tooltip"
          data-tooltip="View Cape Gallery"
        >
          <Icon icon={"material-symbols:grid-view-outline-rounded"} />
        </motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent cape-gallery">
          <Dialog.Title className="gallery-title">
            <span className="gallery-title-text">Cape Gallery</span>
            <span className="credit-pill">
              Data from {" "}
              <a href="https://capes.me/" target="_blank">
                capes.me
              </a>
            </span>
          </Dialog.Title>
          <Dialog.Description />
          <p></p>
          <div className="cape-gallery-container">{capeElements}</div>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CapeElement({ cape }: { cape: UserCapeData }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="cape-gallery-element">
      <img
        src={`data:image/png;base64,${
          isHovered ? cape.images.back_b64 : cape.images.front_b64
        }`}
        alt={cape.name}
        className="cape-gallery-cape"
        key={cape.name}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      ></img>
      <p className="cape-label">
        {cape.name}
        {cape.removed ? (
          <>
            <br />
            [REMOVED]
          </>
        ) : (
          ""
        )}
      </p>
    </div>
  );
}

export default CapeGallery;
