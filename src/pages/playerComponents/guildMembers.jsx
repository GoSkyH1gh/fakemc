import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function GuildMembers({ guild_members }) {
  let navigate = useNavigate();
  
  if (!guild_members) {
    return <p>No guild members to show</p>;
  }
  const handleGuildMemberClick = (username) => {
    console.log("searching for " + username);
    navigate(`/player/${username}`);
  };
  const guildMembersArray = guild_members.map((member) => {
    return (
      // this is a guild member element
      <motion.li
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        key={member.name}
        className="guild-list-item"
        onClick={() => handleGuildMemberClick(member.name)}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1 },
        }}
      >
        <div className="guild-member-flex-container">
          <img
            src={"data:image/png;base64," + member.skin_showcase_b64}
            className="guild-member-image"
            alt={"head of " + member.name + "'s skin"}
          />
          <div>
            <p className="list-username">{member.name}</p>
            <p className="list-uuid">Click for more info</p>
          </div>
        </div>
      </motion.li>
    );
  });
  console.log(guildMembersArray);

  return (
    <motion.ul
      className="guild-list"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            duration: 0.3,
            delayChildren: 0,
            ease: "easeInOut",
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {guildMembersArray}
    </motion.ul>
  );
}

export default GuildMembers;
