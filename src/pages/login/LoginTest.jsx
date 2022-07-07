import React from 'react'
import { useForm } from 'react-hook-form'
import { LoginBtn } from '../../components/button/Button'
import { ErrorMessageStyle } from '../../components/errorMessage/errorStyle'
import { EmailInput, PasswordInput } from '../../components/input/Input'
import { FormStyle, MainStyle, Title } from '../../style/commonLoginStyle'
import { SignUpLink } from './loginStyle'

export default function LoginTest() {
  const { register, handleSubmit, formState: {errors, isValid}  } = useForm({mode:"onChange"});
  const onSubmit = (data) => { 
    console.log(data)
  }
  
  return (
    <>
      <MainStyle>
        <Title>로그인</Title>
        <FormStyle onSubmit={handleSubmit(onSubmit)}>
          <EmailInput {...register("userEmail", {
            required: "이메일은 필수 입력사항입니다.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "올바르지 않은 이메일 형식입니다."
            }
          })} />
          <PasswordInput {...register("userPassword")} />
          <LoginBtn disabled={!isValid}></LoginBtn>
          <SignUpLink>이메일로 회원가입</SignUpLink>
        </FormStyle>
      </MainStyle>
    </>
  )
}