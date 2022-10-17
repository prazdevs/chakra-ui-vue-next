import { computed, watch } from "vue"
import { machine, connect } from "@zag-js/number-input"
import { normalizeProps, useMachine } from "@zag-js/vue"

export interface NumberInputProps {
  id: string
  value: string
  modelValue: string
}

export const useNumberInputMachine = (
  props: NumberInputProps,
  emit: CallableFunction
) => {
  const [state, send] = useMachine(
    machine({
      id: props.id,
      value: props.modelValue || props.value,
      onChange: (value) => {
        emit("change", value.value)
        emit("update:modelValue", value.value)
      },
    })
  )

  const api = computed(() => connect(state.value, send, normalizeProps))

  watch(
    () => props.modelValue,
    (value) => api.value?.setValue(value)
  )

  return api
}
