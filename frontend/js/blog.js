// API URL
//const API_URL = 'http://localhost:5000/api';
const API_URL = window.location.origin + '/api';
// متغيرات عامة
let allPosts = [];
let currentFilter = 'all';
let currentSort = 'newest';

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupPostForm();
    setupEventListeners();
    
    // تحقق من وجود معلمة في الرابط
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showForm') === 'true') {
        togglePostForm();
    }
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر مشاركة تجربة في الهيدر
    const shareBtn = document.querySelector('.nav-actions .btn-primary');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePostForm();
        });
    }
    
    // زر إغلاق النموذج
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePostForm();
        });
    }
}

// تحميل التدوينات من الخادم
async function loadBlogPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
            throw new Error('فشل في تحميل البيانات');
        }
        allPosts = await response.json();
        
        displayPosts(allPosts);
        updatePostsCount(allPosts.length);
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showPostMessage('❌ حدث خطأ في تحميل التجارب', 'error');
        
        // استخدام بيانات تجريبية إذا فشل الاتصال
        loadSamplePosts();
    }
}

// تحميل بيانات تجريبية (للاختبار)
function loadSamplePosts() {
    allPosts = [
        {
            _id: '1',
            title: 'تجربتي الناجحة مع زراعة الطماطم في الصيف',
            author: 'أحمد محمد',
            plantType: 'طماطم',
            experienceType: 'success',
            content: 'لطالما سمعت أن زراعة الطماطم في الصيف صعبة، ولكن قررت التجربة. قمت بزراعة الطماطم في مكان مظلل جزئياً واستخدمت نظام ري بالتنقيط. النتيجة كانت مذهلة! حصلت على إنتاج وفير ورائع الجودة.',
            likes: 24,
            imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
            createdAt: '2024-01-15T10:30:00Z'
        },
        {
            _id: '2',
            title: 'كيف أنقذت نباتاتي من الذبول في الحر',
            author: 'سارة الخالد',
            plantType: 'نعناع',
            experienceType: 'tip',
            content: 'اكتشفت أن ري النباتات في الصباح الباكر وتغطية التربة بالقش يقلل من تبخر الماء بنسبة 40%. هذه النصيحة أنقذت حديقتي الصغيرة خلال موجة الحر الأخيرة.',
            likes: 18,
            imageUrl: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&h=400&fit=crop',
            createdAt: '2024-01-10T14:20:00Z'
        },
        {
            _id: '3',
            title: 'درس قاسي: لا تفرط في ري النباتات',
            author: 'خالد الفهد',
            plantType: 'ريحان',
            experienceType: 'failure',
            content: 'كنت أعتقد أن المزيد من الماء يعني نباتات أفضل. ولكن اكتشفت أن الإفراط في الري يؤدي إلى تعفن الجذور. فقدت 5 نباتات من الريحان قبل أن أتعلم الدرس.',
            likes: 12,
            imageUrl: 'https://images.unsplash.com/photo-1562123287-5d2d69e09a13?w=600&h=400&fit=crop',
            createdAt: '2024-01-05T09:15:00Z'
        },
        {
            _id: '4',
            title: 'أفضل تربة للزراعة المنزلية في الرياض',
            author: 'فاطمة العتيبي',
            plantType: 'متنوع',
            experienceType: 'tip',
            content: 'بعد تجربة عدة أنواع، وجدت أن خليط من تربة الحدائق مع البيرلايت والكومبوست يعطي أفضل النتائج. التربة تصبح خفيفة وجيدة التصريف ومناسبة للمناخ الجاف.',
            likes: 31,
            imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
            createdAt: '2023-12-28T16:45:00Z'
        },
        {
            _id: '5',
            title: 'كيف أبدأ بمشروع زراعة مائية صغير؟',
            author: 'محمد الشمري',
            plantType: 'خس',
            experienceType: 'question',
            content: 'أرغب في تجربة الزراعة المائية في منزلي ولكن لا أعرف من أين أبدأ. هل هناك نظام بسيط ومناسب للمبتدئين؟ وما هي التكاليف المتوقعة؟',
            likes: 8,
            imageUrl: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abb?w=600&h=400&fit=crop',
            createdAt: '2023-12-20T11:30:00Z'
        },
        {
            _id: '6',
            title: 'مراجعة: أضواء LED للزراعة الداخلية',
            author: 'نورة القحطاني',
            plantType: 'أعشاب',
            experienceType: 'review',
            content: 'اشتريت نظام إضاءة LED خاص بالزراعة الداخلية. بعد 3 أشهر من الاستخدام، أستطيع القول أنه استثمار ممتاز. النباتات تنمو بسرعة وصحية حتى في فصل الشتاء.',
            likes: 15,
            imageUrl: 'https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4c?w=600&h=400&fit=crop',
            createdAt: '2023-12-15T13:20:00Z'
        }
    ];
    
    displayPosts(allPosts);
    updatePostsCount(allPosts.length);
}

