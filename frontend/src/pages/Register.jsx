import AuthForm from "../components/AuthForm";

function Register() {
  return <AuthForm route="/api/auth/register/" method="register" />;
}

export default Register;