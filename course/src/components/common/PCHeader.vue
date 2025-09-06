<template>
  <IconSprite />
  <div class="header">
    <div :style="headerSpaceStyle"></div>
    <div id="logo" :style="headerButtonStyle" @click="goToIndex()">
      <img src="/src/images/iclass.png" alt="">
    </div>
    <div :style="headerSpaceStyle"></div>
    <div class="explore">
      <button @mouseenter="handleExploreEnter" @mouseleave="handleExploreLeave" class="explore-button">探索</button>
      <div v-if="exploreHoverFlag" class="explore-popup" @mouseenter="handleExplorePopupEnter"
        @mouseleave="handleExplorePopupLeave">
        <div class="explore-popup-content">
          <div class="categories-list">
            <div v-for="category in categoryList" :key="category.categoryId" class="category-item"
              @mouseenter="handleCategoryHover(category)" @mouseleave="handleCategoryLeave">
              <div class="category-content">
                <span class="category-name">{{ category.name }}</span>
              </div>
              <div class="category-arrow">→</div>
              <div v-if="hoveredCategory?.categoryId === category.categoryId" class="tags-popup"
                @mouseenter="handleTagsHover" @mouseleave="handleTagsLeave">
                <div class="tags-list">
                  <span v-for="tag in category.tags" :key="tag.tagId" class="tag-item"
                    @click="goToCategory(category.categoryId!, tag.tagId)">
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input v-model="searchQuery" type="text" placeholder="搜索任何内容" :style="headerSearchInputStyle" @keyup.enter="Search">
    <button>
      <div class="icon" @click="Search">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>


    <div v-if="userId" class="mylearn" :style="headerButtonStyle" @click="goToLearning">
      <button v-if="userId" @click="goToLearning" @mouseenter="handleMyLearnEnter" @mouseleave="handleMyLearnLeave"
        class="mylearn-button">
        我的学习 </button>
      <div v-if="myLearnHoverFlag" class="mylearn-popup" @mouseenter="handleMyLearnPopupEnter"
        @mouseleave="handleMyLearnPopupLeave">
        <div class="mylearn-popup-content">
          <div v-for="course in mylist" :key="course.courseId" class="mylearn-course-item">
            <img :src="course.coverImgUrl" class="mylearn-course-cover" />
            <div class="mylearn-course-info">
              <div class="mylearn-course-title">
                {{ course.title }}
              </div>
              <div class="mylearn-course-author">iClass</div>
              <div class="mylearn-progress-bar">
                <div class="mylearn-progress-inner" :style="{ width: (course.watchProgress * 100) + '%' }">
                </div>
              </div>
            </div>
          </div>
          <button class="mylearn-btn" @click="goToLearning">转到我的学习</button>
        </div>
      </div>
    </div>

    <div v-if="userId" class="wishlist" :style="headerButtonStyle">
      <button v-if="userId" @click="goToWishlist" :style="headerButtonStyle" @mouseenter="handleWishlistEnter"
        @mouseleave="handleWishlistLeave" class="wishlist-button">
        <div class="header-icon">
          <svg width="36" height="36" viewBox="0 2 16 16" fill="#35495e">
            <use href="#line-md--heart-filled" />
          </svg>
        </div>
      </button>
      <div v-if="wishlistHoverFlag" class="wishlist-popup" @mouseenter="handleWishlistPopupEnter"
        @mouseleave="handleWishlistPopupLeave">
        <div class="wishlist-popup-content">
          <div v-for="item in wishlist" :key="item.courseId" class="wishlist-card">
            <div class="wishlist-card-item">
              <div class="wishlist-card-cover"> <img :src="item.coverImgUrl" class="wishlist-card-cover" />
              </div>
              <div class="wishlist-card-info">
                <div class="wishlist-card-title">{{ item.title }}</div>
                <div class="wishlist-card-meta">iClass</div>
                <div class="wishlist-card-price">￥{{ item.currentPrice }}</div>
              </div>

            </div>
            <!-- @click="addToCart(item)" -->
            <button class="wishlist-card-btn">添加到购物车</button>

          </div>
          <button class="wishlist-popup-btn" @click="goToWishlist">转至心愿单</button>
        </div>
      </div>
    </div>

    <div class="cart" :style="headerButtonStyle">
      <button @click="goToCart()" @mouseenter="handleCartEnter" @mouseleave="handleCartLeave" class="cart-button">
        <div class="header-icon">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
            <use href="#mdi--cart-outline" />
          </svg>
        </div>
      </button>
      <div v-if="cartHoverFlag && userId" class="cart-popup" @mouseenter="handleCartPopupEnter"
        @mouseleave="handleCartPopupLeave">
        <div class="cart-popup-content">
          <div class="cart-list" v-if="cart?.cartItemList.length">
            <div v-for="item in cart.cartItemList" :key="item.id" class="cart-item">
              <img :src="item.courseImage" class="cart-item-cover" />
              <div class="cart-item-info">
                <div class="cart-item-title">{{ item.courseName }}</div>
                <div class="cart-item-meta">iClass</div>
                <div class="cart-item-price">￥{{ item.currentPrice }}</div>
              </div>
            </div>
          </div>
          <div v-else class="cart-empty">购物车为空</div>
          <div class="cart-popup-footer">
            <div class="cart-total">
              总计：￥{{ totalPrice }}
            </div>
            <button class="cart-popup-btn" @click="goToCart">前往购物车</button>
          </div>
        </div>
      </div>
    </div>


    <button v-if="!userId" :style="headerButtonStyle2" @click="goToLogin">登录</button>


    <div v-if="userId" :style="headerButtonStyle" @mouseenter="handleMyInfoEnter" @mouseleave="handleMyInfoLeave"
      class="myinfo">
      <div class="myinfo-button">
        <img :src="profile?.avatarUrl" alt="" @click="goToMyInfo()">
      </div>
      <div v-if="myInfoHoverFlag" class="myinfo-popup" @mouseenter="handleMyInfoPopupEnter"
        @mouseleave="handleMyInfoPopupLeave">
        <div class="myinfo-popup-content">
          <div class="myinfo-header">
            <img :src="profile?.avatarUrl" class="myinfo-avatar" />
            <div class="myinfo-userinfo">
              <div class="myinfo-username">{{ profile?.firstName }}</div>
              <!-- <div class="myinfo-email">{{ profile?.email }}</div> -->
            </div>
          </div>
          <div class="myinfo-menu">
            <div class="myinfo-menu-group">
              <div class="myinfo-menu-item" @click="goToLearning">我的学习</div>
              <div class="myinfo-menu-item" @click="goToCart">
                我的购物车
                <span v-if="cart && cart.cartItemList && cart?.cartItemList.length > 0" class="myinfo-cart-badge">
                  {{ cart?.cartItemList.length > 99 ? '99+' : cart?.cartItemList.length }}</span>
              </div>
              <div class="myinfo-menu-item" @click="goToWishlist">心愿单</div>
            </div>
            <!-- <div class="myinfo-menu-group">
            <div class="myinfo-menu-item" @click="goTo('notice')">通知</div>
            <div class="myinfo-menu-item" @click="goTo('message')">消息</div>
          </div> -->
            <div class="myinfo-menu-group">
              <div class="myinfo-menu-item">购买记录</div>
            </div>
            <div class="myinfo-menu-group">
              <div class="myinfo-menu-item lang">
                语言
                <span class="myinfo-lang">中文(简体) <i class="lang-icon"></i></span>
              </div>
            </div>
            <div class="myinfo-menu-group">
              <div class="myinfo-menu-item" @click="goToMyInfo">编辑个人资料</div>
              <div class="myinfo-menu-item" @click="handleLogout">退出</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import IconSprite from '../Icon/IconSprite.vue'
