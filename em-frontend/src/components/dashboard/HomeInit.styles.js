import { styled, keyframes } from '@mui/material/styles';

// Animación de cambio de colores
const colorChange = keyframes`
  0% { color: #99C9E5; }
  25% { color: #669CCD; }
  50% { color: #009FE3; }
  75% { color: #336FB5; }
  100% { color: #99C9E5; }
`;

// Texto animado para EVENT
export const AnimatedEvent = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '4rem',
  animation: `${colorChange} 20s ease-in-out infinite`,
  paddingRight: '8.2rem',
}));

// Texto fijo para MASTER
export const StyledMaster = styled('span')(({ theme }) => ({
  display: 'block',
  fontWeight: 'bold',
  fontSize: '4rem',
  marginTop: theme.spacing(-1),
  marginLeft: '8.2rem',
}));

// Hero section estilizada
export const StyledHero = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0, 12),
  color: '#fff',
  position: 'relative',
  zIndex: 1,
}));
