import GamepadIcon from "../common/GamepadIcon"
import { styles } from "../../styles/moduleStyles"

const Header = ({ title }) => (
  <div style={styles.header}>
    <div style={styles.headerContent}>
      <GamepadIcon />
      <h1 style={styles.title}>{title}</h1>
      <GamepadIcon />
    </div>
    <div style={styles.gradientBar1}></div>
    <div style={styles.gradientBar2}></div>
  </div>
)

export default Header