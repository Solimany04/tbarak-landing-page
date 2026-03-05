type FeedBack = {
    feedbackID: string;
    feedbackClientName: string;
    feedbackCompanyName: string;
    feedbackClientImage: string;
    feedbackContent: string;
    feedbackCreatedAt: string;
    feedbackUpdatedAt: string;
    feedbackIsVisible: string;
}

type Product = {
    productID: string;
    productName: string;
    productImages: string[];
    productAnimation: string[];
    productVideo: string;
    productDescription: string;
    productPrice: string;
    productCategory: string;
    productStock: string;
    productIsAvailable: string;
    productCreatedAt: string;
    productUpdatedAt: string;
}

const product1: Product = {
    productID: '/lib/data/productsData.tsx/product1.ID',
    productName: '/lib/data/productsData.tsx/product1.name',
    productImages: ['/public/images/products/product1_0','/public/images/products/product1_1'],
    productAnimation: [],
    productVideo: '/lib/data/productsData.tsx/product1.video',
    productDescription: '/lib/data/productsData.tsx/product1.description',
    productPrice: '/lib/data/productsData.tsx/product1.price',
    productCategory: '/lib/data/productsData.tsx/product1.category',
    productStock: '/lib/data/productsData.tsx/product1.stock',
    productIsAvailable: '/lib/data/productsData.tsx/product1.availability',
    productCreatedAt: '/lib/data/productsData.tsx/product1.createdAt',
    productUpdatedAt: '/lib/data/productsData.tsx/product1.updatedAt',
}

