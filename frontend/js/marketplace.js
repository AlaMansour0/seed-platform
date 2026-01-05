// API URL
const API_URL = 'http://localhost:5000/api';

// متغيرات عامة
let allProducts = [];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts();
    setupFormSubmit();
    
    // التحقق من وجود معرف منتج في الرابط
    const hash = window.location.hash;
    if (hash.startsWith('#product-')) {
        const productId = hash.replace('#product-', '');
        showProductDetails(productId);
    }
});

// تحميل جميع المنتجات
async function loadAllProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        
        displayProducts(allProducts);
        updateProductsCount(allProducts.length);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showMessage('❌ حدث خطأ في تحميل المنتجات', 'error');
    }
}

// عرض المنتجات
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    const noProductsDiv = document.getElementById('noProducts');
    
    if (products.length === 0) {
        container.innerHTML = '';
        noProductsDiv.style.display = 'block';
        return;
    }
    
    noProductsDiv.style.display = 'none';
    
    let html = '';
    
    products.forEach(product => {
        const typeIcons = {
            seeds: '🌱',
            seedlings: '🪴',
            produce: '🍅',
            tools: '🛠️'
        };
        
        const defaultImage = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop';
        
        html += `
            <div class="product-card" data-id="${product._id}" data-city="${product.city}" data-type="${product.type}">
                <div class="product-image">
                    <img src="${product.imageUrl || defaultImage}" alt="${product.name}" 
                         onerror="this.src='${defaultImage}'">
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <span class="product-type">${typeIcons[product.type] || ''} ${getTypeArabic(product.type)}</span>
                        <span class="product-city">📍 ${product.city}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description || 'لا يوجد وصف متاح'}</p>
                    <div class="product-footer">
                        <span class="product-price">💰 ${product.price}</span>
                        <div class="product-actions">
                            <span class="product-contact">📞 ${product.contact}</span>
                            <button class="btn-small" onclick="showProductDetails('${product._id}')">
                                <i class="fas fa-info-circle"></i> تفاصيل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// فلترة المنتجات
function filterProducts() {
    const city = document.getElementById('cityFilter').value;
    const type = document.getElementById('typeFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredProducts = allProducts;
    
    // فلترة حسب المدينة
    if (city) {
        filteredProducts = filteredProducts.filter(p => p.city === city);
    }
    
    // فلترة حسب النوع
    if (type) {
        filteredProducts = filteredProducts.filter(p => p.type === type);
    }
    
    // فلترة حسب البحث
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description?.toLowerCase().includes(search) ||
            p.city.toLowerCase().includes(search)
        );
    }
    
    displayProducts(filteredProducts);
    updateProductsCount(filteredProducts.length);
}

// تحديث عدد المنتجات
function updateProductsCount(count) {
    document.getElementById('productsCount').textContent = count;
}

// إعداد إرسال النموذج
function setupFormSubmit() {
    const form = document.getElementById('productForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // جمع البيانات
        const formData = {
            name: document.getElementById('name').value.trim(),
            type: document.getElementById('type').value,
            description: document.getElementById('description').value.trim(),
            price: document.getElementById('price').value.trim(),
            city: document.getElementById('city').value.trim(),
            imageUrl: document.getElementById('imageUrl').value.trim(),
            contact: document.getElementById('contact').value.trim()
        };
        
        // التحقق من البيانات
        if (!validateForm(formData)) {
            return;
        }
        
        // إرسال البيانات
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('✅ تمت إضافة المنتج بنجاح!', 'success');
                form.reset();
                hideAddProductForm();
                
                // إعادة تحميل المنتجات
                loadAllProducts();
                
            } else {
                showMessage(`❌ ${data.error || 'حدث خطأ في الإرسال'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('❌ خطأ في الاتصال بالخادم', 'error');
        }
    });
}

// التحقق من صحة البيانات
function validateForm(data) {
    if (!data.name || data.name.length < 3) {
        showMessage('⚠️ اسم المنتج يجب أن يكون 3 أحرف على الأقل', 'warning');
        return false;
    }
    
    if (!data.type) {
        showMessage('⚠️ يرجى اختيار نوع المنتج', 'warning');
        return false;
    }
    
    if (!data.price) {
        showMessage('⚠️ يرجى تحديد السعر أو الحالة', 'warning');
        return false;
    }
    
    if (!data.city || data.city.length < 2) {
        showMessage('⚠️ المدينة مطلوبة', 'warning');
        return false;
    }
    
    if (!data.contact || data.contact.length < 3) {
        showMessage('⚠️ طريقة التواصل مطلوبة', 'warning');
        return false;
    }
    
    return true;
}

// عرض تفاصيل المنتج
function showProductDetails(productId) {
    const product = allProducts.find(p => p._id === productId);
    
    if (!product) {
        alert('المنتج غير موجود');
        return;
    }
    
    const modalHtml = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${product.name}</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop'}" 
                         alt="${product.name}">
                    <div class="product-details">
                        <p><strong>النوع:</strong> ${getTypeArabic(product.type)}</p>
                        <p><strong>المدينة:</strong> ${product.city}</p>
                        <p><strong>السعر/الحالة:</strong> ${product.price}</p>
                        <p><strong>طريقة التواصل:</strong> ${product.contact}</p>
                        <p><strong>الوصف:</strong></p>
                        <p>${product.description || 'لا يوجد وصف'}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="contactSeller('${product.contact}')">
                        <i class="fas fa-comment"></i> تواصل مع البائع
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إنشاء وعرض المودال
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
    
    // إضافة تنسيقات المودال
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-body img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .product-details p {
            margin-bottom: 10px;
        }
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// إغلاق المودال
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// الاتصال مع البائع
function contactSeller(contact) {
    alert(`طريقة التواصل: ${contact}\n\nيمكنك التواصل عبر البريد أو الرقم المذكور`);
}

// عرض نموذج إضافة المنتج
function showAddProductForm() {
    document.getElementById('addProductSection').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// إخفاء نموذج إضافة المنتج
function hideAddProductForm() {
    document.getElementById('addProductSection').style.display = 'none';
    document.getElementById('productForm').reset();
}

// عرض الرسائل
function showMessage(text, type) {
    const messageEl = document.getElementById('formMessage');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 5000);
}

// تحويل النوع إلى عربي
function getTypeArabic(type) {
    const types = {
        seeds: 'بذور',
        seedlings: 'شتلات',
        produce: 'منتج زراعي',
        tools: 'أدوات'
    };
    return types[type] || type;
}