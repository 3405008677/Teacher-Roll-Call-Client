import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {},
  },
  presets: [
    presetUno(),
    presetAttributify({}),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {},
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
