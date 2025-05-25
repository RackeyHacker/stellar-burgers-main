import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';
import { TIngredient } from '@utils-types';

type IngredientParams = {
  id: string;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<IngredientParams>();
  const { ingredients } = useSelector(getIngredientState);

  const selectedIngredient = useMemo<TIngredient | undefined>(() => {
    if (!id || !ingredients.length) return undefined;
    return ingredients.find((ingredient) => ingredient._id === id);
  }, [id, ingredients]);

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
