import { Link } from 'react-router-dom'
import { motion } from "motion/react"
import './homePage.css'
import MojangDataDisplay from './playerComponents/mojangDataDisplay'
import InfoCard from './playerComponents/infoCard'
import GuildMembers from './playerComponents/guildMembers'

export function HomePage() {
  return (
    <>
      <h1>Search for any Minecraft player <br />and get all the info you need in one place</h1>
      <div className='align-center'><Link to="./player" className='main-explore-button'>Explore players</Link><br /></div>
      <div className='showcases-container'>
        <div className='mojang-data-showcase'>
          <MojangDataDisplay mojang_response={sampleMojangResponse} reloadAnimations={true} />
          <div>
            <h3>Get all the core data about a player fast</h3>
            <p>You can copy UUIDs with a single click, with extra cape features, <br />such as seeing both the front and back (by hovering) and the name of the cape
            </p>
          </div>
        </div>
        <div className='info-card-showcase'>
          <div>
            <h3>Get insights at a glance</h3>
            <p>Thoughtful info card help you get the info you need in seconds<br/>The most relevant Hypixel data has never been easier to see</p>
          </div>
          <motion.div className='info-card-container'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0}}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 1}}>
            <motion.ul
              className='info-card-list'
              variants={{ hidden: { opacity: 0 }, show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  duration: 0.5,
                  ease: "easeInOut",
                  delayChildren: 1.2
                }
                }
              }}
              initial="hidden"
              animate="show">
              <InfoCard label="Status" value="Offline"/>
              <InfoCard label="First seen on" value={sampleHypixelresponse.first_login}/>
              <InfoCard label="Rank" value={sampleHypixelresponse.player_rank}/>
              <InfoCard label="Guild" value={sampleHypixelresponse.guild_name || "No guild"}/>
            </motion.ul>
          </motion.div>
        </div>
        <motion.div className='guild-members-showcase'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0}}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 2.2}}>
          <div>
            <h3>See guild members of the player you searched for</h3>
            <p>You can keep exploring by just clicking on players (this works on the actual search UI)</p>
          </div>
          <div className='guild-members-container'>
            <GuildMembers guild_members={sampleHypixelresponse.guild_members}/>
          </div>
        </motion.div>
        <div className='final-button'>
          <h2>Try it out!</h2>
          <motion.div
            className='align-center'
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 3 }}><Link to="./player" className='main-explore-button'>Explore players</Link><br /></motion.div>
        </div>
      </div>
      <footer>Not associated with Mojang, Hypixel or Wynncraft.</footer>
    </>
  )
}




const sampleMojangResponse = {
  "status": "success",
  "source": "cache",
  "uuid": "5f8eb73b25be4c5aa50fd27d65e30ca0",
  "username": "Grian",
  "has_cape": true,
  "cape_name": "Pan",
  "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAo0lEQVR4nGNM9ZP7r6GmxPCfjYNBUpSJ4fnrfwyMv34w3Lh1jwEEWJAlQQCiiIMBJs4EIkA6QDpBGAZgmphABMi4KN8QsARIEYgNM5EJJDB70yMGHnF5hptXrjGkpRSD2dGF2yDueXZ8zn8pyxSG/y/2wo0HAUYJZ4Znx+cwMP5/sfc/igwaYLl04iiDqLgU2FheLoi9n7/9Y/jy8iHD65fPGABhOUeI1j52eQAAAABJRU5ErkJggg==",
  "cape_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAABQElEQVR4nF1RQU7DMBCcmsY4gQJNVMEpF4QEFPWO4AU9c+INfIF38BXe0AMH4AEgRKmAtKhpE9dRU7SbOpI70mbtmd1Zx248foxWAJCMx5hlGQdhNwg4ojDkfZM+SqmaINEiCkPWtNYQuiiYJOLk4RyXh31cRX1eK6VYoxqhPI83wf1BNWJkIH6NwynPq0YTWhGQJkDjqcDX4KfmMutoR5flWpA+5/3rmDmL2lEIwBx1gEkO0D1Mcqhu7I7+S1N0SkC1fRaKRMBr+9DUtB7NhcVigWY3rgWYEktybPv4HA6x02pBUNHN6TEXkUCxJQVnPclx2zvDPE0h7Bl7d98sUCyjiDNx9c9MZzO8TjNc7AWOYEGaNqY64/PbO7zt2tzBINXu9bysqqUx1atIKZ0Gx8YW0ahNsA0JmyI1kauSkrV/ALOUlG/DKYEAAAAASUVORK5CYII=",
  "cape_back_b64": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAXUlEQVR4nGOs27j9PwMRgAVd4MfXL3A2BzcPpkJkBXhN/PntG4YkB5KJTMSYBleIC/xAMgCvQmTAhMt96OKkmUiMO5nwqkICTMQEDUgNQRNhHmLC5WMMq4lSRYpCABZmJemPlziHAAAAAElFTkSuQmCC"
}

