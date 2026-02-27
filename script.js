// --- 修改点 1: 直接把数据写在这里，不再需要 fetch 读取外部文件 ---
const recipesData = {
  "ma_po_tofu": {
    "name": "麻婆豆腐",
    "ingredients": ["豆腐", "牛肉末", "豆瓣酱", "花椒", "蒜末", "姜末"],
    "steps": [
      "1. 豆腐切块焯水。",
      "2. 热油炒香豆瓣酱和姜蒜末。",
      "3. 加入牛肉末炒熟。",
      "4. 加水煮开，放入豆腐。",
      "5. 勾芡，撒上花椒粉出锅。"
    ],
    "bvid": "BV1xx411c7B8" 
  },
  "fried_egg": {
    "name": "煎鸡蛋",
    "ingredients": ["鸡蛋", "食用油", "盐"],
    "steps": [
      "1. 热锅倒油。",
      "2. 打入鸡蛋。",
      "3. 小火煎至蛋白凝固。",
      "4. 撒盐出锅。"
    ],
    "bvid": "BV1XJ41157zR"
  }
};

// 模拟厨房类
class VirtualKitchen {
    constructor() {
        this.currentRecipe = null;
    }

    // --- 修改点 2: 移除 async 和 fetch，直接使用本地变量 ---
    loadRecipe(recipeKey) {
        // 直接从内存变量获取数据
        const recipe = recipesData[recipeKey];

        if (!recipe) {
            console.error("未找到菜谱:", recipeKey);
            alert("菜谱未找到！请检查代码中的菜谱键名。");
            return;
        }

        this.currentRecipe = recipe;
        this.displayIngredients(recipe.ingredients);
        this.displaySteps(recipe.steps);
        this.loadBilibiliVideo(recipe.bvid);
    }

    // 显示食材（可拖拽）
    displayIngredients(ingredients) {
        const bin = document.getElementById('ingredients');
        if (!bin) return; // 防止元素未找到报错
        bin.innerHTML = '';
        ingredients.forEach(ing => {
            const div = document.createElement('div');
            div.className = 'item';
            div.draggable = true;
            div.textContent = ing;
            // 兼容移动端触摸事件 (可选优化)
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ing);
            });
            bin.appendChild(div);
        });
    }

    // 显示步骤
    displaySteps(steps) {
        const stepsEl = document.getElementById('steps');
        if (!stepsEl) return;
        stepsEl.innerHTML = '<h3>制作步骤：</h3><ol>';
        steps.forEach(step => {
            stepsEl.innerHTML += `<li>${step}</li>`;
        });
        stepsEl.innerHTML += '</ol>';
    }

    // 加载B站视频
    loadBilibiliVideo(bvid) {
        const videoEl = document.getElementById('videoPlayer');
        if (!videoEl) return;
        // 使用B站的iframe嵌入方式
        videoEl.innerHTML = `
            <h3>观看教学视频：</h3>
            <iframe 
                src="//player.bilibili.com/player.html?bvid=${bvid}&page=1" 
                scrolling="no" 
                border="0" 
                frameborder="no" 
                framespacing="0" 
                allowfullscreen="true" 
                style="width: 100%; height: 300px; border-radius: 8px;">
            </iframe>
        `;
    }
}

// 初始化厨房
const kitchen = new VirtualKitchen();

// 暴露给HTML的全局函数
function loadRecipe(recipeKey) {
    kitchen.loadRecipe(recipeKey);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const cookingArea = document.getElementById('cookingArea');
    
    if (cookingArea) {
        cookingArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        cookingArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const ingredient = e.dataTransfer.getData('text/plain');
            if (ingredient) {
                const p = document.createElement('p');
                p.textContent = `🍳 加入了：${ingredient}`;
                // 添加一个小动画类
                p.style.animation = "popIn 0.3s ease-out"; 
                cookingArea.appendChild(p);
            }
        });
    }
});
