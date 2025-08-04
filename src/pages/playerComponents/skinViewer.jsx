import ReactSkinview3d from "react-skinview3d";

function SkinView({ skinUrl, capeUrl }) {
  return (
    <ReactSkinview3d
      skinUrl={skinUrl}
      capeUrl={capeUrl}
      height='300'
      width='300'
      options={{ zoom: "0.95" }}
      />
  )
}

export default SkinView;