/**
 * Hey! Welcome to @chakra-ui/vue-next CNumberInput
 *
 * The `CNumberInput` component is similar to the `CInput` component,
 * but it has controls for incrementing or decrementing numeric values.
 *
 * @see Docs     https://next.vue.chakra-ui.com/c-number-input
 * @see Source   https://github.com/chakra-ui/chakra-ui-vue-next/blob/master/packages/c-number-input/src/c-number-input/c-number-input.ts
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2
 */

import { h, defineComponent, ComputedRef, PropType } from "vue"
import {
  createContext,
  getValidChildren,
  vueThemingProps,
} from "@chakra-ui/vue-utils"
import { connect } from "@zag-js/number-input"
import { chakra } from "@chakra-ui/vue-system"
import { NumberInputProps, useNumberInputMachine } from "./use-number-input"
import { TriangleDownIcon, TriangleUpIcon } from "./icons"

const [NumberInputProvider, useNumberInput] =
  createContext<ComputedRef<ReturnType<typeof connect>>>()

export const CNumberInput = defineComponent({
  name: "CNumberInput",
  props: {
    value: {
      type: String as PropType<NumberInputProps["value"]>,
      default: () => "",
    },
    modelValue: {
      type: String as PropType<NumberInputProps["modelValue"]>,
      default: () => "",
    },
    ...vueThemingProps,
  },
  emit: ["change", "update:modelValue"],
  setup(props, { slots, attrs, emit }) {
    const api = useNumberInputMachine(
      props as unknown as NumberInputProps,
      emit
    )
    NumberInputProvider(api)

    return () => (
      <div {...api.value.rootProps} {...attrs}>
        {slots}
      </div>
    )
  },
})

export const CNumberInputField = defineComponent({
  name: "CNumberInputField",
  setup(_, { attrs }) {
    const api = useNumberInput()

    return () => <input {...attrs} {...api.value.inputProps} />
  },
})

export const CNumberInputStepper = defineComponent({
  name: "CNumberInputStepper",
})

const StyledStepper = defineComponent({
  setup(_, { attrs }) {
    return () => (
      <chakra.div
        baseStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          transitionProperty: "common",
          transitionDuration: "normal",
          userSelect: "none",
          cursor: "pointer",
          lineHeight: "normal",
        }}
        {...attrs}
      />
    )
  },
})

export const NumberIncrementStepper = defineComponent({
  name: "CNumberIncrementStepper",
  setup(_, { attrs, slots }) {
    const api = useNumberInput()
    return () => (
      <StyledStepper {...api.value.incrementButtonProps} {...attrs}>
        {() => (slots.default ? getValidChildren(slots) : <TriangleUpIcon />)}
      </StyledStepper>
    )
  },
})

export const NumberDecrementStepper = defineComponent({
  name: "CNumberDecrementStepper",
  setup(_, { attrs, slots }) {
    const api = useNumberInput()
    return () => (
      <StyledStepper {...api.value.decrementButtonProps} {...attrs}>
        {() => (slots.default ? getValidChildren(slots) : <TriangleDownIcon />)}
      </StyledStepper>
    )
  },
})
