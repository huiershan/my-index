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
                bvid: 'BV1Ut411e78m',
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
                bvid: 'BV1p94y1n7My',
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
                bvid: 'BV1Py4y1S7EF',
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
                bvid: 'BV1MJ411t7pT',
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

    // 根据菜名获取对应的食物图片
    getRecipeImage(name) {
        const imageMap = {
            '麻婆豆腐': 'https://images.unsplash.com/photo-1607690450124-f9058898845d?w=400&h=200&fit=crop',
            '煎鸡蛋': 'https://images.unsplash.com/photo-1603728034928-705f90a0a8d7?w=400&h=200&fit=crop',
            '西红柿炒鸡蛋': 'https://images.unsplash.com/photo-1603728034928-705f90a0a8d7?w=400&h=200&fit=crop',
            '红烧肉': 'https://images.unsplash.com/photo-1606471193077-7222d0f0c5c2?w=400&h=200&fit=crop',
            '紫菜蛋花汤': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop',
            '凉拌黄瓜': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
            '鱼香茄子': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
            '蛋炒饭': 'https://images.unsplash.com/photo-1603728034928-705f90a0a8d7?w=400&h=200&fit=crop',
            '水煮鱼': 'https://images.unsplash.com/photo-1606471193077-7222d0f0c5c2?w=400&h=200&fit=crop',
            '宫保鸡丁': 'https://images.unsplash.com/photo-1603728034928-705f90a0a8d7?w=400&h=200&fit=crop'
        };
        
        // 如果找不到特定图片，使用默认的美食图片
        return imageMap[name] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop';
    }

    // 根据菜名获取图标
    getRecipeIcon(name) {
        const iconMap = {
            '豆腐': 'fa-cube',
            '鸡蛋': 'fa-egg',
            '西红柿': 'fa-apple-alt',
            '肉': 'fa-drumstick-bite',
            '汤': 'fa-mug-hot',
            '凉拌': 'fa-seedling',
            '炒': 'fa-fire',
            '煮': 'fa-water'
        };
        
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (name.includes(keyword)) return icon;
        }
        return 'fa-utensils';
    }

    // 创建菜谱卡片 - 增强版
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        // 获取对应的美食图片
        const imageUrl = this.getRecipeImage(recipe.name);
        
        card.innerHTML = `
            <div class="recipe-image" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${imageUrl}')">
                <div class="image-overlay">
                    <i class="fas ${this.getRecipeIcon(recipe.name)} recipe-icon"></i>
                    <div class="cook-effect">
                        <span class="steam"> steam </span>
                        <span class="bubble"> bubble </span>
                    </div>
                </div>
                <div class="recipe-badge">
                    <span class="difficulty-badge difficulty-${recipe.difficulty.level}">
                        ${recipe.difficulty.text}
                    </span>
                </div>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span class="recipe-time">
                        <i class="fas fa-clock"></i> ${recipe.cookTime}分钟
                    </span>
                    <span class="recipe-likes">
                        <i class="fas fa-heart"></i> ${Math.floor(Math.random() * 500 + 100)}
                    </span>
                </div>
                <div class="recipe-description">
                    经典家常菜，香气扑鼻，制作简单
                </div>
            </div>
        `;
        
        // 添加悬停效果
        card.addEventListener('mouseenter', () => {
            card.querySelector('.recipe-image').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.recipe-image').style.transform = 'scale(1)';
        });
        
        card.addEventListener('click', () => this.showRecipeDetail(recipe));
        return card;
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

    // 加载B站视频 - 增强版
    loadVideo(bvid) {
        const container = document.getElementById('videoContainer');
        
        // B站视频嵌入配置
        const videoConfig = {
            bvid: bvid,
            page: 1,
            high_quality: 1,
            danmaku: 0, // 默认关闭弹幕
            autoplay: 0 // 默认不自动播放
        };
        
        // 构建B站播放器URL
        const buildVideoUrl = (config) => {
            return `//player.bilibili.com/player.html?` + 
                   `bvid=${config.bvid}&` +
                   `page=${config.page}&` +
                   `high_quality=${config.high_quality}&` +
                   `danmaku=${config.danmaku}&` +
                   `autoplay=${config.autoplay}`;
        };
        
        const videoUrl = buildVideoUrl(videoConfig);
        
        container.innerHTML = `
            <div class="bilibili-player-wrapper">
                <div class="bilibili-brand">B站视频</div>
                <div class="video-loading" id="videoLoading">
                    <i class="fas fa-spinner"></i>
                    <span>正在加载视频...</span>
                </div>
                <iframe 
                    src="${videoUrl}"
                    scrolling="no" 
                    border="0" 
                    frameborder="no" 
                    framespacing="0" 
                    allowfullscreen="true"
                    loading="lazy"
                    onload="document.getElementById('videoLoading').style.display='none'">
                </iframe>
                <div class="video-controls">
                    <button class="control-btn" onclick="toggleDanmaku('${bvid}')">
                        <i class="fas fa-comment-dots"></i> <span id="danmakuText">开启弹幕</span>
                    </button>
                    <button class="control-btn" onclick="changeQuality('${bvid}')">
                        <i class="fas fa-hd"></i> <span id="qualityText">高清</span>
                    </button>
                    <button class="control-btn" onclick="shareToBilibili('${bvid}')">
                        <i class="fas fa-share-alt"></i> 分享
                    </button>
                    <button class="control-btn" onclick="window.open('https://www.bilibili.com/video/${bvid}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> 原站观看
                    </button>
                </div>
            </div>
        `;
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.recipeManager = new RecipeManager();
});

// 全局函数用于视频控制
function toggleDanmaku(bvid) {
    const danmakuBtn = document.getElementById('danmakuText');
    const iframe = document.querySelector('.bilibili-player-wrapper iframe');
    
    if (danmakuBtn.textContent === '开启弹幕') {
        danmakuBtn.textContent = '关闭弹幕';
        iframe.src = iframe.src.replace('danmaku=0', 'danmaku=1');
    } else {
        danmakuBtn.textContent = '开启弹幕';
        iframe.src = iframe.src.replace('danmaku=1', 'danmaku=0');
    }
}

function changeQuality(bvid) {
    const qualityBtn = document.getElementById('qualityText');
    const iframe = document.querySelector('.bilibili-player-wrapper iframe');
    
    if (qualityBtn.textContent === '高清') {
        qualityBtn.textContent = '标清';
        iframe.src = iframe.src.replace('high_quality=1', 'high_quality=0');
    } else {
        qualityBtn.textContent = '高清';
        iframe.src = iframe.src.replace('high_quality=0', 'high_quality=1');
    }
}

function shareToBilibili(bvid) {
    const shareUrl = `https://www.bilibili.com/video/${bvid}`;
    if (navigator.share) {
        navigator.share({
            title: '推荐这个美食教程',
            url: shareUrl
        }).catch(console.error);
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('链接已复制到剪贴板！');
        }).catch(() => {
            prompt('复制下面的链接分享:', shareUrl);
        });
    }
}
