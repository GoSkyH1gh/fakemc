import { Link } from 'react-router-dom'
import { motion } from "motion/react"
import './homePage.css'

export function HomePage() {
  return (
    <>
      <h1>Search for any Minecraft player <br />and get all the info you need in one place</h1>
      <Link to="./player">Explore players</Link><br />
      <ShowcaseCard></ShowcaseCard>
    </>
  )
}

function AnimatedComponent() {
  return (
    <motion.div
      className='rotating-square'
      whileHover={{
        scale: 1.2
      }}
      whileTap={{
        scale: 0.9
      }}
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}>
    </motion.div>
  )
}


function ShowcaseCard() {
  return (
    <motion.div className='card-showcase'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}>
      <p></p>
    </motion.div>)
}