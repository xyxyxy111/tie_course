<template>
  <svg
    v-if="isStatic"
    class="svg-icon static-icon"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :fill="color"
  >
    <use :href="`#${name}`" />
  </svg>
  <DynamicIcon
    v-else
    :name="name"
    :size="size"
    :color="color"
    :data="data"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import DynamicIcon from './DynamicIcon.vue'

const STATIC_ICONS = ['static-icon-home', 'static-icon-settings','line-md--computer-twotone','gravity-ui--logo-linux','mdi--web']

export default defineComponent({
  name: 'SvgIcon',
  components: { DynamicIcon },
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
    },
    data: {
      type: Array as () => number[],
      default: () => []
    }
  },
  setup(props) {
    const isStatic = computed(() => STATIC_ICONS.includes(props.name))

    return { isStatic }
  }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  shape-rendering: geometricPrecision;
}
</style>