import './header.css'
import {
  goToLogin, goToMyInfo, goToLearning, goToWishlist,
  categoryList, expandedCategory, toggleCategory, handleLogout,
  goToCategory, fetchCategories, goToIndex, goToCart, Search, searchQuery
} from './header.ts';
import type { CategoryList } from '@/api/course.ts';
import { categoryApi } from '@/api/course'
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { cartApi, type Cart } from '@/api/cart.ts';
import { myListApi, profileApi, wishlistApi, type MyListVO, type UserProfile, type WishListVO } from '@/api/user.ts';
// import { useCartLogic } from '@/pages/cart/components/content';
// const { cart, fetchCart } = useCartLogic();

const exploreHoverFlag = ref(false)
const hoveredCategory = ref<any>(null)
const tagsHoverFlag = ref(false)
let exploreHideTimer: number | null = null
let categoryHideTimer: number | null = null
let tagsHideTimer: number | null = null
const myInfoHoverFlag = ref(false)
let myInfoHideTimer: number | null = null
const cartHoverFlag = ref(false)
let cartHideTimer: number | null = null
const wishlistHoverFlag = ref(false)
let wishlistHideTimer: number | null = null
const myLearnHoverFlag = ref(false)
let myLearnHideTimer: number | null = null

onUnmounted(() => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
  }
  if (categoryHideTimer) {
    clearTimeout(categoryHideTimer)
  }
  if (tagsHideTimer) {
    clearTimeout(tagsHideTimer)
  }
  if (myInfoHideTimer) {
    clearTimeout(myInfoHideTimer)
  }
  if (cartHideTimer) {
    clearTimeout(cartHideTimer)
  }
  if (wishlistHideTimer) {
    clearTimeout(wishlistHideTimer)
  }
  if (myLearnHideTimer) {
    clearTimeout(myLearnHideTimer)
  }
});

