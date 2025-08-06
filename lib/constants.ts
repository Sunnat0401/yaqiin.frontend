import { Banknote, Barcode, Heart, Settings2, Shuffle, User } from 'lucide-react'

// Inglizcha kategoriyalar (ma'lumotlar bazasida saqlanadi)
export const categoriesEn = ['All', 'Shoes', 'T-Shirts', 'Clothes', 'Books', 'Accessories', 'Universal']

// Uzbekcha kategoriyalar (UI da ko'rsatiladi)
export const categories = ['Barchasi', 'Poyabzal', 'Futbolka', 'Kiyim', 'Kitoblar', 'Aksessuarlar', 'Universal']

// Kategoriya tarjima mapping
export const categoryTranslations = {
	// Uzbekchadan inglizchaga
	'Barchasi': 'All',
	'Poyabzal': 'Shoes', 
	'Futbolka': 'T-Shirts',
	'Kiyim': 'Clothes',
	'Kitoblar': 'Books',
	'Aksessuarlar': 'Accessories',
	'Universal': 'Universal',
	// Inglizchadan uzbekchaga
	'All': 'Barchasi',
	'Shoes': 'Poyabzal',
	'T-Shirts': 'Futbolka', 
	'Clothes': 'Kiyim',
	'Books': 'Kitoblar',
	'Accessories': 'Aksessuarlar'
}

// Uzbekchadan inglizchaga tarjima
export const translateToEnglish = (uzbekCategory: string): string => {
	return categoryTranslations[uzbekCategory as keyof typeof categoryTranslations] || uzbekCategory
}

// Inglizchadan uzbekchaga tarjima
export const translateToUzbek = (englishCategory: string): string => {
	return categoryTranslations[englishCategory as keyof typeof categoryTranslations] || englishCategory
}

// Kategoriyalar uchun ikki tomonlama tarjima funksiyalari
export const translateCategory = (category: string, language: 'uz' | 'en'): string => {
	if (language === 'uz') {
		return translateToUzbek(category)
	} else {
		return translateToEnglish(category)
	}
}

export const dashboardSidebar = [
	{ name: 'Shaxsiy ma\'lumotlar', route: '/dashboard', icon: User },
	{ name: 'Buyurtmalar', route: '/dashboard/orders', icon: Shuffle },
	{ name: 'To\'lovlar', route: '/dashboard/payments', icon: Banknote },
	{ name: 'Sevimlilar ro\'yxati', route: '/dashboard/watch-list', icon: Heart },
	{ name: 'Sozlamalar', route: '/dashboard/settings', icon: Settings2 },
]

export const adminSidebar = [
	{ name: 'Mijozlar', icon: User, route: '/admin' },
	{ name: 'Mahsulotlar', icon: Barcode, route: '/admin/products' },
	{ name: 'Buyurtmalar', icon: Shuffle, route: '/admin/orders' },
	{ name: 'To\'lovlar', icon: Banknote, route: '/admin/payments' },
]

export const TransactionState = {
	Paid: 2,
	Pending: 1,
	PendingCanceled: -1,
	PaidCanceled: -2,
}
