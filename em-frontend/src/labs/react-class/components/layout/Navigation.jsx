import ArrowLeft from "../common/ArrowLeft"
import ArrowRight from "../common/ArrowRight"
import { styles } from "../../styles/moduleStyles"

const Navigation = ({ currentSlide, totalSlides, prevSlide, nextSlide }) => {
  return (
    <>
      <button
        style={{
          ...styles.navButton,
          ...styles.navButtonLeft,
          opacity: currentSlide === 0 ? 0.5 : 1,
        }}
        onClick={prevSlide}
        disabled={currentSlide === 0}
      >
        <ArrowLeft />
      </button>

      <button
        style={{
          ...styles.navButton,
          ...styles.navButtonRight,
          opacity: currentSlide === totalSlides - 1 ? 0.5 : 1,
        }}
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
      >
        <ArrowRight />
      </button>
    </>
  )
}

export default Navigation