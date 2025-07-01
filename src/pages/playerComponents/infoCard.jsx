import { motion } from "motion/react"

function InfoCard({ label, value }) {
  return (
    <motion.li
      className='info-card'
      variants={{
        hidden: { opacity: 0, y: 20 }, // Example: fade in and slide up
        show: { opacity: 1, y: 0 }
      }}>
      <span className='info-card-label'>{label}</span><br />
      <span className='info-card-value'>{value}</span>
    </motion.li>
  )
}

export default InfoCard