const userId = ref<string | null>(null);
const token = getValidToken();
if (token) {
  userId.value = getCurrentUserId();
} else {

}
const mylist = ref<MyListVO[]>();
const wishlist = ref<WishListVO[]>();
const cart = ref<Cart | null>(null);
const profile = ref<UserProfile | null>(null);
const error = ref<string | null>(null);

const fetchMylist = async () => {
  try {
    const response = await myListApi.getMyList();
    if (response && response.data && Array.isArray(response.data)) {
      mylist.value = response.data as MyListVO[];
    } else {
      mylist.value = [];
    }
  } catch (error) {
    mylist.value = [];
  }
};
const fetchWishlist = async () => {
  try {
    const response = await wishlistApi.getWishlist();
    if (response && response.data && Array.isArray(response.data)) {
      wishlist.value = response.data as WishListVO[];
    } else {
      console.log('愿望单数据为空或格式不正确');
      wishlist.value = [];
    }
  } catch (error) {
    wishlist.value = [];
  }
};
const fetchCart = async () => {
  error.value = null;
  try {
    const response = await cartApi.getMyCart();
    cart.value = response.data;
  } catch (err) {
    error.value = '获取购物车数据失败';
  }
};
const fetchProfile = async () => {
  error.value = null;
  try {
    const response = await profileApi.getProfile();
    profile.value = response.data;
  } catch (err) {
    error.value = '获取个人信息数据失败';
  }
}

const totalPrice = computed(() => {
  if (!cart.value?.cartItemList) return 0;
  const sum = cart.value.cartItemList.reduce((sum, course) => sum + course.currentPrice, 0);
  return Number(sum.toFixed(2));
});
onMounted(async () => {
  await fetchCategories();
  if (userId.value) {
    await fetchMylist();
    await fetchWishlist();
    await fetchCart();
    await fetchProfile();
  }
});


const { width, height } = useWindowSize()
const headerSpaceWidth = computed(() => Math.max(0, (width.value - 200) / 2800));
const headerSearchInputWidth = computed(() => Math.max(0, (width.value - 800) / 300));
const headerButtonPadding = computed(() => {
  const calculatedValue = (width.value - 1500) / 3000;
  return Math.min(3, Math.max(1, calculatedValue));
});
const headerSpaceStyle = computed(() => ({
  width: `calc(3vw * ${headerSpaceWidth.value})`,
  transition: 'none'
}));

const headerSearchInputStyle = computed(() => ({
  width: `clamp(450px, calc(80% + 10vw * ${headerSearchInputWidth.value}), 90%)`,
  transition: 'none'
}));

const headerButtonStyle = computed(() => ({
  marginInline: `calc(0.5vw * ${headerButtonPadding.value})`,
  transition: 'none'
}));

const headerButtonStyle2 = computed(() => ({
  marginInline: `calc(1vw * ${headerButtonPadding.value} + 10px)`,
  paddingInline: `calc(1vw * ${headerButtonPadding.value} + 20px)`,
  transition: 'none'
}));



const handleExploreEnter = () => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
    exploreHideTimer = null
  }
  exploreHoverFlag.value = true
}

const handleExploreLeave = () => {
  exploreHideTimer = setTimeout(() => {
    exploreHoverFlag.value = false
    hoveredCategory.value = null
    tagsHoverFlag.value = false
  }, 300)
}

const handleExplorePopupEnter = () => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
    exploreHideTimer = null
  }
}

const handleExplorePopupLeave = () => {
  exploreHideTimer = setTimeout(() => {
    exploreHoverFlag.value = false
    hoveredCategory.value = null
    tagsHoverFlag.value = false
  }, 300)
}

