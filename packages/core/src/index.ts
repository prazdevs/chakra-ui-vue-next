import { computed, Plugin, ref, UnwrapRef } from "vue"
import { theme as defaultTheme, baseTheme, Theme } from "@chakra-ui/theme"
import { ColorModeRef, setupColorModeContext } from "@chakra-ui/c-color-mode"
import { toCSSVar, WithCSSVar } from "@chakra-ui/styled-system"
import { chakra, injectGlobal } from "@chakra-ui/vue-system"
import {
  EmotionThemeContextSymbol,
  EmotionCacheInjectionSymbol,
} from "@chakra-ui/vue-styled"
import createCache, { EmotionCache } from "@emotion/cache"
import internalIcons from "./icon.internals"
import {
  extendTheme,
  extendBaseTheme,
  ThemeOverride,
} from "@chakra-ui/theme-utils"
import { MergedIcons, parseIcons } from "./parse-icons"
import { injectResetStyles, injectThemeGlobalStyles } from "./helpers/css-reset"
import { mode } from "@chakra-ui/theme-tools"
import { ChakraPluginOptions } from "./helpers/plugin.types"
import { Dict } from "@chakra-ui/utils"
import { localStorageManager, StorageManager } from "@chakra-ui/c-color-mode"

/**
 * 1. Support passing cache options from plugin
 * 2. Provide emotion theme directly from plugin
 * 3.
 */

const defaultPluginOptions: ChakraPluginOptions = {
  cssReset: true,
  isBaseTheme: false,
  colorModeManager: localStorageManager,
}

/**
 * Helper function to extend Chakra plugin with options
 * It just returns its arguments with typescript types added
 */
export function extendChakra(options = defaultPluginOptions) {
  return options
}

const ChakraUIVuePlugin: Plugin = {
  install(app, options: ChakraPluginOptions = defaultPluginOptions) {
    // 1. Get theme value
    // 2. Parse theme tokens to CSS variables
    // 3. Inject all CSS variables as theme object
    const theme =
      options.extendTheme! ||
      ((options.isBaseTheme ? baseTheme : defaultTheme) as any as
        | Theme
        | (Omit<Theme, "components"> & { components: Dict }))
    const computedTheme = computed<WithCSSVar<ThemeOverride>>(() =>
      toCSSVar(theme)
    )

    const colorModeManager = options.colorModeManager || localStorageManager
    // Inject Chakra CSS variables
    injectGlobal({
      ":root": computedTheme.value.__cssVars,
    })

    // Initialize color mode
    const colorMode: UnwrapRef<ColorModeRef> =
      theme.config?.initialColorMode || "light"

    const colorModeRef = ref(colorMode) as ColorModeRef

    setupColorModeContext(app, {
      _colorMode: colorModeRef,
      colorModeManager,
      useSystemColorMode: theme.config?.useSystemColorMode || false,
      initialColorMode: colorMode,
      disableTransitionOnChange:
        theme.config?.disableTransitionOnChange || false,
    })

    if (options.cssReset) {
      injectResetStyles()
    }

    let libraryIcons = options.icons?.library || {}
    let extendedIcons = options.icons?.extend || {}

    // Bind theme to application global properties and provide to application
    app.config.globalProperties.$chakraTheme = computedTheme.value
    app.config.globalProperties.$chakraTheme = computedTheme.value
    app.provide(EmotionThemeContextSymbol, computedTheme.value)
    app.provide("$chakraTheme", computedTheme.value as ThemeOverride)

    let emotionCache: EmotionCache | null = null
    // Provide emotion cache
    if (options.emotionCacheOptions) {
      emotionCache = createCache(options.emotionCacheOptions)
      app.provide(EmotionCacheInjectionSymbol, emotionCache)
    }

    if (!emotionCache) {
      emotionCache = createCache({
        key: "chakra",
        nonce: `chakra-global-cache-${Date.now()}`,
      })
    }

    // Inject `styles.global` in document
    injectThemeGlobalStyles(computedTheme.value, emotionCache, colorModeRef)

    libraryIcons = parseIcons(libraryIcons)

    // Merge internal icons and library icons
    const mergedIcons: MergedIcons = {
      ...internalIcons,
      ...libraryIcons,
      ...extendedIcons,
    }

    app.provide("$chakraIcons", mergedIcons)

    // Set color mode property
    app.config.globalProperties.$mode = mode
  },
}

export type { ChakraPluginOptions }
export interface ThemeProviderProps extends ThemeOverride {}
export default ChakraUIVuePlugin
export { extendTheme, extendBaseTheme }

// Export chakra factory function
export { chakra as chakra }

export * from "./components"
import * as ChakraComponents from "./components"
export { ChakraComponents }