// عرض التدوينات
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const noPostsDiv = document.getElementById('noPosts');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '';
        noPostsDiv.style.display = 'block';
        return;
    }
    
    noPostsDiv.style.display = 'none';
    
    let html = '';
    
    posts.forEach(post => {
        const badgeInfo = getBadgeInfo(post.experienceType);
        const date = new Date(post.createdAt).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // تقصير المحتوى
        const shortContent = post.content.length > 150 ? 
            post.content.substring(0, 150) + '...' : post.content;
        
        html += `
            <div class="post-card" data-type="${post.experienceType}" data-plant="${post.plantType || ''}">
                <div class="post-header">
                    <span class="post-badge ${badgeInfo.class}">
                        ${badgeInfo.icon} ${badgeInfo.text}
                    </span>
                    <div class="post-date">
                        <i class="far fa-calendar"></i> ${date}
                    </div>
                </div>
                
                <div class="post-body">
                    <h3 class="post-title">${post.title}</h3>
                    
                    <div class="post-meta">
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${post.author}</span>
                        </div>
                        ${post.plantType ? `
                        <div class="meta-item">
                            <i class="fas fa-leaf"></i>
                            <span>${post.plantType}</span>
                        </div>` : ''}
                    </div>
                    
                    <p class="post-excerpt">${shortContent}</p>
                    
                    ${post.imageUrl ? `
                    <div class="post-image">
                        <img src="${post.imageUrl}" alt="${post.title}" 
                             onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'">
                    </div>` : ''}
                </div>
                
                <div class="post-footer">
                    <div class="post-likes">
                        <button class="like-btn" onclick="likePost('${post._id}', this)">
                            <i class="far fa-heart"></i>
                            <span class="like-count">${post.likes || 0}</span>
                        </button>
                    </div>
                    <button class="read-more" onclick="showFullPost('${post._id}')">
                        <i class="fas fa-book-open"></i> اقرأ المزيد
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// الحصول على معلومات البادج حسب نوع التجربة
function getBadgeInfo(type) {
    const badges = {
        success: { icon: '🎉', text: 'قصة نجاح', class: 'badge-success' },
        tip: { icon: '💡', text: 'نصيحة مفيدة', class: 'badge-tip' },
        failure: { icon: '📚', text: 'درس مستفاد', class: 'badge-failure' },
        question: { icon: '❓', text: 'سؤال للمجتمع', class: 'badge-question' },
        review: { icon: '⭐', text: 'مراجعة', class: 'badge-tip' }
    };
    
    return badges[type] || badges.tip;
}

// تحديث عدد التجارب
function updatePostsCount(count) {
    const countElement = document.getElementById('postsCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// فلترة التجارب
function filterPosts() {
    const category = document.getElementById('postCategory').value;
    const plant = document.getElementById('plantFilter').value;
    const search = document.getElementById('postSearch').value.toLowerCase();
    
    let filteredPosts = allPosts;
    
    // فلترة حسب التصنيف
    if (category) {
        filteredPosts = filteredPosts.filter(post => post.experienceType === category);
    }
    
    // فلترة حسب النبات
    if (plant) {
        filteredPosts = filteredPosts.filter(post => post.plantType === plant);
    }
    
    // فلترة حسب البحث
    if (search) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(search) ||
            post.content.toLowerCase().includes(search) ||
            post.author.toLowerCase().includes(search)
        );
    }
    
    displayPosts(filteredPosts);
    updatePostsCount(filteredPosts.length);
}

// ترتيب التجارب
function sortPosts() {
    const sortBy = document.getElementById('sortPosts').value;
    
    let sortedPosts = [...allPosts];
    
    switch(sortBy) {
        case 'newest':
            sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'popular':
            sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
    }
    
    displayPosts(sortedPosts);
}

// إعداد نموذج إضافة تدوينة
function setupPostForm() {
    const form = document.getElementById('postForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // جمع البيانات
        const formData = {
            title: document.getElementById('postTitle').value.trim(),
            author: document.getElementById('postAuthor').value.trim(),
            plantType: document.getElementById('plantType').value,
            experienceType: document.getElementById('experienceType').value,
            content: document.getElementById('postContent').value.trim(),
            imageUrl: document.getElementById('postImage').value.trim() || undefined
        };
        
        // التحقق من البيانات
        if (!validatePostForm(formData)) {
            return;
        }
        
        // إرسال البيانات
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const newPost = await response.json();
                showPostMessage('✅ تمت إضافة تجربتك بنجاح!', 'success');
                form.reset();
                
                // إغلاق النموذج بعد 2 ثانية
                setTimeout(() => {
                    togglePostForm();
                }, 2000);
                
                // إعادة تحميل التدوينات
                loadBlogPosts();
                
            } else {
                const error = await response.json();
                showPostMessage(`❌ ${error.error || 'حدث خطأ في الإرسال'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error submitting post:', error);
            showPostMessage('❌ خطأ في الاتصال بالخادم', 'error');
        }
    });
}

