import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Navigation from "../components/layout/Navigation"
import SlideContainer from "../components/layout/SlideContainer"
import { styles } from "../styles/moduleStyles"

const BaseModule = ({ moduleTitle, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = slides.length

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <Navigation 
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
        />

        <Header title={moduleTitle} />

        <SlideContainer currentSlide={currentSlide} slides={slides} />

        <Footer 
          currentSlide={currentSlide} 
          totalSlides={totalSlides}
          setCurrentSlide={setCurrentSlide}
        />
      </div>
    </div>
  )
}

export default BaseModule