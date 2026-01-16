import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WaveDecoration from "@/components/WaveDecoration";
import { useToast } from "@/hooks/use-toast";
import { loginApi } from "../lib/auth.api.js";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { data } = await loginApi({
        email: formData.email,
        password: formData.password,
      });
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (!data?.access_token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", data.user?.email || formData?.email);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate("/movies");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen app-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-xs md:max-w-sm animate-fade-in z-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-8 md:mb-10">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            // required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            // required
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-ring focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-foreground/80">Remember me</span>
          </label>

          <button type="submit" className="btn-primary w-full mt-4">
            Login
          </button>
        </form>
      </div>

      <WaveDecoration />
    </div>
  );
};

export default SignIn;
