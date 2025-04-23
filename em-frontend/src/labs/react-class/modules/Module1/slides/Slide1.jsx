import { useState } from "react"
import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"

const Slide1 = () => {
  const [nombre, setNombre] = useState("Estudiante")

  return (
    <div key="slide1">
      <SlideTitle number="1" title="BIENVENIDO AL CURSO" />

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
          alt="React Logo"
          style={{ width: "120px", height: "120px", margin: "0 auto" }}
        />
      </div>

      <p style={{ textAlign: "center", fontSize: "1.2rem", margin: "1rem 0" }}>
        En este módulo aprenderás los fundamentos básicos de desarrollo web.
      </p>

      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          padding: "1rem",
          border: "2px solid #f472b6",
          borderRadius: "0.5rem",
          background: "linear-gradient(to right, #f5f3ff, #fce7f3)",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", color: "#7e22ce", marginBottom: "0.5rem" }}>¡BIENVENIDO, {nombre}!</h3>
        <input
          type="text"
          style={{ ...styles.input, padding: "0.5rem", fontSize: "1rem", maxWidth: "250px" }}
          placeholder="Escribe tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Slide1