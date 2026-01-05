// بيانات النباتات
const plantsData = [
    {
        id: 1,
        name: "الطماطم",
        category: "vegetables",
        description: "من الخضروات الأساسية في المطبخ السعودي، تزدهر في المناخ الحار مع ري منتظم.",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
        difficulty: "easy",
        season: "الربيع",
        water: "مرتين يومياً",
        sun: "شمس كاملة",
        harvest: "70-90 يوم"
    },
    {
        id: 2,
        name: "الخس",
        category: "vegetables",
        description: "يفضل الطقس المعتدل، يحتاج ظلاً جزئياً في الصيف.",
        image: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abb?w=400&h=300&fit=crop",
        difficulty: "medium",
        season: "الشتاء",
        water: "مرة يومياً",
        sun: "شمس جزئية",
        harvest: "45-60 يوم"
    },
    {
        id: 3,
        name: "النعناع",
        category: "herbs",
        description: "عشب معمر سهل الزراعة، ينمو بسرعة وينتشر بسهولة.",
        image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=300&fit=crop",
        difficulty: "easy",
        season: "طوال السنة",
        water: "مرة يومياً",
        sun: "شمس جزئية",
        harvest: "30 يوم"
    },
    {
        id: 4,
        name: "الريحان",
        category: "herbs",
        description: "عشب عطري محب للشمس، يستخدم في الطبخ والطب التقليدي.",
        image: "https://images.unsplash.com/photo-1562123287-5d2d69e09a13?w=400&h=300&fit=crop",
        difficulty: "easy",
        season: "الربيع والصيف",
        water: "مرة يومياً",
        sun: "شمس كاملة",
        harvest: "40-50 يوم"
    },
    {
        id: 5,
        name: "البطيخ",
        category: "fruits",
        description: "فاكهة صيفية تحتاج مساحة واسعة وتربة جيدة التصريف.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
        difficulty: "hard",
        season: "الصيف",
        water: "مرتين يومياً",
        sun: "شمس كاملة",
        harvest: "80-100 يوم"
    },
    {
        id: 6,
        name: "الفلفل الحار",
        category: "vegetables",
        description: "ينمو جيداً في الحرارة، يحتاج تربة غنية بالعناصر الغذائية.",
        image: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=400&h=300&fit=crop",
        difficulty: "medium",
        season: "الربيع",
        water: "مرة يومياً",
        sun: "شمس كاملة",
        harvest: "60-80 يوم"
    },
    {
        id: 7,
        name: "الورد الجوري",
        category: "flowers",
        description: "زهرة جميلة تتحمل الجفاف، تزهر في الربيع والخريف.",
        image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=300&fit=crop",
        difficulty: "medium",
        season: "الربيع والخريف",
        water: "كل يومين",
        sun: "شمس كاملة",
        harvest: "للزينة"
    },
    {
        id: 8,
        name: "الكزبرة",
        category: "herbs",
        description: "عشب سريع النمو، يستخدم بكثرة في المطبخ السعودي.",
        image: "https://images.unsplash.com/photo-1575286366630-a9254ce0c5da?w=400&h=300&fit=crop",
        difficulty: "easy",
        season: "الشتاء والربيع",
        water: "مرة يومياً",
        sun: "شمس جزئية",
        harvest: "30-45 يوم"
    }
];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayPlants(plantsData);
    setupFilterTags();
    setupSearch();
});

// عرض النباتات
function displayPlants(plants) {
    const grid = document.getElementById('plantsGrid');
    
    if (plants.length === 0) {
        grid.innerHTML = '<div class="no-results"><p>❌ لا توجد نباتات مطابقة للبحث</p></div>';
        return;
    }
    
    let html = '';
    
    plants.forEach(plant => {
        const difficultyText = {
            easy: 'سهلة',
            medium: 'متوسطة',
            hard: 'صعبة'
        };
        
        const categoryText = {
            vegetables: 'خضروات',
            fruits: 'فواكه',
            herbs: 'أعشاب',
            flowers: 'زهور'
        };
        
        html += `
            <div class="plant-card" data-category="${plant.category}" data-difficulty="${plant.difficulty}">
                <div class="plant-image">
                    <img src="${plant.image}" alt="${plant.name}" 
                         onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'">
                </div>
                <div class="plant-content">
                    <span class="plant-category">${categoryText[plant.category] || plant.category}</span>
                    <h3>${plant.name}</h3>
                    <p class="plant-description">${plant.description}</p>
                    
                    <div class="plant-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>الموسم: ${plant.season}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tint"></i>
                            <span>الري: ${plant.water}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-sun"></i>
                            <span>الشمس: ${plant.sun}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-hourglass-half"></i>
                            <span>الحصاد: ${plant.harvest}</span>
                        </div>
                    </div>
                    
                    <div class="difficulty ${plant.difficulty}">
                        <i class="fas fa-signal"></i>
                        <span>الصعوبة: ${difficultyText[plant.difficulty]}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

// إعداد فلاتر التصنيف
function setupFilterTags() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            tags.forEach(t => t.classList.remove('active'));
            // إضافة النشاط للزر المضغوط
            this.classList.add('active');
            
            // تطبيق الفلتر
            const type = this.dataset.type;
            filterPlants(type);
        });
    });
}

// فلترة النباتات
function filterPlants(type) {
    let filteredPlants = plantsData;
    
    if (type !== 'all') {
        if (type === 'easy') {
            filteredPlants = plantsData.filter(plant => plant.difficulty === 'easy');
        } else {
            filteredPlants = plantsData.filter(plant => plant.category === type);
        }
    }
    
    displayPlants(filteredPlants);
}

// إعداد البحث
function setupSearch() {
    const searchInput = document.getElementById('plantSearch');
    
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length >= 2) {
            const filteredPlants = plantsData.filter(plant => 
                plant.name.toLowerCase().includes(searchTerm) ||
                plant.description.toLowerCase().includes(searchTerm) ||
                plant.season.toLowerCase().includes(searchTerm)
            );
            
            displayPlants(filteredPlants);
        } else if (searchTerm.length === 0) {
            displayPlants(plantsData);
        }
    });
}

// دالة البحث
function searchPlants() {
    const searchInput = document.getElementById('plantSearch');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm) {
        const filteredPlants = plantsData.filter(plant => 
            plant.name.toLowerCase().includes(searchTerm) ||
            plant.description.toLowerCase().includes(searchTerm)
        );
        
        displayPlants(filteredPlants);
    }
}