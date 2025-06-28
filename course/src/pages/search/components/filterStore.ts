import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategoryList } from '@/api/course.ts';
import { categoryApi } from '@/api/course.ts';

export const useFilterStore = defineStore('filter', () => {
  // 状态
  const sortBy = ref('relevance')
  const selectedThemes = ref<string[]>([])
  const selectedLanguage = ref<string[]>([])
  const selectedLevel = ref('all')
  const selectedPrice = ref('both')
  const categories = ref<any[]>([])
  const tags = ref<any[]>([])
  const selectedCategory = ref<number | null>(null)
  const selectedTag = ref<number | null>(null)

  // 常量
  const levels = [
    { value: "all", label: "所有等级", isPicked: true },
    { value: "beginner", label: "初级", isPicked: false },
    { value: "intermediate", label: "中级", isPicked: false },
    { value: "expert", label: "专家", isPicked: false },
  ]

  const prices = [
    { value: "both", label: "全部", isPicked: true },
    { value: "paid", label: "付费", isPicked: false },
    { value: "free", label: "免费", isPicked: false },
  ]

  // 方法
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoryApi.getAllCategories();
      console.log("categoriesResponse:", categoriesResponse);
      categories.value = categoriesResponse.data;
      categories.value = (categoriesResponse.data || []).map((cat: any) => ({
        value: cat.categoryId,
        label: cat.name,
        isSelected: false
      }))
      console.log("categories mapped:", categories.value)
    } catch (error) {
      console.error("fetchCategories error:", error)
    }
  }

  const fetchTagsByCategory = async (categoryId: number) => {
    const res = await categoryApi.getTagListByCategoryId(categoryId)
    tags.value = (res.data || []).map((tag: any) => ({
      value: tag.tagId,
      label: tag.name,
      isSelected: false
    }))
  }

  const selectCategory = (category: typeof categories.value[0]) => {
    categories.value.forEach(cat => cat.isSelected = false)
    category.isSelected = true
    selectedCategory.value = category.value
    fetchTagsByCategory(category.value)
    clearTagSelection()
  }

  const selectTag = (tag: typeof tags.value[0]) => {
    tags.value.forEach(t => t.isSelected = false)
    tag.isSelected = true
    selectedTag.value = tag.value
  }

  const clearTagSelection = () => {
    tags.value.forEach(t => t.isSelected = false)
    selectedTag.value = null
  }

  // 根据URL参数初始化选中的category和tag
  const initializeFromURL = async (categoryId?: number, tagId?: number) => {
    if (categoryId) {
      // 找到对应的category并选中
      const category = categories.value.find(cat => cat.value === categoryId)
      if (category) {
        await selectCategory(category)

        // 如果有tagId，也选中对应的tag
        if (tagId) {
          const tag = tags.value.find(t => t.value === tagId)
          if (tag) {
            selectTag(tag)
          }
        }
      }
    }
  }

  return {
    // 状态
    sortBy,
    selectedThemes,
    selectedLanguage,
    selectedLevel,
    selectedPrice,
    categories,
    tags,
    selectedCategory,
    selectedTag,

    // 常量
    levels,
    prices,

    // 方法
    fetchCategories,
    fetchTagsByCategory,
    selectCategory,
    selectTag,
    clearTagSelection,
    initializeFromURL
  }
})