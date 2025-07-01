function CapeShowcase( {cape_showcase_b64, cape_back_b64, has_cape, cape_name, reloadAnimations} ) {
  const defaultCapePath = 'data:image/png;base64,' + cape_showcase_b64;
  const hoveredCapePath = 'data:image/png;base64,' + cape_back_b64;
  const [currentImage, setCurrentImage] = useState(defaultCapePath);
  const handleMouseEnter = () => {
    setCurrentImage(hoveredCapePath);
  }

  const handleMouseLeave = () => {
    setCurrentImage(defaultCapePath);
  }

  const initialAnimationState = reloadAnimations ? {scale: 0} : {scale: 1}; 
  if (has_cape) {
    return (
      <motion.div
        className='cape-section'
        initial={ initialAnimationState }
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", delay: 0.3 }}>
        
        <img src={currentImage} className='cape-showcase' alt='cape of searched player' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
        <div>
          <p className='info-card-label cape-name-label'>Cape name</p>
          <p className='cape-name'>{cape_name}</p>
        </div>
      </motion.div>
    )
  }
  else {
    return (null)
  }
}

export default CapeShowcase