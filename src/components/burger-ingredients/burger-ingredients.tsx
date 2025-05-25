import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '@store';
import { BurgerIngredientsUI } from '@ui';
import { TTabMode, TIngredient } from '@utils-types';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

export const BurgerIngredients: FC = memo(() => {
  const { ingredients } = useSelector(getIngredientState);

  const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  const mains = ingredients.filter((item: TIngredient) => item.type === 'main');
  const sauces = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsObserverRef, isBunsVisible] = useInView({ threshold: 0 });
  const [mainsObserverRef, isMainsVisible] = useInView({ threshold: 0 });
  const [saucesObserverRef, isSaucesVisible] = useInView({ threshold: 0 });

  useEffect(() => {
    if (isBunsVisible) {
      setActiveTab('bun');
    } else if (isSaucesVisible) {
      setActiveTab('sauce');
    } else if (isMainsVisible) {
      setActiveTab('main');
    }
  }, [isBunsVisible, isMainsVisible, isSaucesVisible]);

  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab as TTabMode);
    const refs = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };
    refs[tab as TTabMode]?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsObserverRef}
      mainsRef={mainsObserverRef}
      saucesRef={saucesObserverRef}
      onTabClick={handleTabClick}
    />
  );
});

BurgerIngredients.displayName = 'BurgerIngredients';
