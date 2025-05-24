import { FC, memo, useMemo } from 'react';
import { useSelector } from '@store';
import { AppHeaderUI } from '@ui';
import { getUserState } from '../../services/slices/userSlice/userSlice';

export const AppHeader: FC = memo(() => {
  const { userData } = useSelector(getUserState);

  const displayName = useMemo(() => userData?.name ?? '', [userData?.name]);

  return <AppHeaderUI userName={displayName} />;
});

AppHeader.displayName = 'AppHeader';
