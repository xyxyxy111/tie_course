import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 类型定义
export interface FilterOption {
  value: string
  label: string
  isSelected: boolean
}

export interface LevelOption {
  value: string
  label: string
  isPicked: boolean
}

export interface PriceOption {
  value: string
  label: string
  isPicked: boolean
}

export const useFilterStore = defineStore('filter', () => {
  // 排序方式
  const sortBy = ref('relevance')

  // 选中的筛选条件
  const selectedThemes = ref<string[]>([])
  const selectedLanguage = ref<string[]>([])
  const selectedLevel = ref('all')
  const selectedPrice = ref('both')

  // 主题选项
  const themes = ref<FilterOption[]>([
    { value: "JavaScript", label: "JavaScript", isSelected: false },
    { value: "React JS", label: "React JS", isSelected: false },
    { value: "Angular", label: "Angular", isSelected: false },
    { value: "Java", label: "Java", isSelected: false },
    { value: "CSS", label: "CSS", isSelected: false },
    { value: "Android", label: "Android", isSelected: false },
    { value: "iOS", label: "iOS", isSelected: false }
  ])

  // 语言选项
  const languages = ref<FilterOption[]>([
    { value: "Chinese", label: "中文", isSelected: false },
    { value: "English", label: "English", isSelected: false }
  ])

  // 等级选项
  const levels = ref<LevelOption[]>([
    { value: "all", label: "所有等级", isPicked: true },
    { value: "beginner", label: "初级", isPicked: false },
    { value: "intermediate", label: "中级", isPicked: false },
    { value: "expert", label: "专家", isPicked: false },
  ])

  // 价格选项
  const prices = ref<PriceOption[]>([
    { value: "both", label: "全部", isPicked: true },
    { value: "paid", label: "付费", isPicked: false },
    { value: "free", label: "免费", isPicked: false },
  ])

  // 计算属性：是否有任何筛选条件
  const hasActiveFilters = computed(() => {
    return selectedThemes.value.length > 0 ||
      selectedLanguage.value.length > 0 ||
      selectedLevel.value !== 'all' ||
      selectedPrice.value !== 'both'
  })

  // 计算属性：选中的主题数量
  const selectedThemeCount = computed(() => selectedThemes.value.length)

  // 计算属性：选中的语言数量
  const selectedLanguageCount = computed(() => selectedLanguage.value.length)

  // 选择主题
  function selectTheme(theme: FilterOption) {
    theme.isSelected = !theme.isSelected
    if (theme.isSelected) {
      selectedThemes.value.push(theme.value)
    } else {
      selectedThemes.value = selectedThemes.value.filter(
        item => item !== theme.value
      )
    }
  }

  // 选择语言
  function selectLanguage(lang: FilterOption) {
    lang.isSelected = !lang.isSelected
    if (lang.isSelected) {
      selectedLanguage.value.push(lang.value)
    } else {
      selectedLanguage.value = selectedLanguage.value.filter(
        item => item !== lang.value
      )
    }
  }

  // 选择等级
  function selectLevel(level: LevelOption) {
    // 重置所有等级选项
    levels.value.forEach(l => l.isPicked = false)
    // 设置选中的等级
    level.isPicked = true
    selectedLevel.value = level.value
  }

  // 选择价格
  function selectPrice(price: PriceOption) {
    // 重置所有价格选项
    prices.value.forEach(p => p.isPicked = false)
    // 设置选中的价格
    price.isPicked = true
    selectedPrice.value = price.value
  }

  // 清除所有筛选条件
  function clearAllFilters() {
    // 清除主题选择
    themes.value.forEach(theme => theme.isSelected = false)
    selectedThemes.value = []

    // 清除语言选择
    languages.value.forEach(lang => lang.isSelected = false)
    selectedLanguage.value = []

    // 重置等级
    levels.value.forEach(level => level.isPicked = level.value === 'all')
    selectedLevel.value = 'all'

    // 重置价格
    prices.value.forEach(price => price.isPicked = price.value === 'both')
    selectedPrice.value = 'both'

    // 重置排序
    sortBy.value = 'relevance'
  }

  // 获取当前筛选条件摘要
  function getFilterSummary() {
    const summary = []

    if (selectedThemes.value.length > 0) {
      summary.push(`主题: ${selectedThemes.value.join(', ')}`)
    }

    if (selectedLanguage.value.length > 0) {
      summary.push(`语言: ${selectedLanguage.value.join(', ')}`)
    }

    if (selectedLevel.value !== 'all') {
      const level = levels.value.find(l => l.value === selectedLevel.value)
      summary.push(`等级: ${level?.label || selectedLevel.value}`)
    }

    if (selectedPrice.value !== 'both') {
      const price = prices.value.find(p => p.value === selectedPrice.value)
      summary.push(`价格: ${price?.label || selectedPrice.value}`)
    }

    return summary
  }

  return {
    // 状态
    sortBy,
    selectedThemes,
    selectedLanguage,
    selectedLevel,
    selectedPrice,
    themes,
    languages,
    levels,
    prices,

    // 计算属性
    hasActiveFilters,
    selectedThemeCount,
    selectedLanguageCount,

    // 方法
    selectTheme,
    selectLanguage,
    selectLevel,
    selectPrice,
    clearAllFilters,
    getFilterSummary
  }
})