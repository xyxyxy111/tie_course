// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 购物车课程列表
  const courses = ref([
    {
      id: 1,
      image: '/src/images/image1.png',
      title: 'Ultimate AWS Certified Solutions Architect Associate 2025',
      price: 109.99
    },
    {
      id: 2,
      image: '/src/images/image2.png',
      title: 'The Complete AI Guide: Learn ChatGPT, Generative AI & More',
      price: 79.99
    }
  ])

  // 计算总价
  const totalPrice = computed(() =>
    courses.value.reduce((sum, course) => sum + course.price, 0)
  )

  const userId = ref('')

  return { courses, totalPrice, userId }
})