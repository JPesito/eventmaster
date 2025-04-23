import { styles } from "../../styles/moduleStyles"

const SlideTitle = ({ number, title }) => {
  return (
    <div style={styles.slideTitle}>
      <div style={styles.slideTitleNumber}>{number}</div>
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
  )
}

export default SlideTitle