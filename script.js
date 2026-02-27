// 菜谱数据管理类
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentRecipe = null;
        this.init();
    }

    async init() {
        await this.loadRecipes();
        this.bindEvents();
        this.renderRecipes();
    }

    // 加载菜谱数据
    async loadRecipes() {
        try {
            const response = await fetch('recipes.json');
            const data = await response.json();
            
            // 转换数据格式并添加分类信息
            this.recipes = Object.entries(data).map(([key, recipe]) => ({
                id: key,
                ...recipe,
                category: this.getCategory(recipe.name),
                difficulty: this.getDifficulty(recipe.ingredients.length),
                cookTime: this.getCookTime(recipe.steps.length)
            }));
            
            this.filteredRecipes = [...this.recipes];
        } catch (error) {
            console.error('加载菜谱失败:', error);
            // 使用默认菜谱数据
            this.recipes = this.getDefaultRecipes();
            this.filteredRecipes = [...this.recipes];
        }
    }

    // 根据菜名自动分类
    getCategory(name) {
        const meatKeywords = ['鸡', '鸭', '猪', '牛', '羊', '鱼', '虾', '蟹', '肉'];
        const vegetableKeywords = ['青菜', '白菜', '萝卜', '土豆', '番茄', '黄瓜', '茄子', '豆角'];
        const soupKeywords = ['汤', '羹', '粥'];
        const dessertKeywords = ['蛋糕', '饼干', '布丁', '慕斯', '冰淇淋'];

        if (meatKeywords.some(keyword => name.includes(keyword))) return 'meat';
        if (vegetableKeywords.some(keyword => name.includes(keyword))) return 'vegetable';
        if (soupKeywords.some(keyword => name.includes(keyword))) return 'soup';
        if (dessertKeywords.some(keyword => name.includes(keyword))) return 'dessert';
        
        return 'simple'; // 默认为快手菜
    }

    // 根据食材数量判断难度
    getDifficulty(ingredientCount) {
        if (ingredientCount <= 3) return { level: 'easy', text: '简单' };
        if (ingredientCount <= 5) return { level: 'medium', text: '中等' };
        return { level: 'hard', text: '困难' };
    }

    // 根据步骤数量估算时间
    getCookTime(stepCount) {
        return stepCount * 5 + 10; // 每步5分钟 + 准备时间10分钟
    }

    // 默认菜谱数据
    getDefaultRecipes() {
        return [
            {
                id: 'ma_po_tofu',
                name: '麻婆豆腐',
                ingredients: ['豆腐', '牛肉末', '豆瓣酱', '花椒', '蒜末', '姜末'],
                steps: [
                    '豆腐切块焯水备用',
                    '热油炒香豆瓣酱和姜蒜末',
                    '加入牛肉末炒至变色',
                    '加水煮开后放入豆腐',
                    '勾芡收汁，撒上花椒粉出锅'
                ],
                bvid: 'BV1xx411c7B8',
                category: 'meat',
                difficulty: { level: 'medium', text: '中等' },
                cookTime: 25
            },
            {
                id: 'fried_egg',
                name: '煎鸡蛋',
                ingredients: ['鸡蛋', '食用油', '盐'],
                steps: [
                    '热锅倒入适量食用油',
                    '打入鸡蛋，保持中小火',
                    '待蛋白凝固后撒少许盐',
                    '煎至喜欢的熟度即可出锅'
                ],
                bvid: 'BV1XJ41157zR',
                category: 'simple',
                difficulty: { level: 'easy', text: '简单' },
                cookTime: 10
            },
            {
                name: '西红柿炒鸡蛋',
                ingredients: ['西红柿', '鸡蛋', '葱花', '盐', '糖'],
                steps: [
                    '鸡蛋打散加少许盐，炒熟盛起',
                    '西红柿切块备用',
                    '热油爆香葱花',
                    '下西红柿炒软出汁',
                    '倒入炒好的鸡蛋，调味翻炒均匀'
                ],
                bvid: 'BV1xK4y1C7mT',
                category: 'vegetable',
                difficulty: { level: 'easy', text: '简单' },
                cookTime: 15
            },
            {
                name: '红烧肉',
                ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒', '姜片', '八角'],
                steps: [
                    '五花肉切块焯水去腥',
                    '热锅下冰糖炒糖色',
                    '下肉块翻炒上色',
                    '加调料和适量水',
                    '小火炖煮40分钟至软烂'
                ],
                bvid: 'BV1Js411V7hQ',
                category: 'meat',
                difficulty: { level: 'medium', text: '中等' },
                cookTime: 60
            },
            {
                name: '紫菜蛋花汤',
                ingredients: ['紫菜', '鸡蛋', '香油', '盐', '葱花'],
                steps: [
                    '水烧开放入紫菜',
                    '鸡蛋打散慢慢倒入锅中',
                    '用筷子轻轻搅拌形成蛋花',
                    '加盐调味，撒葱花',
                    '淋香油即可'
                ],
                bvid: 'BV1GJ411L7vD',
                category: 'soup',
                difficulty: { level: 'easy', text: '简单' },
                cookTime: 10
            },
            {
                name: '凉拌黄瓜',
                ingredients: ['黄瓜', '蒜末', '生抽', '醋', '香油', '辣椒油'],
                steps: [
                    '黄瓜拍碎切段',
                    '蒜末捣成泥',
                    '调制料汁：生抽、醋、香油、辣椒油',
                    '将料汁倒入黄瓜中拌匀',
                    '腌制10分钟后即可食用'
                ],
                bvid: 'BV1bJ411o7mN',
                category: 'vegetable',
                difficulty: { level: 'easy', text: '简单' },
                cookTime: 15
            }
        ];
    }

    // 绑定事件监听器
    bindEvents() {
        // 分类标签点击事件
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                this.filterRecipes(category);
            });
        });

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchBtn.addEventListener('click', () => this.searchRecipes(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchRecipes(searchInput.value);
        });

        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.hideRecipeDetail();
        });
    }

    // 筛选菜谱
    filterRecipes(category) {
        if (category === 'all') {
            this.filteredRecipes = [...this.recipes];
        } else if (category === 'hot') {
            // 热门菜谱（模拟）
            this.filteredRecipes = this.recipes.slice(0, 4);
        } else {
            this.filteredRecipes = this.recipes.filter(recipe => recipe.category === category);
        }
        this.renderRecipes();
    }

    // 搜索菜谱
    searchRecipes(keyword) {
        if (!keyword.trim()) {
            this.filteredRecipes = [...this.recipes];
        } else {
            const lowerKeyword = keyword.toLowerCase();
            this.filteredRecipes = this.recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(lowerKeyword) ||
                recipe.ingredients.some(ing => ing.includes(keyword))
            );
        }
        this.renderRecipes();
    }

    // 渲染菜谱网格
    renderRecipes() {
        const grid = document.getElementById('recipesGrid');
        grid.innerHTML = '';
        
        if (this.filteredRecipes.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x" style="color: #ccc;"></i>
                    <p>没有找到相关菜谱</p>
                </div>
            `;
            return;
        }

        this.filteredRecipes.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            grid.appendChild(card);
        });
    }

    // 创建菜谱卡片
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-image">
                <i class="fas ${this.getRecipeIcon(recipe.name)}"></i>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span class="recipe-difficulty difficulty-${recipe.difficulty.level}">
                        <i class="fas fa-signal"></i> ${recipe.difficulty.text}
                    </span>
                    <span><i class="fas fa-clock"></i> ${recipe.cookTime}分钟</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.showRecipeDetail(recipe));
        return card;
    }

    // 根据菜名获取图标
    getRecipeIcon(name) {
        const iconMap = {
            '豆腐': 'fa-cube',
            '鸡蛋': 'fa-egg',
            '西红柿': 'fa-apple-alt',
            '肉': 'fa-drumstick-bite',
            '汤': 'fa-mug-hot',
            '凉拌': 'fa-seedling'
        };
        
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (name.includes(keyword)) return icon;
        }
        return 'fa-utensils';
    }

    // 显示菜谱详情
    showRecipeDetail(recipe) {
        this.currentRecipe = recipe;
        document.getElementById('recipeTitle').textContent = recipe.name;
        
        // 渲染食材列表
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = recipe.ingredients.map(ing => 
            `<div class="ingredient-item">${ing}</div>`
        ).join('');
        
        // 渲染步骤列表
        const stepsList = document.getElementById('stepsList');
        stepsList.innerHTML = recipe.steps.map((step, index) => `
            <div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step}</div>
            </div>
        `).join('');
        
        // 加载视频
        this.loadVideo(recipe.bvid);
        
        // 显示详情页面
        document.getElementById('recipeDetail').style.display = 'block';
        document.querySelector('.recipes-grid').style.display = 'none';
        document.querySelector('.category-nav').style.display = 'none';
    }

    // 隐藏菜谱详情
    hideRecipeDetail() {
        document.getElementById('recipeDetail').style.display = 'none';
        document.querySelector('.recipes-grid').style.display = 'grid';
        document.querySelector('.category-nav').style.display = 'block';
        this.currentRecipe = null;
    }

    // 加载B站视频
    loadVideo(bvid) {
        const container = document.getElementById('videoContainer');
        container.innerHTML = `
            <iframe 
                src="//player.bilibili.com/player.html?bvid=${bvid}&page=1" 
                scrolling="no" 
                border="0" 
                frameborder="no" 
                framespacing="0" 
                allowfullscreen="true">
            </iframe>
        `;
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.recipeManager = new RecipeManager();
});