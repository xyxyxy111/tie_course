<template>
  <svg
    class="dynamic-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="color"
    v-html="iconContent"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'DynamicIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: (value: string) => ['dynamic-chart', 'dynamic-graph'].includes(value)
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    data: {
      type: Array as () => number[],
      default: () => []
    }
  },
  setup(props) {
    const iconContent = computed(() => {
      switch (props.name) {
        case 'dynamic-chart':
          return generateChartSvg(props.data)
        case 'dynamic-graph':
          return generateGraphSvg(props.data)
        default:
          return ''
      }
    })

    function generateChartSvg(data: number[]) {
      if (data.length === 0) return ''
      
      const points = data.map((value, index) => {
        const x = 2 + (index * (20 / (data.length - 1)))
        const y = 22 - (value / 5)
        return `${x},${y}`
      }).join(' ')
      
      return `
        <polyline points="${points}" fill="none" stroke="${props.color}" stroke-width="1.5"/>
        ${data.map((_, index) => 
          `<circle cx="${2 + (index * (20 / (data.length - 1)))}" 
                  cy="${22 - (data[index] / 5)}" 
                  r="1" 
                  fill="${props.color}"/>`
        ).join('')}
      `
    }

    function generateGraphSvg(data: number[]) {
      // 类似逻辑实现图表
      return ''
    }

    return { iconContent }
  }
})
</script>

<style scoped>
.dynamic-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>