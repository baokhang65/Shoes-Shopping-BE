<style scoped>
.product-card {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.product-card__image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.product-card__content {
  padding: 16px;
}

.product-card__title {
  font-size: 1.125rem;
  color: #424242;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__price {
  font-size: 1.25rem;
  color: #1976D2;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-card__actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.product-card__button {
  background: #1976D2;
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-card__button:hover {
  background: #82B1FF;
}

.product-card__quantity {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
</style>