const handleCategoryHover = (category: any) => {
  if (categoryHideTimer) {
    clearTimeout(categoryHideTimer)
    categoryHideTimer = null
  }
  hoveredCategory.value = category
}

const handleCategoryLeave = () => {
  if (!tagsHoverFlag.value) {
    categoryHideTimer = setTimeout(() => {
      hoveredCategory.value = null
    }, 300)
  }
}

const handleTagsHover = () => {
  if (tagsHideTimer) {
    clearTimeout(tagsHideTimer)
    tagsHideTimer = null
  }
  tagsHoverFlag.value = true
}

const handleTagsLeave = () => {
  tagsHideTimer = setTimeout(() => {
    tagsHoverFlag.value = false
    hoveredCategory.value = null
  }, 300)
}

const handleMyInfoEnter = () => {
  if (myInfoHideTimer) {
    clearTimeout(myInfoHideTimer)
    myInfoHideTimer = null
  }
  myInfoHoverFlag.value = true
}

const handleMyInfoLeave = () => {
  myInfoHideTimer = setTimeout(() => {
    myInfoHoverFlag.value = false
  }, 300)
}

const handleMyInfoPopupEnter = () => {
  if (myInfoHideTimer) {
    clearTimeout(myInfoHideTimer)
    myInfoHideTimer = null
  }
}

const handleMyInfoPopupLeave = () => {
  myInfoHideTimer = setTimeout(() => {
    myInfoHoverFlag.value = false
  }, 300)
}

const handleCartEnter = () => {
  if (cartHideTimer) {
    clearTimeout(cartHideTimer)
    cartHideTimer = null
  }
  cartHoverFlag.value = true
}

const handleCartLeave = () => {
  cartHideTimer = setTimeout(() => {
    cartHoverFlag.value = false
  }, 300)
}

const handleCartPopupEnter = () => {
  if (cartHideTimer) {
    clearTimeout(cartHideTimer)
    cartHideTimer = null
  }
}

const handleCartPopupLeave = () => {
  cartHideTimer = setTimeout(() => {
    cartHoverFlag.value = false
  }, 300)
}

const handleWishlistEnter = () => {
  if (wishlistHideTimer) {
    clearTimeout(wishlistHideTimer)
    wishlistHideTimer = null
  }
  wishlistHoverFlag.value = true
}

const handleWishlistLeave = () => {
  wishlistHideTimer = setTimeout(() => {
    wishlistHoverFlag.value = false
  }, 300)
}

const handleWishlistPopupEnter = () => {
  if (wishlistHideTimer) {
    clearTimeout(wishlistHideTimer)
    wishlistHideTimer = null
  }
}

const handleWishlistPopupLeave = () => {
  wishlistHideTimer = setTimeout(() => {
    wishlistHoverFlag.value = false
  }, 300)
}

const handleMyLearnEnter = () => {
  if (myLearnHideTimer) {
    clearTimeout(myLearnHideTimer)
    myLearnHideTimer = null
  }
  myLearnHoverFlag.value = true
}

const handleMyLearnLeave = () => {
  myLearnHideTimer = setTimeout(() => {
    myLearnHoverFlag.value = false
  }, 300)
}

const handleMyLearnPopupEnter = () => {
  if (myLearnHideTimer) {
    clearTimeout(myLearnHideTimer)
    myLearnHideTimer = null
  }
}

const handleMyLearnPopupLeave = () => {
  myLearnHideTimer = setTimeout(() => {
    myLearnHoverFlag.value = false
  }, 300)
}


defineExpose({
  fetchCart
});
</script>


<style>
.header {
  margin-bottom: 1rem;
  height: 7.2rem;
  width: 100vw;
  min-width: 1920px;
}


input {
  position: relative;
  top: -3%;
  height: 4rem;
  margin-left: 1%;
}

button .header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}


.explore-button,
.mylearn-button,
.wishlist-button,
.cart-button,
.myinfo-button {
  margin: 0 auto;
  position: relative;
  display: block;
  width: 100%;
}

.myinfo {
  position: relative;
  z-index: 9999;
  display: inline-block;
}

.myinfo-popup {
  position: absolute;
  top: 58px;
  right: 0px;
  z-index: 9999;
  min-width: 320px;
}

#logo img {
  height: 40px;
}

.myinfo-button img {
  margin-top: 5px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.cart-empty {
  text-align: center;
  margin: 20px auto;
  color: #215496;
  font-weight: bolder;
}
</style>