const sampleHypixelresponse = {
  "status": "success",
  "source": "cache",
  "first_login": "07/2013",
  "player_rank": "YouTube",
  "guild_id": "58e5947d0cf28a503e76f7fd",
  "guild_members": [
    {
      "uuid": "c9cf0c2e904c451986b12630828315c1",
      "name": "InTheLittleWood",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAcklEQVR4nGP8syvkPwMewMQsJ8QAwu/vvIYLIrOZQMTfR+8YRJzU4YIwNkghC0gSZAJX4RYUo7/1+zDI1hxlYAHz1GcyuMUwMCxjbQVzo35XM/xW+s3wtkSOgfH/6cX4HYli7PrrYIwMIFZAAVegJoYRALh5J6y8DZQWAAAAAElFTkSuQmCC"
    },
    {
      "uuid": "60ab22bc6d2b4f73af6873c12990a5a0",
      "name": "MiniMuka",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAKklEQVR4nGP8/4DhPwMewIRPEq8CNXUcCmASt24iKYAJwmhkwEg7R8IAAKN+CLLUQEuuAAAAAElFTkSuQmCC"
    },
    {
      "uuid": "5f8eb73b25be4c5aa50fd27d65e30ca0",
      "name": "Grian",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAo0lEQVR4nGNM9ZP7r6GmxPCfjYNBUpSJ4fnrfwyMv34w3Lh1jwEEWJAlQQCiiIMBJs4EIkA6QDpBGAZgmphABMi4KN8QsARIEYgNM5EJJDB70yMGHnF5hptXrjGkpRSD2dGF2yDueXZ8zn8pyxSG/y/2wo0HAUYJZ4Znx+cwMP5/sfc/igwaYLl04iiDqLgU2FheLoi9n7/9Y/jy8iHD65fPGABhOUeI1j52eQAAAABJRU5ErkJggg=="
    },
    {
      "uuid": "b24a0b59bceb42e2946043e241d5ca7d",
      "name": "NettyPlays",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAcElEQVR4nGMsKO/872RvyIAN7Dt4noFx07Zd/0EcLQ1uFMlrN76CaSYQMbcih6E4IBEuCWKDxMDAX0/tPwj0RXr/v3PvKBjD+CA5sAn9UT4MB6/ehpuAzGcBETDO7ekbwDSyYsZJMzeCHYkLgK3ABwDA0jitryvC6gAAAABJRU5ErkJggg=="
    },
    {
      "uuid": "f3eac996124a46c7ba34f64b9540e394",
      "name": "Sparkle5",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAYUlEQVR4nGOMN2f4z8PBwPDuCwMYgNhCPAwMv/5AxFhgDBj48gOC2VggfMaXF5//R0gzMBQkSSJzMRWgK2SCCUgYIHSC2BPmPcdvAgxAnYJqAgi8uAA1IdKY4T/MOGzuAACnuyZ39EfAzQAAAABJRU5ErkJggg=="
    },
    {
      "uuid": "f71567a001ea4993bad55be5e3942893",
      "name": "cadaea",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAj0lEQVR4nGO8yyD6nwEPYPmqjk+agYHhhr/4fxBgYGD4/y1HE4xhfJAcyzdpRgZubm6wYkYFJgjNyMjAxcXFAJJjeSfyn+HdUhUUU3+s1wPTR86/ZGDh0GBnYNRgZhA0vomi6P1ZdQaO7+wMTF/4GRiYFFkYPr7TBku8/sbPcPmbGFgMJMe4YLMMHm/+ZwAARn8xO1TFjGMAAAAASUVORK5CYII="
    },
    {
      "uuid": "e8f304436708490c888add349093b358",
      "name": "Tomohawk_1989",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAATklEQVR4nGP8dnrmfwY8gAmfJJICkCHIBv2CYqiCvxrRDP4JpXBp/4Qqhr8aCahW7L76Ga4AxObh4QGzGUly5L8vL8EYGbCgqOYRxzACABHYGwzV5xx2AAAAAElFTkSuQmCC"
    },
    {
      "uuid": "d81a4f1608e74bbe8eedb788d5a57104",
      "name": "sarahsera",
      "skin_showcase_b64": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA6klEQVR4nGP4fPju/693//4HAWUhrf/64p5gNkgMJMeweeXL/5xsPGAOSBAmAVIIohl3tZ//f/fPGwa/yw0M3Aq/GdgN3zL8PC/McEpwJsNPJSkGxn7b+P98PAkMILDzaR+DFBcfgzwrC4OV1F+G+6//MbA8/P2HYfOpLLCCKrNpYLrtVBbDw99GDPKsrAwsx+7cZ/jDrcrA8ucTg76qLIOk6FuGtoviDOuffWYQ//aGgcVKRZGhsy2MQef6GQZdzasMrPK8DExCtgz3PRwZiqLnMjA9+/YJbOwVTRMw/fvhZzB7YsJCBpAcAN+JdRttW/8NAAAAAElFTkSuQmCC"
    }
  ],
  "guild_name": "Lords Of Bant"
}
