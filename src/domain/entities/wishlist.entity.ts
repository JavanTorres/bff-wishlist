export class WishlistItem {
  productUuid: string;
  addedAt: Date;
  notes?: string;
}

export class Wishlist {
  uuid: string;
  userUuid: string;
  name: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}