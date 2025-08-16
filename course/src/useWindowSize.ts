// useWindowSize.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useWindowSize() {
  const width: Ref<number> = ref(window.innerWidth)
  const height: Ref<number> = ref(window.innerHeight)

  const update = (): void => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}