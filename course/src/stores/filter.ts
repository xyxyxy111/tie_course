
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  const sortBy = ref('relevance')
  const selectedThemes = ref<string[]>([])
  const selectedLanguage = ref<string[]>([])
  const selectedLevel = ref('all')
  const selectedPrice = ref('both')
  const themes = ref([
    { value: "JavaScript", label: "JavaScript", isSelected: false },
    { value: "React JS", label: "React JS", isSelected: false },
    { value: "Angular", label: "Angular", isSelected: false },
    { value: "Java", label: "Java", isSelected: false },
    { value: "CSS", label: "CSS", isSelected: false },
    { value: "Android", label: "Android", isSelected: false },
    { value: "iOS", label: "iOS", isSelected: false }
  ]);
  const languages = ref([
    { value: "Chinese", label: "中文", isSelected: false },
    { value: "English", label: "English", isSelected: false }
  ])
  const levels = [
    { value: "all", label: "所有等级", isPicked: true },
    { value: "beginner", label: "初级", isPicked: false },
    { value: "intermediate", label: "中级", isPicked: false },
    { value: "expert", label: "专家", isPicked: false },
  ];
  const prices = [
    { value: "both", label: "全部", isPicked: true },
    { value: "paid", label: "付费", isPicked: false },
    { value: "free", label: "免费", isPicked: false },
  ];
  function selectTheme(theme: typeof themes.value[0]) {
    theme.isSelected = !theme.isSelected
    if (theme.isSelected) {
      selectedThemes.value.push(theme.value)
    }
    else {
      selectedThemes.value = selectedThemes.value.filter(
        item => item !== theme.value
      );
    }
    console.log(themes)
    console.log(selectedThemes.value)
  }
  function selectLanguage(lang: typeof languages.value[0]) {
    lang.isSelected = !lang.isSelected;
    if (lang.isSelected) {
      selectedLanguage.value.push(lang.value);
    } else {
      selectedLanguage.value = selectedLanguage.value.filter(
        item => item !== lang.value
      );
    }
    console.log(selectedLanguage.value)
  }

  return {
    sortBy,
    selectedThemes,
    themes,
    selectTheme,
    selectedLanguage,
    languages,
    selectLanguage,
    selectedLevel,
    levels,
    selectedPrice,
    prices
  }
})