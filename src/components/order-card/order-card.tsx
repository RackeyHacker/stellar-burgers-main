import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { OrderCardUI } from '@ui';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const VISIBLE_INGREDIENTS_LIMIT = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { ingredients } = useSelector(getIngredientState);

  const processedOrderData = useMemo(() => {
    if (!ingredients.length) {
      return null;
    }

    const orderIngredients = order.ingredients.reduce<TIngredient[]>(
      (result, ingredientId) => {
        const foundIngredient = ingredients.find(
          (item) => item._id === ingredientId
        );
        return foundIngredient ? [...result, foundIngredient] : result;
      },
      []
    );

    const totalPrice = orderIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    const visibleIngredients = orderIngredients.slice(
      0,
      VISIBLE_INGREDIENTS_LIMIT
    );
    const remainingCount = Math.max(
      0,
      orderIngredients.length - VISIBLE_INGREDIENTS_LIMIT
    );

    return {
      ...order,
      ingredientsInfo: orderIngredients,
      ingredientsToShow: visibleIngredients,
      remains: remainingCount,
      total: totalPrice,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!processedOrderData) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={processedOrderData}
      maxIngredients={VISIBLE_INGREDIENTS_LIMIT}
      locationState={{ background: location }}
    />
  );
});

OrderCard.displayName = 'OrderCard';