// التحقق من صحة بيانات التدوينة
function validatePostForm(data) {
    if (!data.title || data.title.length < 5) {
        showPostMessage('⚠️ العنوان يجب أن يكون 5 أحرف على الأقل', 'warning');
        return false;
    }
    
    if (!data.author || data.author.length < 2) {
        showPostMessage('⚠️ الاسم يجب أن يكون حرفين على الأقل', 'warning');
        return false;
    }
    
    if (!data.experienceType) {
        showPostMessage('⚠️ يرجى اختيار نوع التجربة', 'warning');
        return false;
    }
    
    if (!data.content || data.content.length < 5) {
        showPostMessage('⚠️ المحتوى يجب أن يكون 5 حرفاً على الأقل', 'warning');
        return false;
    }
    
    return true;
}

// معاينة الصورة
function previewImage() {
    const url = document.getElementById('postImage').value;
    const preview = document.getElementById('imagePreview');
    
    if (!url) {
        preview.style.display = 'none';
        return;
    }
    
    preview.innerHTML = `<img src="${url}" alt="معاينة الصورة" onerror="this.style.display='none'">`;
    preview.style.display = 'block';
}

// الإعجاب بتدوينة
async function likePost(postId, button) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const updatedPost = await response.json();
            const likeCount = button.querySelector('.like-count');
            likeCount.textContent = updatedPost.likes;
            
            // تحديث البيانات المحلية
            const postIndex = allPosts.findIndex(p => p._id === postId);
            if (postIndex !== -1) {
                allPosts[postIndex].likes = updatedPost.likes;
            }
            
            // تغيير مظهر الزر
            button.classList.add('liked');
            button.querySelector('i').className = 'fas fa-heart';
            
        } else {
            alert('حدث خطأ في تسجيل الإعجاب');
        }
        
    } catch (error) {
        console.error('Error liking post:', error);
        
        // محاكاة الإعجاب محلياً للاختبار
        const likeCount = button.querySelector('.like-count');
        const currentLikes = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = currentLikes + 1;
        
        button.classList.add('liked');
        button.querySelector('i').className = 'fas fa-heart';
    }
}

