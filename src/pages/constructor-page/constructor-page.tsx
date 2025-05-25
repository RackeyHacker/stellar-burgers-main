import { FC, memo } from 'react';
import { useSelector } from '@store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui/preloader';
import {
  getIngredientState,
  TIngredientState
} from '../../services/slices/ingredientSlice/ingredientSlice';

const BURGER_BUILDER_TITLE = 'Соберите бургер';

export const ConstructorPage: FC = memo(() => {
  const { loading: isLoading } = useSelector(
    getIngredientState
  ) as TIngredientState;

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <header className={styles.title}>
        <h1 className='text text_type_main-large mt-10 mb-5 pl-5'>
          {BURGER_BUILDER_TITLE}
        </h1>
      </header>

      <section className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </section>
    </main>
  );
});
