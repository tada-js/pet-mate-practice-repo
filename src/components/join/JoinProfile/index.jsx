import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../../constants/defaultUrl";
import { joinMembership } from "../../../actions/userActions";
import { imageUploadsHandler } from "../../../util/imageUploads";
import {
  JoinProfileForm,
  JoinProfileTitle,
  SubText,
  JoinProfileFieldSet,
  JoinImgLabel,
  JoinImg,
  JoinImgInput,
  JoinProfileLabel,
  JoinProfileInput,
  InputWrapper,
  ErrorMessage,
  JoinButton,
} from "./index.style";
import ProfileImg from "../../../asset/basic-profile-img.svg";

const JoinProfile = ({ userInfo }) => {
  const [isPreviewImage, setIsPreviewImage] = useState(true);
  const [myImage, setMyImage] = useState("");
  const [accountIdErrorMessage, setAccountIdErrorMessage] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (accountIdErrorMessage) {
      setAccountIdErrorMessage("");
    }
  }, [getValues().accountname]);

  const previewImage = e => {
    const nowSelectImageList = e.target.files;

    const nowImageUrl = URL.createObjectURL(nowSelectImageList[0]);

    setMyImage(nowImageUrl);

    setIsPreviewImage(false);
  };

  const getAccountNameValid = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const reqData = {
      user: { accountname: getValues().accountname },
    };
    const { data } = await axios.post(
      `${API_URL}/user/accountnamevalid`,
      reqData,
      config,
    );
    return data;
  };

  const onSubmit = async data => {
    try {
      const { username, accountname, profileImg, intro } = data;
      const { email, password } = userInfo;
      const image = await imageUploadsHandler(profileImg[0]);

      if (isValid) {
        try {
          const response = await getAccountNameValid();
          if (response.message === "?????? ????????? ??????ID ?????????.") {
            dispatch(
              joinMembership(
                email,
                password,
                username,
                accountname,
                image,
                intro,
              ),
            );
          }
          if (response.message === "?????? ????????? ??????ID ?????????.") {
            setAccountIdErrorMessage(response.message);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const trigger = e => {
    e.target.src = ProfileImg;
  };

  return (
    <JoinProfileForm onSubmit={handleSubmit(onSubmit)}>
      <JoinProfileTitle>????????? ??????</JoinProfileTitle>
      <SubText>????????? ???????????? ????????? ??? ????????????.</SubText>
      <JoinProfileFieldSet>
        <JoinImgLabel onChange={previewImage} htmlFor="profileImg">
          <JoinImg alt="????????? ??????" src={myImage} onError={trigger} />
          <JoinImgInput
            type="file"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            name="profileImg"
            id="profileImg"
            {...register("profileImg")}
          />
        </JoinImgLabel>
        <InputWrapper>
          <JoinProfileLabel htmlFor="username">
            ????????? ??????
            <JoinProfileInput
              name="username"
              id="username"
              type="text"
              placeholder="2~10??? ???????????? ?????????."
              autoComplete="off"
              spellCheck="false"
              {...register("username", {
                required: true,
                minLength: 2,
                maxLength: 10,
              })}
            />
            {errors?.username?.type === "required" && (
              <ErrorMessage>* ?????? ?????????????????????.</ErrorMessage>
            )}
            {errors.username?.type === "minLength" ||
              (errors.username?.type === "maxLength" && (
                <ErrorMessage>*2~10??? ???????????? ?????????.</ErrorMessage>
              ))}
          </JoinProfileLabel>
          <JoinProfileLabel htmlFor="id">
            ?????? ID
            <JoinProfileInput
              name="accountname"
              id="accountname"
              type="text"
              placeholder="??????, ??????, ????????????(.),(_)??? ?????? ???????????????."
              autoComplete="off"
              spellCheck="false"
              {...register("accountname", {
                required: true,
                pattern: /^[-._a-z0-9]+$/gi,
              })}
            />
            {errors?.accountname?.type === "required" && (
              <ErrorMessage>* ?????? ?????????????????????.</ErrorMessage>
            )}
            {errors?.accountname?.type === "pattern" && (
              <ErrorMessage>
                *??????, ??????, ?????? ??? ???????????? ????????? ??? ????????????.
              </ErrorMessage>
            )}
            {accountIdErrorMessage && (
              <ErrorMessage>{accountIdErrorMessage}</ErrorMessage>
            )}
          </JoinProfileLabel>
          <JoinProfileLabel htmlFor="intro">
            ??????
            <JoinProfileInput
              name="intro"
              type="text"
              id="intro"
              placeholder="????????? ????????? ????????? ?????? ????????? ?????????!"
              autoComplete="off"
              spellCheck="false"
              {...register("intro", {
                required: true,
              })}
            />
            {errors?.intro?.type === "required" && (
              <ErrorMessage>* ?????? ?????????????????????.</ErrorMessage>
            )}
          </JoinProfileLabel>
        </InputWrapper>
        <JoinButton type="submit" disabled={!isValid}>
          ???????????? ????????????
        </JoinButton>
      </JoinProfileFieldSet>
    </JoinProfileForm>
  );
};

export default JoinProfile;
