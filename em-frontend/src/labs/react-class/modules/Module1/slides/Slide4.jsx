"use client"
import React from 'react'
import { useState } from 'react'
import * as Babel from '@babel/standalone'
import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"

const Slide4 = () => {
  // Estado para el código editable
  const [code, setCode] = useState(`function Saludo() {
  return <h1>¡Hola Mundo!</h1>
}`)
  
  // Estado para el resultado
  const [output, setOutput] = useState(null)
  
  // Función para evaluar el código
  const evaluateCode = () => {
    try {
      setOutput(null)
      
      // 1. Preparamos el código para transpilación
      const cleanCode = code.trim()
      const isFunction = cleanCode.startsWith('function') || 
                         cleanCode.startsWith('const') || 
                         cleanCode.startsWith('class')
      
      // 2. Transpilamos el código JSX
      const { code: transpiledCode } = Babel.transform(
        isFunction ? cleanCode : `function Component() { return ${cleanCode} }`,
        { presets: ['react'], filename: 'component.js' }
      )
      
      // 3. Evaluamos el componente
      const func = new Function('React', `
        ${transpiledCode};
        return ${isFunction ? cleanCode.split(' ')[1].split('(')[0] : 'Component'}();
      `)
      
      const result = func(React)
      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    }
  }

  return (
    <div key="slide4">
      <SlideTitle number="4" title="COMPONENTES Y FUNCIONES EN REACT" />

      {/* Explicación de componentes */}
      <div style={{ ...styles.contentBox, backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#0369a1' }}>¿Qué es un Componente en React?</h3>
        <p style={styles.paragraph}>
          En React, un componente es una <strong>función JavaScript</strong> que retorna elementos de UI (JSX). 
          Los componentes permiten dividir la UI en piezas independientes y reutilizables.
        </p>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}>
          <pre style={{ 
            color: '#f8fafc', 
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>
            <span style={{ color: '#93c5fd' }}>function</span> <span style={{ color: '#fca5a5' }}>MiComponente</span>() {'{\n  '}
            <span style={{ color: '#93c5fd' }}>return</span> (
              <span style={{ color: '#fca5a5' }}>&lt;div&gt;</span>
                <span style={{ color: '#86efac' }}>// Tu JSX aquí</span>
              <span style={{ color: '#fca5a5' }}>&lt;/div&gt;</span>
            ){'\n}'}
          </pre>
        </div>
      </div>

      {/* Editor interactivo */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#047857' }}>🛠 Editor Interactivo</h3>
        <p style={{ ...styles.paragraph, fontSize: '1rem' }}>
          Modifica el siguiente componente funcional y ve el resultado en tiempo real:
        </p>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ 
              width: '100%',
              minHeight: '150px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              border: '1px solid #334155',
              borderRadius: '0.25rem',
              padding: '0.75rem',
              outline: 'none',
              resize: 'vertical'
            }}
            spellCheck="false"
          />
        </div>
        
        <button
          onClick={evaluateCode}
          style={{ 
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
        >
          Ejecutar Código
        </button>
        
        {/* Resultado */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Resultado:</h4>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #d1fae5',
            minHeight: '80px'
          }}>
            {output || <span style={{ color: '#94a3b8' }}>El resultado aparecerá aquí...</span>}
          </div>
        </div>
      </div>

      {/* Explicación de la sintaxis */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#c4b5fd' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#5b21b6' }}>📝 Sintaxis de Componentes Funcionales</h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {/* Parte 1 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#ede9fe', 
            borderRadius: '0.5rem'
          }}>
            <h4 style={{ color: '#5b21b6', marginBottom: '0.75rem' }}>1. Declaración de la función</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '1rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#93c5fd' }}>function</span> <span style={{ color: '#fca5a5' }}>NombreComponente</span>() {'{'}
              <span style={{ color: '#cbd5e1' }}>{'  // Cuerpo de la función'}</span>
              {'}'}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#4c1d95', marginTop: '0.5rem' }}>
              El nombre debe comenzar con <strong>mayúscula</strong> (convención de React)
            </p>
          </div>
          
          {/* Parte 2 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e0e7ff', 
            borderRadius: '0.5rem'
          }}>
            <h4 style={{ color: '#3730a3', marginBottom: '0.75rem' }}>2. Retorno de JSX</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '1rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#93c5fd' }}>return</span> (
                <span style={{ color: '#fca5a5' }}>&lt;div&gt;</span>
                  <span style={{ color: '#86efac' }}>{'// Contenido JSX'}</span>
                <span style={{ color: '#fca5a5' }}>&lt;/div&gt;</span>
              )
            </div>
            <p style={{ fontSize: '0.9rem', color: '#312e81', marginTop: '0.5rem' }}>
              El return debe tener <strong>un solo elemento padre</strong>
            </p>
          </div>
          
          {/* Parte 3 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#ecfdf5', 
            borderRadius: '0.5rem'
          }}>
            <h4 style={{ color: '#047857', marginBottom: '0.75rem' }}>3. Exportación</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '1rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#93c5fd' }}>export default</span> <span style={{ color: '#fca5a5' }}>NombreComponente</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#065f46', marginTop: '0.5rem' }}>
              Permite usar el componente en otros archivos
            </p>
          </div>
        </div>
      </div>

      {/* Ejemplo completo */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        backgroundColor: '#1e293b', 
        borderRadius: '0.5rem',
        borderLeft: '4px solid #7c3aed'
      }}>
        <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>💡 Ejemplo Completo</h3>
        <div style={{ 
          backgroundColor: '#334155', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: '#f8fafc',
          overflowX: 'auto',
          lineHeight: '1.5',
          whiteSpace: 'pre'
        }}>
          <span style={{ color: '#93c5fd' }}>import</span> React <span style={{ color: '#93c5fd' }}>from</span> <span style={{ color: '#86efac' }}>'react'</span>{'\n\n'}
          <span style={{ color: '#93c5fd' }}>function</span> <span style={{ color: '#fca5a5' }}>SaludoUsuario</span>(<span style={{ color: '#fca5a5' }}>props</span>) {'{\n'}
          {'  '}<span style={{ color: '#93c5fd' }}>const</span> <span style={{ color: '#fca5a5' }}>nombre</span> = props.nombre || <span style={{ color: '#86efac' }}>'Invitado'</span>{'\n\n'}
          {'  '}<span style={{ color: '#93c5fd' }}>return</span> (
          {'\n    '}<span style={{ color: '#fca5a5' }}>&lt;div</span> <span style={{ color: '#fca5a5' }}>className</span>=<span style={{ color: '#86efac' }}>"saludo"</span><span style={{ color: '#fca5a5' }}>&gt;</span>
          {'\n      '}<span style={{ color: '#fca5a5' }}>&lt;h1&gt;</span>¡Hola, <span style={{ color: '#fca5a5' }}>{'{'}</span>nombre<span style={{ color: '#fca5a5' }}>{'}'}</span>!<span style={{ color: '#fca5a5' }}>&lt;/h1&gt;</span>
          {'\n      '}<span style={{ color: '#fca5a5' }}>&lt;p&gt;</span>Bienvenido a nuestra aplicación.<span style={{ color: '#fca5a5' }}>&lt;/p&gt;</span>
          {'\n    '}<span style={{ color: '#fca5a5' }}>&lt;/div&gt;</span>
          {'\n  '})
          {'\n}'}{'\n\n'}
          <span style={{ color: '#93c5fd' }}>export default</span> <span style={{ color: '#fca5a5' }}>SaludoUsuario</span>
        </div>
      </div>
    </div>
  )
}

export default Slide4