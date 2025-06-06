import { Button, Checkbox, Input } from "antd";
import Form from "antd/es/form/Form";
import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/forgot.png";
import PageHeading from "../../Components/PageHeading";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    try {
      const response = await forgotPassword(values);

      if (response?.data?.status == 200) {
        navigate(`/auth/verify-email`, { state: { email: values.email } });
        toast.success(
          response.data.message || "Verification code sent to email."
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!!",
          text:
            response?.data?.message ||
            response?.error?.data?.message ||
            "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text: "Something went wrong. Please try again later.",
      });
    }
  };
  return (
    <div className="min-h-[92vh] w-full grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-1 lg:gap-8">
      <div className="border-r-0 lg:border-r-2 border-primary w-[99%] p-[8%] lg:p-[12%] lg:pr-0">
        <img src={image} alt="" />
      </div>
      <div className="lg:p-[5%] order-first lg:order-first">
        <div className="w-full py-[64px] lg:px-[44px] space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <PageHeading
              backPath={"/auth"}
              title={"Forgot Password"}
              disbaledBackBtn={true}
            />
            <p className="drop-shadow text-hash mt-4 text-center lg:text-start text-[#3A3A3A]">
              Please enter your email address to reset your password.
            </p>
          </div>
          <Form
            name="normal_login"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please input valid email!",
                },
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <div className="w-full flex justify-center pt-5">
              <Button
                // disabled={isLoading}
                type="primary"
                size="large"
                htmlType="submit"
                className="w-full px-2 bg-[#174C6B]"
              >
                {isLoading ? <LoadingSpinner color="white" /> : "Send OTP"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
