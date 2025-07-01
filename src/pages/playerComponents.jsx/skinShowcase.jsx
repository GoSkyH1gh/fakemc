function SkinShowcase({ skin_showcase_b64, reloadAnimations }) {
  const initialAnimationState = reloadAnimations ? { scale: 0 } : { scale: 1 };
  return (
    <motion.img
      initial={initialAnimationState}
      animate={{scale: 1}}
      transition={{ duration: 0.5, type: "spring" }}
      src={'data:image/png;base64,' + skin_showcase_b64} className='skin-showcase'
      alt="skin of searched player" />
  )
}

export default SkinShowcase