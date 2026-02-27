// 模拟厨房类
class VirtualKitchen {
    constructor() {
        this.currentRecipe = null;
    }

    // 加载菜谱
    async loadRecipe(recipeKey) {
        try {
            const response = await fetch('recipes.json');
            const data = await response.json();
            const recipe = data[recipeKey];

            if (!recipe) {
                alert("菜谱未找到！");
                return;
            }

            this.currentRecipe = recipe;
            this.displayIngredients(recipe.ingredients);
            this.displaySteps(recipe.steps);
            this.loadBilibiliVideo(recipe.bvid);
        } catch (error) {
            console.error("加载菜谱失败:", error);
            alert("菜谱加载失败，请刷新重试。");
        }
    }

    // 显示食材（可拖拽）
    displayIngredients(ingredients) {
        const bin = document.getElementById('ingredients');
        bin.innerHTML = '';
        ingredients.forEach(ing => {
            const div = document.createElement('div');
            div.className = 'item';
            div.draggable = true;
            div.textContent = ing;
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ing);
            });
            bin.appendChild(div);
        });
    }

    // 显示步骤
    displaySteps(steps) {
        const stepsEl = document.getElementById('steps');
        stepsEl.innerHTML = '<h3>制作步骤：</h3><ol>';
        steps.forEach(step => {
            stepsEl.innerHTML += `<li>${step}</li>`;
        });
        stepsEl.innerHTML += '</ol>';
    }

    // 加载B站视频
    loadBilibiliVideo(bvid) {
        const videoEl = document.getElementById('videoPlayer');
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
                style="width: 100%; height: 300px;">
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

// 页面加载完成后初始化（可选：初始化操作台拖拽事件）
document.addEventListener('DOMContentLoaded', () => {
    const cookingArea = document.getElementById('cookingArea');
    
    cookingArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    cookingArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const ingredient = e.dataTransfer.getData('text/plain');
        const p = document.createElement('p');
        p.textContent = `🍳 加入了：${ingredient}`;
        cookingArea.appendChild(p);
    });
});