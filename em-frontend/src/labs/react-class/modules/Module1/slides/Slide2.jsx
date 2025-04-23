import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"

const Slide2 = () => {
  return (
    <div key="slide2">
      <SlideTitle number="2" title="INTRODUCCIÓN A REACT" />

      {/* Sección: ¿Qué es React? */}
      <div style={{ ...styles.contentBox, backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#0369a1' }}>¿Qué es React?</h3>
        <p style={styles.paragraph}>
          React es una <strong>biblioteca de JavaScript</strong> para construir interfaces de usuario interactivas. 
          Desarrollada por Facebook en 2013, se ha convertido en una de las herramientas más populares 
          para el desarrollo frontend moderno.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png" 
            alt="React Logo" 
            style={{ width: '80px', marginRight: '1.5rem' }}
          />
          <ul style={{ ...styles.contentList, flex: 1 }}>
            <li><strong>No es un framework</strong> - Es una biblioteca flexible que se enfoca en la UI</li>
            <li><strong>Basado en componentes</strong> - Permite crear elementos reutilizables</li>
            <li><strong>Declarativo</strong> - Describe cómo debe verse la interfaz</li>
          </ul>
        </div>
      </div>

      {/* Sección: Características principales */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#c4b5fd' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#5b21b6' }}>Características Principales</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {/* Virtual DOM */}
          <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>Virtual DOM</h4>
            <p style={{ fontSize: '1rem' }}>
              React crea una representación virtual del DOM en memoria, permitiendo actualizaciones eficientes 
              solo de las partes que cambian.
            </p>
          </div>
          
          {/* JSX */}
          <div style={{ padding: '1rem', backgroundColor: '#e0e7ff', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#3730a3', marginBottom: '0.5rem' }}>JSX</h4>
            <p style={{ fontSize: '1rem' }}>
              Sintaxis que permite escribir HTML en JavaScript, haciendo los componentes más legibles y fáciles de escribir.
            </p>
          </div>
          
          {/* Componentes */}
          <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Componentes</h4>
            <p style={{ fontSize: '1rem' }}>
              Arquitectura basada en componentes reutilizables que encapsulan estructura, estilo y comportamiento.
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Ventajas de usar React */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#047857' }}>Ventajas de React</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ 
            flex: '1 1 200px', 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>🚀 Alto Rendimiento</h4>
            <p style={{ fontSize: '0.95rem' }}>Gracias al Virtual DOM y algoritmos de reconciliación eficientes.</p>
          </div>
          
          <div style={{ 
            flex: '1 1 200px', 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>♻️ Reutilización</h4>
            <p style={{ fontSize: '0.95rem' }}>Componentes reutilizables que reducen la duplicación de código.</p>
          </div>
          
          <div style={{ 
            flex: '1 1 200px', 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>🌎 Gran Comunidad</h4>
            <p style={{ fontSize: '0.95rem' }}>Ecosistema enorme con miles de librerías y recursos disponibles.</p>
          </div>
          
          <div style={{ 
            flex: '1 1 200px', 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            borderLeft: '4px solid #ec4899'
          }}>
            <h4 style={{ color: '#9d174d', marginBottom: '0.5rem' }}>📱 Multiplataforma</h4>
            <p style={{ fontSize: '0.95rem' }}>React Native permite desarrollar apps móviles con el mismo conocimiento.</p>
          </div>
        </div>
      </div>

      {/* Sección: Casos de uso */}
      <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#fffbeb', border: '2px dashed #fbbf24', borderRadius: '0.5rem' }}>
        <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>¿Dónde se usa React?</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <img 
            src="https://logos-download.com/wp-content/uploads/2016/09/Facebook_logo.png" 
            alt="Facebook" 
            style={{ height: '40px' }}
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" 
            alt="Instagram" 
            style={{ height: '40px' }}
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png" 
            alt="Airbnb" 
            style={{ height: '40px' }}
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" 
            alt="Netflix" 
            style={{ height: '40px' }}
          />
          <p style={{ flex: 1, minWidth: '200px', fontSize: '1rem' }}>
            Grandes empresas usan React en sus productos principales por su escalabilidad y rendimiento.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide2