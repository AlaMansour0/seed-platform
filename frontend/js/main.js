// API URL
//const API_URL = 'http://localhost:5000/api';
const API_URL = window.location.origin + '/api';
// تحميل آخر المنتجات في الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('latestProducts')) {
        loadLatestProducts();
    }
    
    // تحميل عدد المنتجات من السوق
    loadMarketplaceStats();
});

// دالة تحميل آخر 4 منتجات
async function loadLatestProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const latestProducts = products.slice(0, 4);
        const productsGrid = document.getElementById('latestProducts');
        
        if (latestProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">لا توجد منتجات متاحة حالياً</p>';
            return;
        }
        
        productsGrid.innerHTML = '';
        
        latestProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('Error loading latest products:', error);
        document.getElementById('latestProducts').innerHTML = 
            '<p class="error">حدث خطأ في تحميل المنتجات</p>';
    }
}

// دالة إنشاء بطاقة منتج
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    
    const typeIcons = {
        seeds: '🌱 بذور',
        seedlings: '🪴 شتلات',
        produce: '🍅 منتج زراعي',
        tools: '🛠️ أدوات'
    };
    
    const defaultImage = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop';
    
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.imageUrl || defaultImage}" alt="${product.name}">
        </div>
        <div class="product-content">
            <div class="product-header">
                <span class="product-type">${typeIcons[product.type] || product.type}</span>
                <span class="product-city">📍 ${product.city}</span>
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description || 'لا يوجد وصف متاح'}</p>
            <div class="product-footer">
                <span class="product-price">${product.price}</span>
                <span class="product-contact">📧 ${product.contact}</span>
            </div>
        </div>
    `;
    
    // إضافة تأثير عند النقر
    div.addEventListener('click', function() {
        window.location.href = `marketplace.html#product-${product._id}`;
    });
    
    return div;
}

// دالة تحميل إحصاءات السوق (اختياري)
async function loadMarketplaceStats() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        // يمكن تحديث الإحصاءات في الصفحة إذا كان هناك عناصر لعرضها
        const cities = [...new Set(products.map(p => p.city))];
        
        console.log(`إجمالي المنتجات: ${products.length}`);
        console.log(`عدد المدنين: ${cities.length}`);
        
    } catch (error) {
        console.error('Error loading marketplace stats:', error);
    }
}

// دالة للتحقق من حالة الخادم
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('✅ Server status:', data);
        return true;
    } catch (error) {
        console.warn('⚠️ Server is not responding');
        return false;
    }
}

// تحقق من حالة الخادم عند تحميل الصفحة
checkServerStatus();
