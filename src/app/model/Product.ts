export class Product {
    id: string;
    name: string;
    discount: boolean;
    category: {
        id: string;
        categoryName: string;
    };
    totalCalories: string;
    description: string;
    active: boolean;
    deleted: boolean;
    unitPrice: number;
    discountedPrice: number;
    images: Image[];
    createdOn: Date;

}

export interface Image {
    imageName: string;
}