// عرض التدوينة كاملة
function showFullPost(postId) {
    const post = allPosts.find(p => p._id === postId);
    
    if (!post) {
        alert('التدوينة غير موجودة');
        return;
    }
    
    const badgeInfo = getBadgeInfo(post.experienceType);
    const date = new Date(post.createdAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let modalContent = `
        <div class="full-post">
            <div class="post-header">
                <span class="post-badge ${badgeInfo.class}">
                    ${badgeInfo.icon} ${badgeInfo.text}
                </span>
                <div class="post-meta">
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${post.author}</span>
                    </div>
                    <div class="meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${date}</span>
                    </div>
                    ${post.plantType ? `
                    <div class="meta-item">
                        <i class="fas fa-leaf"></i>
                        <span>${post.plantType}</span>
                    </div>` : ''}
                </div>
            </div>
            
            ${post.imageUrl ? `
            <div class="post-image-full">
                <img src="${post.imageUrl}" alt="${post.title}">
            </div>` : ''}
            
            <div class="post-content-full">
                ${formatPostContent(post.content)}
            </div>
            
            <div class="post-stats">
                <span class="likes-count">
                    <i class="fas fa-heart"></i> ${post.likes || 0} إعجاب
                </span>
            </div>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = post.title;
    document.getElementById('modalBody').innerHTML = modalContent;
    document.getElementById('postModal').style.display = 'block';
}

// تنسيق محتوى التدوينة
function formatPostContent(content) {
    // استبدال فواصل الأسطر بـ <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // اكتشاف النقاط وتحويلها إلى قائمة
    formatted = formatted.replace(/•\s*(.+?)<br>/g, '<li>$1</li>');
    
    // إذا كان هناك عناصر قائمة، أضف ul
    if (formatted.includes('<li>')) {
        formatted = formatted.replace(/<li>/g, '<ul><li>');
        formatted = formatted.replace(/<\/li>/g, '</li></ul>');
        formatted = formatted.replace(/<\/ul><br><ul>/g, '');
    }
    
    return formatted;
}

// إغلاق المودال
function closeModal() {
    document.getElementById('postModal').style.display = 'none';
}

// عرض/إخفاء نموذج إضافة تجربة
function togglePostForm() {
    const formSection = document.getElementById('addPostSection');
    if (formSection.style.display === 'none' || formSection.style.display === '') {
        formSection.style.display = 'block';
        window.scrollTo({ top: formSection.offsetTop - 100, behavior: 'smooth' });
    } else {
        formSection.style.display = 'none';
    }
}

// عرض الرسائل
function showPostMessage(text, type) {
    const messageEl = document.getElementById('postMessage');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 5000);
}

// إغلاق المودال عند النقر خارج المحتوى
window.onclick = function(event) {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        closeModal();
    }
};

// إضافة تنسيقات إضافية للصور في المودال
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .full-post {
        max-width: 100%;
    }
    
    .post-image-full {
        margin: 20px 0;
        border-radius: 10px;
        overflow: hidden;
        max-height: 400px;
    }
    
    .post-image-full img {
        width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: contain;
    }
    
    .post-content-full {
        line-height: 1.8;
        font-size: 16px;
        color: #333;
        margin: 25px 0;
    }
    
    .post-content-full ul {
        padding-right: 20px;
        margin: 15px 0;
    }
    
    .post-content-full li {
        margin-bottom: 10px;
        padding-right: 10px;
        position: relative;
    }
    
    .post-content-full li:before {
        content: "•";
        position: absolute;
        right: -15px;
        color: var(--primary);
        font-size: 20px;
    }
    
    .post-stats {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: center;
    }
    
    .likes-count {
        background: #f8f9fa;
        padding: 10px 20px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        color: #666;
    }
    
    .likes-count i {
        color: #ff6b6b;
    }
`;
document.head.appendChild(modalStyle);
