import { styles } from "../../styles/moduleStyles"

const Footer = ({ currentSlide, totalSlides, setCurrentSlide }) => {
  return (
    <div style={styles.footer}>
      <div style={styles.footerLeft}>
        <div style={{ ...styles.colorBlock, backgroundColor: "#8b5cf6" }}></div>
        <div style={{ ...styles.colorBlock, backgroundColor: "#ec4899" }}></div>
        <div style={{ ...styles.colorBlock, backgroundColor: "#6366f1" }}></div>
        <div style={styles.footerText}>MÓDULO 1</div>
      </div>
      <div style={styles.progressBar}>
        {[...Array(totalSlides)].map((_, index) => (
          <div
            key={index}
            style={{
              ...styles.progressDot,
              ...(index === currentSlide ? styles.activeDot : {}),
              transform: index === currentSlide ? "scale(1.2)" : "scale(1)",
            }}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
      <div style={styles.footerRight}>
        <div style={styles.footerText}>
          DIAPOSITIVA {currentSlide + 1}/{totalSlides}
        </div>
        <div style={{ ...styles.colorBlockRight, backgroundColor: "#6366f1" }}></div>
        <div style={{ ...styles.colorBlockRight, backgroundColor: "#ec4899" }}></div>
        <div style={{ ...styles.colorBlockRight, backgroundColor: "#8b5cf6" }}></div>
      </div>
    </div>
  )
}

export default Footer