import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"

const Slide3 = () => {
  return (
    <div key="slide3">
      <SlideTitle number="3" title="CONFIGURANDO REACT CON VITE" />

      {/* Requisitos previos */}
      <div style={{ ...styles.contentBox, backgroundColor: '#eff6ff', borderColor: '#93c5fd' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#1e40af' }}>🔧 Requisitos Previos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Node.js</h4>
            <p style={{ fontSize: '0.95rem' }}>Versión 16+ recomendada</p>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.5rem', 
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ node -v
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>npm/pnpm/yarn</h4>
            <p style={{ fontSize: '0.95rem' }}>Gestor de paquetes actualizado</p>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.5rem', 
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ npm -v
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Editor de Código</h4>
            <p style={{ fontSize: '0.95rem' }}>VS Code recomendado</p>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.5rem', 
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ code --version
            </div>
          </div>
        </div>
      </div>

      {/* Creación de proyecto con Vite */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#047857' }}>⚡ Crear Proyecto con Vite</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: '#065f46', 
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Crear nuevo proyecto</h4>
              <div style={{ 
                backgroundColor: '#1e293b', 
                color: '#f8fafc',
                padding: '0.75rem', 
                borderRadius: '0.25rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto'
              }}>
                $ npm create vite@latest
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#4b5563' }}>
                O usando yarn/pnpm según tu gestor de paquetes
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: '#065f46', 
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Seleccionar opciones</h4>
              <div style={{ 
                backgroundColor: '#1e293b', 
                color: '#f8fafc',
                padding: '0.75rem', 
                borderRadius: '0.25rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto'
              }}>
                ✔ Project name: › mi-proyecto<br />
                ✔ Select a framework: › React<br />
                ✔ Select a variant: › JavaScript
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ 
              backgroundColor: '#065f46', 
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Instalar dependencias y ejecutar</h4>
              <div style={{ 
                backgroundColor: '#1e293b', 
                color: '#f8fafc',
                padding: '0.75rem', 
                borderRadius: '0.25rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto'
              }}>
                $ cd mi-proyecto<br />
                $ npm install<br />
                $ npm run dev
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estructura del proyecto con Vite */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#c4b5fd' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#5b21b6' }}>📂 Estructura del Proyecto Vite</h3>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          color: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          lineHeight: '1.75'
        }}>
          <div style={{ color: '#fbbf24' }}>mi-proyecto/</div>
          <div style={{ marginLeft: '1rem' }}>
            <div>├── <span style={{ color: '#a5b4fc' }}>node_modules/</span> <span style={{ color: '#94a3b8' }}># Dependencias</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>public/</span> <span style={{ color: '#94a3b8' }}># Assets estáticos</span></div>
            <div>│   └── <span style={{ color: '#fca5a5' }}>vite.svg</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>src/</span> <span style={{ color: '#94a3b8' }}># Código fuente</span></div>
            <div>│   ├── <span style={{ color: '#fca5a5' }}>assets/</span></div>
            <div>│   ├── <span style={{ color: '#fca5a5' }}>App.css</span></div>
            <div>│   ├── <span style={{ color: '#fca5a5' }}>App.jsx</span></div>
            <div>│   ├── <span style={{ color: '#fca5a5' }}>index.css</span></div>
            <div>│   └── <span style={{ color: '#fca5a5' }}>main.jsx</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>.gitignore</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>index.html</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>package.json</span></div>
            <div>├── <span style={{ color: '#a5b4fc' }}>vite.config.js</span></div>
            <div>└── <span style={{ color: '#94a3b8' }}>...</span></div>
          </div>
        </div>
      </div>

      {/* Limpieza inicial recomendada */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#92400e' }}>🧹 Limpieza Inicial Recomendada</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Archivos a eliminar</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
              <li>src/assets/react.svg</li>
              <li>src/App.css</li>
              <li>src/index.css</li>
            </ul>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Simplificar App.jsx</h4>
            <div style={{ 
              backgroundColor: '#334155', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              overflowX: 'auto'
            }}>
              <span style={{ color: '#cbd5e1' }}>function</span> <span style={{ color: '#fca5a5' }}>App</span>() {'{\n  '}
              <span style={{ color: '#cbd5e1' }}>return</span> (
                <span style={{ color: '#fca5a5' }}>&lt;div&gt;</span>
                <span style={{ color: '#94a3b8' }}>{'/* Tu código aquí */'}</span>
                <span style={{ color: '#fca5a5' }}>&lt;/div&gt;</span>
              ){'\n}'}
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Limpiar main.jsx</h4>
            <div style={{ 
              backgroundColor: '#334155', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              overflowX: 'auto'
            }}>
              <span style={{ color: '#93c5fd' }}>import</span> React <span style={{ color: '#93c5fd' }}>from</span> <span style={{ color: '#86efac' }}>'react'</span>{'\n'}
              <span style={{ color: '#93c5fd' }}>import</span> ReactDOM <span style={{ color: '#93c5fd' }}>from</span> <span style={{ color: '#86efac' }}>'react-dom/client'</span>{'\n'}
              <span style={{ color: '#93c5fd' }}>import</span> App <span style={{ color: '#93c5fd' }}>from</span> <span style={{ color: '#86efac' }}>'./App'</span>{'\n\n'}
              ReactDOM.createRoot(document.getElementById(<span style={{ color: '#86efac' }}>'root'</span>)).render(
                <span style={{ color: '#fca5a5' }}>&lt;React.StrictMode&gt;</span>
                  <span style={{ color: '#fca5a5' }}>&lt;App /&gt;</span>
                <span style={{ color: '#fca5a5' }}>&lt;/React.StrictMode&gt;</span>
              )
            </div>
          </div>
        </div>
      </div>

      {/* Comandos útiles */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        backgroundColor: '#1e293b', 
        borderRadius: '0.5rem',
        borderLeft: '4px solid #7c3aed'
      }}>
        <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>💻 Comandos Útiles de Vite</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem' }}>Desarrollo</h4>
            <div style={{ 
              backgroundColor: '#475569', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ npm run dev
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              Inicia servidor de desarrollo en <code style={{ color: '#fca5a5' }}>localhost:5173</code>
            </p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem' }}>Producción</h4>
            <div style={{ 
              backgroundColor: '#475569', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ npm run build<br />
              $ npm run preview
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              Construye y previsualiza la versión para producción
            </p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#334155', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem' }}>Instalar dependencias</h4>
            <div style={{ 
              backgroundColor: '#475569', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              $ npm add react-icons<br />
              $ npm add axios
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              Ejemplos de librerías comunes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide3