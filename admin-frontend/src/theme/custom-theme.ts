// src/theme/custom-theme.ts
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const CustomTheme = definePreset(Lara, {

components: {
    button: {
      /* afecta a TODOS los severities: primary, success, danger, etc.  */
      colorScheme: {
        dark: {           // se aplica cuando tu selector .app-dark está activo
          color: '#FFFFFF'        // texto normal
          // si querés, podés añadir hoverColor / activeColor aquí
        }
      }
    } 
  },

  semantic: {
    
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#5229B3', // Main primary color (light)
      600: '#7c3aed',
      700: '#9E8BBC',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
      // DARK MODE
      dark: {
        50: '#19152b',
        100: '#221d3d',
        200: '#322f5a',
        300: '#43377a',
        400: '#8562DD',
        500: '#8d4ff7', // Main primary color (dark)
        600: '#a374ff',
        700: '#bb8aff',
        800: '#bcb4d2',
        900: '#f0eafe',
        950: '#f6f2ff'
      }
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#47A569',
      400: '#4de383',
      500: '#22c55e', // Main success color (light)
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
      dark: {
        50:  '#153022',
        100: '#17583b',
        200: '#1b8257',
        300: '#1dc97e',
        400: '#3ae49c',
        500: '#22c55e', // Corregido: Main success color (dark) ahora es verde
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16'
      }
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning color (light)
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
      dark: {
        50: '#3f3613',
        100: '#66520c',
        200: '#997a1b',
        300: '#f6d36b',
        400: '#ffbc00',
        500: '#ff9900', // Main warning color (dark)
        600: '#ffc266',
        700: '#ffe0b2',
        800: '#fff3de',
        900: '#fff9ec',
        950: '#fffdf6'
      }
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main danger color (light)
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
      dark: {
        50: '#2d181b',
        100: '#50232c',
        200: '#872d3c',
        300: '#d24148',
        400: '#ee636e',
        500: '#ff5670', // Main danger color (dark)
        600: '#ff90aa',
        700: '#ffb7cb',
        800: '#ffdce6',
        900: '#fff2f5',
        950: '#fffafd'
      }
    },
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main info color (light)
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
      dark: {
        50: '#102641',
        100: '#173562',
        200: '#235293',
        300: '#3b86d7',
        400: '#3cc7e3',
        500: '#0ea5e9', // Main info color (dark)
        600: '#2986cc',
        700: '#61b0e3',
        800: '#b6e3fa',
        900: '#e5f7fd',
        950: '#f4fbfe'
      }
    }
  },
  primitive: {
    primitive: {
      green:  { 500: '#7E22C5' },        // success
      orange: { 500: '#F97316' },        // warning
      red:    { 500: '#DC2626', 700:'#B91C1C' }, // danger
      blue:   { 500: '#0EA5E9' },        // info
      purple: { 500: '#5229B3' },        // primary
      yellow: { 500: '#F59E0B' },        // yellow
      gray:   { 500: '#6B7280' },        // gray
    }
  },
});

export default CustomTheme;
