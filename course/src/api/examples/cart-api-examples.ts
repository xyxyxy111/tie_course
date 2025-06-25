import { cartApi, cartSuccessCodes, cartErrorCodes } from '@/api/cart';
import type { Cart, CartItem } from '@/api/cart';

/**
 * 购物车API调用案例
 * 展示如何使用购物车的所有接口
 */

// ==================== 1. 获取购物车数据 ====================
export async function exampleGetMyCart() {
  console.log('=== 获取购物车数据示例 ===');

  try {
    const response = await cartApi.getMyCart();

    // 检查响应状态
    if (cartSuccessCodes.includes(response.status)) {
      const cart: Cart = response.data;
      console.log('✅ 获取购物车成功:', {
        userId: cart.userId,
        itemNum: cart.itemNum,
        originalPrice: cart.originalPrice,
        currentPrice: cart.currentPrice,
        cartItemCount: cart.cartItemList?.length || 0
      });

      // 显示购物车中的课程
      if (cart.cartItemList && cart.cartItemList.length > 0) {
        console.log('📚 购物车中的课程:');
        cart.cartItemList.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.courseName}`);
          console.log(`     原价: $${item.courseOriginalPrice}`);
          console.log(`     现价: $${item.currentPrice}`);
          console.log(`     折扣: ${(item.courseDiscount * 100).toFixed(0)}%`);
        });
      } else {
        console.log('🛒 购物车为空');
      }

      return cart;
    } else {
      console.error('❌ 获取购物车失败:', response.message);
      return null;
    }
  } catch (error) {
    console.error('❌ 获取购物车异常:', error);
    return null;
  }
}

// ==================== 2. 添加课程到购物车 ====================
export async function exampleAddCourseToCart(courseId: number) {
  console.log(`=== 添加课程到购物车示例 (课程ID: ${courseId}) ===`);

  try {
    const response = await cartApi.addCourseToCart(courseId);

    if (cartSuccessCodes.includes(response.status)) {
      const cart: Cart = response.data;
      console.log('✅ 添加课程成功:', {
        courseId,
        newItemCount: cart.itemNum,
        newTotalPrice: cart.currentPrice
      });

      // 显示更新后的购物车信息
      const addedItem = cart.cartItemList?.find(item => item.courseId === courseId);
      if (addedItem) {
        console.log('📚 已添加的课程:', {
          courseName: addedItem.courseName,
          originalPrice: addedItem.courseOriginalPrice,
          currentPrice: addedItem.currentPrice,
          discount: `${(addedItem.courseDiscount * 100).toFixed(0)}%`
        });
      }

      return cart;
    } else {
      // 检查特定错误码
      if (response.status === 2301) {
        console.warn('⚠️ 课程已在购物车中');
      } else {
        console.error('❌ 添加课程失败:', response.message);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ 添加课程异常:', error);
    return null;
  }
}

// ==================== 3. 从购物车移除课程 ====================
export async function exampleRemoveCourseFromCart(courseId: number) {
  console.log(`=== 从购物车移除课程示例 (课程ID: ${courseId}) ===`);

  try {
    const response = await cartApi.removeCourseFromCart(courseId);

    if (cartSuccessCodes.includes(response.status)) {
      const cart: Cart = response.data;
      console.log('✅ 移除课程成功:', {
        courseId,
        newItemCount: cart.itemNum,
        newTotalPrice: cart.currentPrice
      });

      // 显示更新后的购物车信息
      if (cart.cartItemList && cart.cartItemList.length > 0) {
        console.log('📚 剩余课程:');
        cart.cartItemList.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.courseName} - $${item.currentPrice}`);
        });
      } else {
        console.log('🛒 购物车已清空');
      }

      return cart;
    } else {
      // 检查特定错误码
      if (response.status === 2302) {
        console.warn('⚠️ 课程不在购物车中');
      } else {
        console.error('❌ 移除课程失败:', response.message);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ 移除课程异常:', error);
    return null;
  }
}

// ==================== 4. 清空购物车 ====================
export async function exampleClearCart() {
  console.log('=== 清空购物车示例 ===');

  try {
    const response = await cartApi.clearCart();

    if (cartSuccessCodes.includes(response.status)) {
      const cart: Cart = response.data;
      console.log('✅ 清空购物车成功:', {
        newItemCount: cart.itemNum,
        newTotalPrice: cart.currentPrice
      });

      if (cart.itemNum === 0) {
        console.log('🛒 购物车已完全清空');
      }

      return cart;
    } else {
      console.error('❌ 清空购物车失败:', response.message);
      return null;
    }
  } catch (error) {
    console.error('❌ 清空购物车异常:', error);
    return null;
  }
}

// ==================== 5. 完整的购物车操作流程示例 ====================
export async function exampleCompleteCartWorkflow() {
  console.log('=== 完整购物车操作流程示例 ===');

  // 步骤1: 获取当前购物车
  console.log('\n1️⃣ 获取当前购物车状态');
  let cart = await exampleGetMyCart();

  // 步骤2: 添加课程到购物车
  console.log('\n2️⃣ 添加课程到购物车');
  const courseId1 = 101; // 示例课程ID
  cart = await exampleAddCourseToCart(courseId1);

  // 步骤3: 再添加一个课程
  console.log('\n3️⃣ 添加第二个课程');
  const courseId2 = 102; // 示例课程ID
  cart = await exampleAddCourseToCart(courseId2);

  // 步骤4: 移除第一个课程
  console.log('\n4️⃣ 移除第一个课程');
  cart = await exampleRemoveCourseFromCart(courseId1);

  // 步骤5: 清空购物车
  console.log('\n5️⃣ 清空购物车');
  cart = await exampleClearCart();

  console.log('\n✅ 购物车操作流程完成');
  return cart;
}

