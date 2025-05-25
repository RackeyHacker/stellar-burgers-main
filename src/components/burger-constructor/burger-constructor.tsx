import { FC, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice/constructorSlice';
import { getUserState } from '../../services/slices/userSlice/userSlice';

export const BurgerConstructor: FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { constructorItems, orderModalData, orderRequest } =
    useSelector(getConstructorState);
  const { isAuthenticated } = useSelector(getUserState);

  const orderIngredientIds = useMemo(() => {
    if (!constructorItems.bun) return [];

    const fillingIds = constructorItems.ingredients.map((item) => item._id);
    const bunId = constructorItems.bun._id;

    return [bunId, ...fillingIds, bunId];
  }, [constructorItems.bun, constructorItems.ingredients]);

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const fillingsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return bunPrice + fillingsPrice;
  }, [constructorItems.bun, constructorItems.ingredients]);

  const handleOrderClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun) {
      return;
    }

    dispatch(setRequest(true));
    dispatch(orderBurger(orderIngredientIds));
  }, [
    isAuthenticated,
    constructorItems.bun,
    orderIngredientIds,
    dispatch,
    navigate
  ]);

  const handleCloseModal = useCallback(() => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
});

BurgerConstructor.displayName = 'BurgerConstructor';
