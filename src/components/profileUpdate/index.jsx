import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { updateUserProfile, getUserProfile } from "../../actions/userActions";
import { imageUploadsHandler } from "../../util/imageUploads";
import { API_URL } from "../../constants/defaultUrl";
import {
  Form,
  ProfileImgWrapper,
  ProductFormWrapper,
  UploadBtn,
} from "./index.style";

const ProfileUpdateForm = () => {
  const [updateImage, setUpdateImage] = useState();
  const [accountIdErrorMessage, setAccountIdErrorMessage] = useState("");

  const dispatch = useDispatch();

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const { image, username, accountname, intro } = useSelector(
    state => state.userReadProfile,
  );

  useEffect(() => {
    if (username) {
      setValue("username", username);
    }
  }, [username]);

  useEffect(() => {
    if (accountname) {
      setValue("accountname", accountname);
    }
  }, [accountname]);

  useEffect(() => {
    if (intro) {
      setValue("intro", intro);
    }
  }, [intro]);

  useEffect(() => {
    if (accountIdErrorMessage) {
      setAccountIdErrorMessage("");
    }
  }, [getValues().accountname]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const previewImage = e => {
    const nowSelectImageList = e.target.files;

    const nowImageUrl = URL.createObjectURL(nowSelectImageList[0]);

    setUpdateImage(nowImageUrl);
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
      const { profileImg, username, accountname, intro } = data;
      const image = await imageUploadsHandler(profileImg[0]);
      if (isValid) {
        try {
          const response = await getAccountNameValid();
          console.log(response);
          if (response.message === "?????? ????????? ??????ID ?????????.") {
            dispatch(
              updateUserProfile(image && image, username, accountname, intro),
            );
          }
          if (response.message === "?????? ????????? ??????ID ?????????.") {
            setAccountIdErrorMessage(response.message);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="a11y-hidden">????????? ?????? ?????????</h3>
      <ProfileImgWrapper>
        <label onChange={previewImage} htmlFor="profileImg">
          <img
            alt="????????? ?????????"
            onError={event => (event.target.style.display = "none")}
            onLoad={event => (event.target.style.display = "inline-block")}
            src={updateImage ? updateImage : image}
          />
          <input
            type="file"
            name="profileImg"
            id="profileImg"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            title="????????? ????????? ????????? ??????"
            {...register("profileImg" /* { required: true } */)}
          />
        </label>
      </ProfileImgWrapper>
      <ProductFormWrapper>
        <label htmlFor="username">????????? ??????</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          placeholder="2~10??? ???????????? ?????????."
          {...register("username", {
            required: true,
            minLength: 2,
            maxLength: 10,
            onChange: e => {
              setValue("username", e.target.value);
            },
          })}
        />
        {errors.username?.type === "minLength" && (
          <p>*2~10??? ???????????? ?????????.</p>
        )}
        {errors.username?.type === "maxLength" && (
          <p>*2~10??? ???????????? ?????????.</p>
        )}
        <label htmlFor="accountname"> ?????? ID</label>
        <input
          type="text"
          name="accountname"
          id="accountname"
          autoComplete="off"
          placeholder="????????? ?????? ???????????????."
          {...register("accountname", {
            required: true,
            pattern: /^[-._a-z0-9]+$/gi,
          })}
        />
        {errors.accountname?.type === "pattern" && (
          <p>*??????, ??????, ?????? ??? ???????????? ????????? ??? ????????????.</p>
        )}
        {accountIdErrorMessage && <p>{accountIdErrorMessage}</p>}
        <label htmlFor="intro">??????</label>
        <input
          type="text"
          name="intro"
          id="intro"
          autoComplete="off"
          placeholder="????????? ????????? ????????? ?????? ????????? ?????????!"
          {...register("intro", {
            required: true,
          })}
        />
        {errors.intro?.type === "pattern" && <p>* URL??? ????????? ?????????.</p>}
      </ProductFormWrapper>
      <UploadBtn type="submit" disabled={!isValid}>
        ??????
      </UploadBtn>
    </Form>
  );
};

export default ProfileUpdateForm;