// ==================== 6. 错误处理示例 ====================
export async function exampleErrorHandling() {
  console.log('=== 错误处理示例 ===');

  // 尝试添加不存在的课程
  console.log('\n1️⃣ 尝试添加不存在的课程');
  await exampleAddCourseToCart(99999);

  // 尝试移除不存在的课程
  console.log('\n2️⃣ 尝试移除不存在的课程');
  await exampleRemoveCourseFromCart(99999);

  // 尝试重复添加同一课程
  console.log('\n3️⃣ 尝试重复添加同一课程');
  const courseId = 101;
  await exampleAddCourseToCart(courseId);
  await exampleAddCourseToCart(courseId); // 应该返回错误

  console.log('\n✅ 错误处理示例完成');
}

// ==================== 7. 购物车数据分析和统计 ====================
export async function exampleCartAnalytics() {
  console.log('=== 购物车数据分析示例 ===');

  const cart = await exampleGetMyCart();
  if (!cart || !cart.cartItemList) {
    console.log('购物车为空，无法进行分析');
    return;
  }

  // 计算统计数据
  const totalItems = cart.cartItemList.length;
  const totalOriginalPrice = cart.cartItemList.reduce((sum, item) => sum + item.courseOriginalPrice, 0);
  const totalCurrentPrice = cart.cartItemList.reduce((sum, item) => sum + item.currentPrice, 0);
  const totalSavings = totalOriginalPrice - totalCurrentPrice;
  const averageDiscount = totalItems > 0 ? (totalSavings / totalOriginalPrice) * 100 : 0;

  // 按折扣率分组
  const discountGroups = cart.cartItemList.reduce((groups, item) => {
    const discount = Math.round(item.courseDiscount * 100);
    if (!groups[discount]) groups[discount] = [];
    groups[discount].push(item);
    return groups;
  }, {} as Record<number, CartItem[]>);

  console.log('📊 购物车统计:', {
    totalItems,
    totalOriginalPrice: `$${totalOriginalPrice.toFixed(2)}`,
    totalCurrentPrice: `$${totalCurrentPrice.toFixed(2)}`,
    totalSavings: `$${totalSavings.toFixed(2)}`,
    averageDiscount: `${averageDiscount.toFixed(1)}%`
  });

  console.log('🏷️ 按折扣率分组:');
  Object.entries(discountGroups).forEach(([discount, items]) => {
    console.log(`  ${discount}% 折扣: ${items.length} 个课程`);
  });

  return {
    totalItems,
    totalOriginalPrice,
    totalCurrentPrice,
    totalSavings,
    averageDiscount,
    discountGroups
  };
}

// ==================== 8. 批量操作示例 ====================
export async function exampleBatchOperations() {
  console.log('=== 批量操作示例 ===');

  const courseIds = [101, 102, 103, 104, 105]; // 示例课程ID列表

  console.log('\n1️⃣ 批量添加课程');
  const addPromises = courseIds.map(courseId =>
    cartApi.addCourseToCart(courseId).catch(err => {
      console.log(`添加课程 ${courseId} 失败:`, err);
      return null;
    })
  );

  const addResults = await Promise.allSettled(addPromises);
  const successCount = addResults.filter(result =>
    result.status === 'fulfilled' && result.value !== null
  ).length;

  console.log(`✅ 成功添加 ${successCount}/${courseIds.length} 个课程`);

  // 等待一下再获取购物车状态
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n2️⃣ 获取批量操作后的购物车状态');
  const cart = await exampleGetMyCart();

  console.log('\n3️⃣ 批量移除部分课程');
  const removeIds = courseIds.slice(0, 2); // 只移除前两个
  const removePromises = removeIds.map(courseId =>
    cartApi.removeCourseFromCart(courseId).catch(err => {
      console.log(`移除课程 ${courseId} 失败:`, err);
      return null;
    })
  );

  const removeResults = await Promise.allSettled(removePromises);
  const removeSuccessCount = removeResults.filter(result =>
    result.status === 'fulfilled' && result.value !== null
  ).length;

  console.log(`✅ 成功移除 ${removeSuccessCount}/${removeIds.length} 个课程`);

  return {
    addedCount: successCount,
    removedCount: removeSuccessCount,
    finalCart: cart
  };
}

// ==================== 导出所有示例函数 ====================
export const cartApiExamples = {
  getMyCart: exampleGetMyCart,
  addCourseToCart: exampleAddCourseToCart,
  removeCourseFromCart: exampleRemoveCourseFromCart,
  clearCart: exampleClearCart,
  completeWorkflow: exampleCompleteCartWorkflow,
  errorHandling: exampleErrorHandling,
  analytics: exampleCartAnalytics,
  batchOperations: exampleBatchOperations
};

// ==================== 使用说明 ====================
/*
使用示例:

1. 基本操作:
   import { cartApiExamples } from '@/api/examples/cart-api-examples';
   
   // 获取购物车
   await cartApiExamples.getMyCart();
   
   // 添加课程
   await cartApiExamples.addCourseToCart(101);
   
   // 移除课程
   await cartApiExamples.removeCourseFromCart(101);
   
   // 清空购物车
   await cartApiExamples.clearCart();

2. 完整流程:
   await cartApiExamples.completeWorkflow();

3. 错误处理:
   await cartApiExamples.errorHandling();

4. 数据分析:
   await cartApiExamples.analytics();

5. 批量操作:
   await cartApiExamples.batchOperations();
*/ 