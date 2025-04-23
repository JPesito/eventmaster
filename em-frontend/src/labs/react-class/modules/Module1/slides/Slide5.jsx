"use client"
import { useState } from 'react'
import * as Babel from '@babel/standalone'
import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"
import React from 'react'

const Slide5 = () => {
  const [parentCode, setParentCode] = useState(`function App() {
  return (
    <div>
      <SaludoUsuario nombre="Ana" />
      <SaludoUsuario />
    </div>
  )
}`)

  const [childCode, setChildCode] = useState(`function SaludoUsuario(props) {
  const nombre = props.nombre || 'Invitado'
  
  return (
    <div className="saludo">
      <h1>¡Hola, {nombre}!</h1>
      <p>Bienvenido a nuestra aplicación.</p>
    </div>
  )
}`)

  const [output, setOutput] = useState(null)

  const evaluateCode = () => {
    try {
      setOutput(null)
      
      // Transpilamos ambos códigos
      const transpiledParent = Babel.transform(parentCode, { presets: ['react'] }).code
      const transpiledChild = Babel.transform(childCode, { presets: ['react'] }).code
      
      // Evaluamos el código
      const func = new Function('React', `
        ${transpiledChild};
        ${transpiledParent};
        return App();
      `)
      
      const result = func(React)
      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    }
  }

  return (
    <div key="slide5">
      <SlideTitle number="5" title="PASO DE PROPS: PADRE A HIJO" />

      {/* Explicación conceptual */}
      <div style={{ ...styles.contentBox, backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#0369a1' }}>Comunicación entre Componentes</h3>
        <p style={styles.paragraph}>
          En React, los <strong>props</strong> son el mecanismo para pasar datos de un componente padre a un componente hijo.
        </p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>Componente Padre</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              <li>Define los datos a pasar</li>
              <li>Envía props como atributos</li>
              <li>Puede pasar cualquier tipo de dato</li>
            </ul>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Componente Hijo</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              <li>Recibe props como parámetro</li>
              <li>Puede asignar valores por defecto</li>
              <li>Usa los datos para renderizar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Editor interactivo */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#047857' }}>🛠 Ejemplo Interactivo</h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {/* Editor Padre */}
          <div>
            <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Componente Padre (App.jsx)</h4>
            <textarea
              value={parentCode}
              onChange={(e) => setParentCode(e.target.value)}
              style={{ 
                width: '100%',
                minHeight: '200px',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.9rem',
                border: '1px solid #334155',
                borderRadius: '0.25rem',
                padding: '0.75rem',
                outline: 'none',
                resize: 'vertical'
              }}
              spellCheck="false"
            />
          </div>
          
          {/* Editor Hijo */}
          <div>
            <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Componente Hijo (SaludoUsuario.jsx)</h4>
            <textarea
              value={childCode}
              onChange={(e) => setChildCode(e.target.value)}
              style={{ 
                width: '100%',
                minHeight: '200px',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.9rem',
                border: '1px solid #334155',
                borderRadius: '0.25rem',
                padding: '0.75rem',
                outline: 'none',
                resize: 'vertical'
              }}
              spellCheck="false"
            />
          </div>
        </div>
        
        <button
          onClick={evaluateCode}
          style={{ 
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            marginTop: '1.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Ejecutar Código
        </button>
        
        {/* Resultado */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Resultado:</h4>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '0.5rem',
            border: '1px solid #d1fae5',
            minHeight: '100px'
          }}>
            {output || <span style={{ color: '#94a3b8' }}>El resultado aparecerá aquí...</span>}
          </div>
        </div>
      </div>

      {/* Tipos de Props */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#c4b5fd' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#5b21b6' }}>📦 Tipos de Datos que Pueden Pasarse como Props</h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>Strings</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              nombre="Ana"
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>Números</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              edad={25}
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>Booleanos</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              activo={true}
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.5rem' }}>Funciones</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              onClick={() => alert('Hola')}
            </div>
          </div>
        </div>
      </div>

      {/* Buenas prácticas */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        backgroundColor: '#fffbeb', 
        border: '2px dashed #f59e0b',
        borderRadius: '0.5rem'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>🌟 Buenas Prácticas con Props</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>1. Nombres Descriptivos</h4>
            <p style={{ fontSize: '0.9rem' }}>Usa nombres que describan claramente el propósito del prop.</p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>2. Valores por Defecto</h4>
            <p style={{ fontSize: '0.9rem' }}>Proporciona valores por defecto para props opcionales.</p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>3. Destructuring</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre'
            }}>
              {`function Componente({ nombre, edad }) {
                return <div>{nombre} - {edad} años</div>
                }`}
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>4. PropTypes</h4>
            <p style={{ fontSize: '0.9rem' }}>Usa PropTypes para validar los tipos de props.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide5