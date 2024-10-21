export interface PostOptionsProps {
  postUserId: string;
  currentId: string;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export interface PostListProps {
  restaurantId: number;
}