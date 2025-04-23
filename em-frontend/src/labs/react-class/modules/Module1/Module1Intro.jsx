import BaseModule from "../BaseModule"
import Slide1 from "./slides/Slide1"
import Slide2 from "./slides/Slide2"
import Slide3 from "./slides/Slide3"
import Slide4 from "./slides/Slide4"
import Slide5 from "./slides/Slide5"
import Slide6 from "./slides/Slide6"

const Module1Intro = () => {
  const slides = [
    <Slide1 key="slide1" />,
    <Slide2 key="slide2" />,
    <Slide3 key="slide3" />,
    <Slide4 key="slide4" />,
    <Slide5 key="slide5" />,
    <Slide6 key="slide6" />
  ]

  return (
    <BaseModule 
      moduleTitle="MÓDULO 1: INTRODUCCIÓN"
      slides={slides}
    />
  )
}

export default Module1Intro