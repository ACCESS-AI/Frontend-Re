import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: { heading: 'DM Sans', body: 'DM Sans', monospace: 'Courier Prime, monospace', file: 'Manrope, sans-serif' },
  semanticTokens: {
    colors: {
      bg: { default: 'linear-gradient(180deg,#f8f7f8,#f5f3f7)', _dark: 'linear-gradient(180deg,#f8f7f8,#f5f3f7)' },
      base: { default: 'white', _dark: 'blackAlpha.900' },
      contra: { default: 'blackAlpha.900', _dark: 'whiteAlpha.900' },
      tone: { default: '#a09dab26' },
      mid: { default: '#d6c9ff73', _dark: 'blackAlpha.600' }
    }
  },
  layerStyles: {
    card: {
      p: 2, bg: 'base', borderWidth: 1, boxShadow: 'lg', rounded: '2xl',
      _hover: { boxShadow: 'hover', textDecoration: 'none' }
    },
    form: { py: 4, px: 12, bg: 'base', borderWidth: 1, boxShadow: 'lg', rounded: '3xl', alignSelf: 'center', gap: 6 },
    feature: { p: 4, bg: 'base', borderWidth: 1, boxShadow: 'lg', rounded: '2xl' },
    segment: { p: 4, bg: 'base', boxShadow: 'segment', rounded: '2xl' },
    float: { p: 1, bg: 'base', boxShadow: 'segment', rounded: 'lg', h: 12 },
    container: { p: 4, w: 'full', maxW: 'container.xl', m: 'auto' },
    tab: { boxSize: 'full', display: 'flex', flexDir: 'column-reverse', pos: 'absolute', overflow: 'auto', gap: 2 },
    drop: {
      p: 1, w: 'fit-content', bg: 'transparent', rounded: '2xl', color: 'gray.200', pos: 'relative', cursor: 'pointer',
      borderStyle: 'dashed', borderWidth: 2, _hover: { color: 'purple.200' }
    }
  },
  colors: {
    orange: {
      200: '#ffb460'
    },
    gray: {
      10: '#f1f1f1',
      15: '#f3f3f3',
      100: '#f5f3f7',
      150: '#fcfcfc',
      175: '#fafafa',
      200: '#e9edf2',
      250: '#d7d9e2',
      450: '#1F1E1E',
      550: '#1F1E1E'
    },
    yellow: {
      400: '#fdd983'
    },
    green: {
      300: '#51e7b0',
      500: '#3dcb99',
      600: '#21ad7c',
      750: '#019b03'
    },
    purple: {
      75: '#ece8ff',
      100: '#ded8fd',
      200: '#d2c7ff',
      500: '#9576ff',
      600: '#8147ff',
      750: '#3b0fd2'
    },
    blue: {
      50: '#edf6ff',
      100: '#d6ecff',
      300: '#69b8ff',
      400: '#369FFF',
      500: '#369FFF',
      600: '#475eff',
      800: '#003680'
    },
    red: {
      500: '#ff4f22',
      600: '#e62d2d',
      750: '#e62d2d'
    },
    gradients: {
      100: 'linear-gradient(115deg, #eddeff, #d6d7ff)',
      200: 'linear-gradient(145deg, #ffffff, #e7e7ff)',
      400: 'linear-gradient(115deg, #9057ff, #6a33d6)',
      405: 'linear-gradient(140deg, #9057ff, #6a33d6)',
      500: 'linear-gradient(115deg, #923aff, #5e63ff)'
    }
  },
  shadows: {
    xs: '0 0 4px 1px #e3e3e3',
    sm: '0px 3px 3px 1px #858f9d2e',
    md: '0px 3px 12px #858f9d2e',
    lg: '0px 2px 6px rgba(19, 18, 66, 0.07)',
    card: '#d7d9e2 0px 1px 2px 0px',
    hover: '#2a303933 0px 2px 16px 0px',
    segment: '#0000000a -2px 0px 6px, #0000000a -2px 0px 15px',
    float: '3px 3px var(--chakra-colors-base)'
  },
  components: {
    Code: { variants: { subtle: { bg: 'transparent' } } },
    Tag: {
      defaultProps: { colorScheme: 'blackAlpha' },
      sizes: { md: { container: { px: 3, h: 6 } } }, baseStyle: { container: { rounded: '2xl' } }
    },
    FormLabel: { baseStyle: { m: 1, ml: 4, fontSize: 'sm' } },
    Accordion: { baseStyle: { button: { gap: 2 } } },
    Input: {
      defaultProps: { variant: 'filled', focusBorderColor: 'purple.200', errorBorderColor: 'red.200' },
      variants: { filled: { field: { rounded: '3xl', borderWidth: 2, borderColor: 'transparent' } } }
    },
    NumberInput: {
      defaultProps: { variant: 'filled', focusBorderColor: 'purple.200', errorBorderColor: 'red.200' }
    },
    Select: {
      defaultProps: { focusBorderColor: 'purple.200', errorBorderColor: 'red.200' }
    },
    Textarea: {
      defaultProps: { variant: 'filled', focusBorderColor: 'purple.200', errorBorderColor: 'red.200' },
      variants: { filled: { field: { rounded: '3xl', borderWidth: 2, borderColor: 'transparent' } } }
    },
    Button: {
      defaultProps: { colorScheme: 'purple', rounded: '3xl' },
      baseStyle: { fontWeight: 500 },
      size: { sm: { minW: 0 } },
      variants: {
        solid: { rounded: '3xl' }, outline: { rounded: '3xl' }, link: { px: { sm: 0, md: 0 }, h: { md: 'auto' } },
        quick: {
          rounded: 'lg', borderWidth: 1, bg: 'base', justifyContent: 'start',
          _hover: { bg: 'purple.50' }, pl: 8, lineHeight: 1
        },
        gradient: { rounded: 'lg', color: 'white', bg: 'gradients.500', _hover: { filter: 'brightness(1.2)' } }
      }
    }
  },
  styles: {
    global: {
      'html, body, #root': { w: '100vw', h: '100vh' }, ':focus': { outline: 'none' },
      '::-webkit-scrollbar': { h: 3, w: 3, bg: 'transparent', ':horizontal': { bg: 'transparent' } },
      '::-webkit-scrollbar-corner': { bg: 'transparent' },
      '::-webkit-scrollbar-thumb': { borderRadius: 6, bg: 'transparent' },
      ':hover::-webkit-scrollbar-thumb': { bg: 'mid' },
      'ul, li': { listStyle: 'none', padding: 0, margin: 0 },
      '.Typewriter': { fontFamily: 'monospace', fontSize: '5xl', '.purple': { color: 'purple.500' } },
      '.rct-tree-root': {
        '--rct-color-tree-bg': 'none', '--rct-item-height': '2rem',
        '--rct-color-focustree-item-selected-bg': 'var(--chakra-colors-gray-15)',
        '--rct-color-nonfocustree-item-selected-bg': 'var(--chakra-colors-gray-15)',
        '--rct-color-focustree-item-focused-border': 'var(--chakra-colors-purple-100)',
        '--rct-color-tree-focus-outline': 'var(--chakra-colors-purple-100)'
      },
      '.tasks': { bg: 'bg', px: 2, py: 1, rounded: '2xl', h: 'full', overflow: 'hidden' },
      '.slides-grid': { display: 'flex', flexDir: 'column', w: 'full', p: 8 },
      '.rdp': {
        '--rdp-accent-color': 'var(--chakra-colors-purple-75)',
        '.rdp-button': { transition: 'background-color 0.5s ease' },
        '.rdp-day_today': { color: 'var(--chakra-colors-purple-400)' }
      },
      '.cal-published': {
        backgroundPosition: '0 -1em', backgroundRepeat: 'no-repeat', fontWeight: 500,
        backgroundImage: 'radial-gradient(var(--chakra-colors-green-400) 3px, transparent 0)'
      },
      '.cal-due': {
        backgroundPosition: '0 -1em', backgroundRepeat: 'no-repeat', fontWeight: 500,
        backgroundImage: 'radial-gradient(var(--chakra-colors-red-400) 3px, transparent 0)'
      },
      '.cal-due.cal-published': {
        backgroundImage: 'radial-gradient(var(--chakra-colors-red-400) 3px, transparent 0),' +
            'radial-gradient(var(--chakra-colors-green-400) 3px, transparent 0)',
        backgroundPosition: '-5px -1em, 5px -1em'
      }
    }
  }
})

export default theme