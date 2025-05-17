<template>
  <div class="sidebar-body">
    <div class="sidebar-header">
      <div>筛选</div>
    </div>

    <!-- 排序方式 -->
    <ul class="sidebar-content">
      <li class="sidebar-title">排序方式</li>
      <li>
        <button :class="{ active: filterStore.sortBy === 'relevance' }" @click="filterStore.sortBy = 'relevance'">
          相关度最高
        </button>
      </li>
      <li>
        <button :class="{ active: filterStore.sortBy === 'newest' }" @click="filterStore.sortBy = 'newest'">
          最新
        </button>
      </li>
      <li>
        <button :class="{ active: filterStore.sortBy === 'highest-rated' }"
          @click="filterStore.sortBy = 'highest-rated'">
          评分最高
        </button>
      </li>
    </ul>

    <!-- 语言选择 -->
    <ul class="sidebar-content">
      <li class="sidebar-title">语言</li>
      <li v-for="lang in filterStore.languages" :key="lang.value">
        <button :class="{ active: lang.isSelected }" @click="filterStore.selectLanguage(lang)">
          {{ lang.label }}
        </button>
      </li>
    </ul>

    <!-- 主题选择 -->
    <ul class="sidebar-content">
      <li class="sidebar-title">主题</li>
      <li v-for="theme in filterStore.themes" :key="theme.value">
        <button :class="{ active: theme.isSelected }" @click="filterStore.selectTheme(theme)">
          {{ theme.label }}
        </button>
      </li>
    </ul>

    <!-- 级别选择 -->
    <ul class="sidebar-content">
      <li class="sidebar-title">级别</li>
      <li v-for="level in filterStore.levels" :key="level.value">
        <button :class="{ active: filterStore.selectedLevel === level.value }"
          @click="filterStore.selectedLevel = level.value">
          {{ level.label }}
        </button>
      </li>
    </ul>

    <!-- 价格选择 -->
    <ul class="sidebar-content">
      <li class="sidebar-title">价格</li>
      <li v-for="price in filterStore.prices" :key="price.value">
        <button :class="{ active: filterStore.selectedPrice === price.value }"
          @click="filterStore.selectedPrice = price.value">
          {{ price.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFilterStore } from './filterStore';

const filterStore = useFilterStore()


// 控制页面滚动
</script>

<style scoped>
.sidebar-body {
  width:180px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar-header div {
  margin: 0 auto;
  font-weight: 700;
  font-size: 20px;
}

.sidebar-content {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.sidebar-title {
  font-weight: 700;
  font-size: 18px;
  padding: 15px 0 0px 20px;
  color: #35495e;
}

.sidebar-body button {
  width: 100%;
  padding: 10px 10px;
  font-weight: 400;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: #35495e;
  transition: all 0.2s linear;
}

.sidebar-body button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.sidebar-body button.active {
  font-weight: 600;
  color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);
}
</style>
