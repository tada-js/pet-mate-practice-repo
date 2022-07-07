import React, { useState } from "react";
import { useForm } from 'react-hook-form'
import { LoginBtn } from '../../components/button/Button'
import { ErrorMessageStyle } from '../../components/errorMessage/errorStyle'
import { EmailInput, PasswordInput } from '../../components/input/Input'
import { FormStyle, MainStyle, Title } from '../../style/commonLoginStyle'
import { SignUpLink } from './loginStyle'

export default function LoginTest2(props) {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const { register, handleSubmit, watch, formState: {errors, isValid} } = useForm();
  const onSubmit = (data) => {
    setState(data);
    console.log(state);
  };
  return (
    <>
      <MainStyle>
        <Title>로그인</Title>
        <FormStyle onSubmit={handleSubmit(onSubmit)}>
          <EmailInput {...register("userEmail", { required: true, minLength: 2 })} />
          {errors?.userEmail?.type === "required" && (
            <ErrorMessageStyle>*필수 입력사항입니다.</ErrorMessageStyle>
          )}
          {errors.userEmail?.type === "pattern" && (
            <ErrorMessageStyle>*올바르지 않은 이메일 형식입니다.</ErrorMessageStyle>
          )}
          <PasswordInput {...register("userPassword", { required: true, minLength: 6 })} />
          {errors?.userPassword?.type === "required" && (
            <ErrorMessageStyle>*필수 입력사항입니다.</ErrorMessageStyle>
          )}
          {errors.userPassword?.type === "minLength" && (
            <ErrorMessageStyle>*비밀번호는 6자 이상이어야 합니다.</ErrorMessageStyle>
          )}
          <LoginBtn disabled={!isValid}></LoginBtn>
          <SignUpLink>이메일로 회원가입</SignUpLink>
        </FormStyle>
      </MainStyle>
    </>
  );
}