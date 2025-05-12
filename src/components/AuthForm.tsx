
import { AuthFormProps } from "@/components/auth/AuthTypes";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthForm = ({ type, userType }: AuthFormProps) => {
  return (
    <AuthLayout>
      {type === "login" ? 
        <LoginForm userType={userType} /> : 
        <RegisterForm userType={userType} />
      }
    </AuthLayout>
  );
};

export default AuthForm;
