"use client"
import { useState } from 'react'
import * as Babel from '@babel/standalone'
import SlideTitle from "../../../components/common/SlideTitle"
import { styles } from "../../../styles/moduleStyles"
import React from 'react'

const Slide6 = () => {
  const [code, setCode] = useState(`function Contador() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(0)}>
        Reiniciar
      </button>
    </div>
  )
}`)

  const [output, setOutput] = useState(null)

  const evaluateCode = () => {
    try {
      setOutput(null);
      // 1. Transforma solo el componente (sin el return adicional)
      const { code: transpiledCode } = Babel.transform(code, { 
        presets: ['react'],
        filename: 'component.js'
      });
  
      // 2. Crea una función que devuelva el componente renderizado
      const func = new Function('React', 'useState', `
        ${transpiledCode};
        return Contador;
      `);
  
      // 3. Obtiene el componente y luego lo renderiza
      const Component = func(React, useState);
      setOutput(React.createElement(Component));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div key="slide6">
      <SlideTitle number="6" title="MANEJO DE ESTADO CON useState" />

      {/* Explicación conceptual */}
      <div style={{ ...styles.contentBox, backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#0369a1' }}>¿Qué es el Estado en React?</h3>
        <p style={styles.paragraph}>
          El estado permite a los componentes <strong>recordar y manejar información</strong> que puede cambiar con el tiempo y afectar lo que se muestra en pantalla.
        </p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>useState</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
              <li>Hook fundamental para manejar estado</li>
              <li>Devuelve un array con 2 elementos: valor actual y función para actualizarlo</li>
              <li>Preserva el estado entre renderizados</li>
            </ul>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Sintaxis Básica</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '1rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              <span style={{ color: '#93c5fd' }}>const</span> [<span style={{ color: '#fca5a5' }}>valor</span>, <span style={{ color: '#fca5a5' }}>setValor</span>] = <span style={{ color: '#93c5fd' }}>useState</span>(<span style={{ color: '#86efac' }}>valorInicial</span>)
            </div>
          </div>
        </div>
      </div>

      {/* Editor interactivo */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#047857' }}>🛠 Editor Interactivo</h3>
        <p style={{ ...styles.paragraph, fontSize: '1rem' }}>
          Modifica el contador y experimenta con el estado:
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
              minHeight: '200px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontFamily: '"Fira Code", monospace',
              fontSize: '0.95rem',
              border: '1px solid #334155',
              borderRadius: '0.25rem',
              padding: '0.75rem',
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.5'
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
            marginTop: '1.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Actualizar Componente
        </button>
        
        {/* Resultado */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Resultado:</h4>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '0.5rem',
            border: '1px solid #d1fae5',
            minHeight: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {output || <span style={{ color: '#94a3b8' }}>El contador aparecerá aquí...</span>}
          </div>
        </div>
      </div>

      {/* Reglas importantes */}
      <div style={{ ...styles.contentBox, marginTop: '1.5rem', backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
        <h3 style={{ ...styles.contentBoxTitle, color: '#92400e' }}>📌 Reglas de useState</h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>1. No Mutar Directamente</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: '#fca5a5' }}>// Incorrecto</span>
              <br />
              count = count + 1
              <br /><br />
              <span style={{ color: '#86efac' }}>// Correcto</span>
              <br />
              setCount(count + 1)
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>2. Actualización Basada en Estado Anterior</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              setCount(<span style={{ color: '#93c5fd' }}>prevCount</span> {'=>'} prevCount + 1)
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>3. Múltiples Estados</h4>
            <div style={{ 
              backgroundColor: '#1e293b', 
              color: '#f8fafc',
              padding: '0.75rem', 
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: '#93c5fd' }}>const</span> [<span style={{ color: '#fca5a5' }}>name</span>, setName] = <span style={{ color: '#93c5fd' }}>useState</span>(<span style={{ color: '#86efac' }}>''</span>)
              <br />
              <span style={{ color: '#93c5fd' }}>const</span> [<span style={{ color: '#fca5a5' }}>age</span>, setAge] = <span style={{ color: '#93c5fd' }}>useState</span>(<span style={{ color: '#86efac' }}>0</span>)
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplo avanzado */}
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        backgroundColor: '#f5f3ff', 
        border: '2px dashed #8b5cf6',
        borderRadius: '0.5rem'
      }}>
        <h3 style={{ color: '#5b21b6', marginBottom: '1rem' }}>💡 Ejemplo Avanzado: Contador Complejo</h3>
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: '#f8fafc',
          overflowX: 'auto',
          lineHeight: '1.5',
          whiteSpace: 'pre'
        }}>
          {`function ContadorAvanzado() {
  const [count, setCount] = useState(0)
  const [paso, setPaso] = useState(1)

  const incrementar = () => setCount(prev => prev + paso)
  const decrementar = () => setCount(prev => prev - paso)
  const reiniciar = () => setCount(0)

  return (
    <div>
      <p>Valor actual: {count}</p>
      <div>
        <button onClick={decrementar}>-</button>
        <button onClick={incrementar}>+</button>
        <button onClick={reiniciar}>Reiniciar</button>
      </div>
      <div>
        <label>
          Paso: 
          <input 
            type="number" 
            value={paso}
            onChange={(e) => setPaso(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}`}
        </div>
      </div>
    </div>
  )
}

export default Slide6