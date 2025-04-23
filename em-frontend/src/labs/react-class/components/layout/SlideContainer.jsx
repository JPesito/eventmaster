import { styles } from "../../styles/moduleStyles"

const SlideContainer = ({ currentSlide, slides }) => {
  return (
    <div style={styles.slideContainer}>
      <div style={styles.windowsHeader}>
        <span>Presentación del Módulo</span>
        <div style={styles.windowsButtons}>
          <div style={{ ...styles.windowsButton, backgroundColor: "#f472b6" }}></div>
          <div style={{ ...styles.windowsButton, backgroundColor: "#fbbf24" }}></div>
          <div style={{ ...styles.windowsButton, backgroundColor: "#34d399" }}></div>
        </div>
      </div>

      <div style={styles.windowsContent}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              ...(currentSlide === index ? styles.activeSlide : {}),
            }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SlideContainer