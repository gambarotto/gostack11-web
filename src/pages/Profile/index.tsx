/* eslint-disable camelcase */
import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface DataProps {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: DataProps) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatórtio'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Informe um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'A senha deve conter no minimo 6 caractéres'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: string) => !!val.length,
              then: Yup.string()
                .required('Campo obrigatório')
                .min(6, 'A senha deve conter no minimo 6 caractéres'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };
        const response = await api.put('/profiles', formData);
        updateUser(response.data);

        history.push('/dashboard');
        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description: 'Suas informações do perfil foram atualizadas',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        });
      }
    },
    [addToast, history, updateUser],
  );
  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);
        const response = await api.patch('/users/avatar', data);
        if (response) {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
            description: 'Avatar atualizado com sucesso',
          });
        }
      }
    },
    [addToast, updateUser],
  );
  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: '24px' }}
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
          />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmar Senha"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
