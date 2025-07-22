import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/userSlice';
import { IFormValue } from '@utils-types';

export const Profile: FC = () => {
  const user = useSelector((state) => state.userReducer.data);
  const dispatch = useDispatch();

  if (!user) {
    return <div>Идёт загрузка...</div>;
  }

  const [formValue, setFormValue] = useState<IFormValue>({
    name: user.name || '',
    email: user.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({ ...user, password: '' });
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
