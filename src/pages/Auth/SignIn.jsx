import { Button, Input } from "antd";
import Form from "antd/es/form/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/images/login.png";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setUser } from "../../redux/features/auth/authSlice";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const response = await login(values);
      if (response?.data?.status == 200) {
        const user = response?.data?.data?.user;
        const { password, ...rest } = user;

        if (response?.data?.data?.user?.role === "ADMIN") {
          localStorage.removeItem("verify-token");
          localStorage.setItem("token", response?.data?.data?.token);
          dispatch(
            setUser({
              user: rest,
              token: response?.data?.data?.token,
            })
          );
          // navigate(from, { replace: true });
          navigate(location.state ? location.state : "/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed!!",
            text: "You are not a Valid",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title:
            response?.data?.message ||
            response?.error?.data?.message ||
            "Login Failed!!",
          text: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!!",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-[92vh] w-full flex flex-col lg:flex-row justify-center items-center gap-1 lg:gap-[165px]">
      {/* Left */}
      <div className=" border-[#1E648C] flex-1">
        <img
          src={image}
          alt=""
          className="w-[768px] h-[768px] object-contain"
        />
      </div>

      <div className="hidden lg:block border-r border-[#1E648C]/60 h-[500px]"></div>

      {/* Right */}
      <div className=" order-first lg:order-last bg-white w-[630px] h-[480px] border border-[#2781B5] shadow-xl rounded-[16px] flex-1">
        <div className="pt-3 lg:px-[44px]">
          <div className="pb-[24px] space-y-2">
            <h1 className="text-[33px] text-center font-semibold text-[#3A3A3A]">
              Sign In
            </h1>
          </div>

          <Form
            name="normal_login"
            layout="vertical"
            initialValues={{
              remember: false,
            }}
            onFinish={onFinish}
            requiredMark={false}
            className="text-start space-y-[40px]"
          >
            <div className="space-y-[45px]">
              {/* Email */}
              <Form.Item
                // label={<span className="font-medium text-base">Email</span>}
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Please input a valid Email!",
                  },
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Email"
                  style={{
                    border: "1px solid #2781B5",
                    borderRadius: "7px",
                    height: "56px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>

              {/* Passworkd */}
              <Form.Item
                // label={<span className="font-medium text-base">Password</span>}
                className="mt-6"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
                  style={{
                    border: "1px solid #2781B5",
                    borderRadius: "7px",
                    height: "56px",
                  }}
                />
              </Form.Item>
            </div>

            {/* Forget password */}
            <div className="flex justify-end items-center">
              <Form.Item>
                <Link
                  to="/auth/forgot-password"
                  className="text-[18px] font-medium text-[#757575]"
                >
                  Forget password?
                </Link>
              </Form.Item>
            </div>

            <div className="w-full flex justify-center ">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="px-8 bg-[#174C6B] text-white hover:bg-[#174C6B]/90 rounded-[8px] h-[62px] min-w-[335px] text-[26px] mb-[20px]"
              >
                {isLoading ? <LoadingSpinner color="white" /> : "Sign In"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
