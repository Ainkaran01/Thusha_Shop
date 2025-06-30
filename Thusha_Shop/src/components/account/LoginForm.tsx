// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { useUser } from "@/context/UserContext";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// type LoginFormProps = {
//   onToggleAuthMode: () => void;
// };

// const LoginForm = ({ onToggleAuthMode }: LoginFormProps) => {
//   const { login,user } = useUser();
//   const { toast } = useToast();
//   const navigate = useNavigate();
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   try {
//    const loggedInUser = await login(formData.email, formData.password);
    
//     // Now check the user from context instead of the login return value
//     if (!loggedInUser || !loggedInUser.role) {
//   toast({
//     title: "Login Error",
//     description: "User role not found",
//     variant: "destructive",
//   });
//   return;
// }

// switch (loggedInUser.role) {
//   case "admin":
//     navigate("/admin-dashboard");
//     break;
//   case "doctor":
//     navigate("/doctor-dashboard");
//     break;
//   case "manufacturer":
//     navigate("/manufacturer-dashboard");
//     break;
//   case "delivery":
//     navigate("/delivery-dashboard");
//     break;
//   default:
//     navigate("/account");
// }
//   } catch (error) {
//     toast({
//       title: "Login Error",
//       description: error instanceof Error ? error.message : "Something went wrong",
//       variant: "destructive",
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Simulate password reset
//     setTimeout(() => {
//       toast({
//         title: "Reset link sent! 📧",
//         description: `Password reset instructions have been sent to ${resetEmail}`,
//       });
//       setShowResetPassword(false);
//       setResetEmail("");
//     }, 1000);
//   };

//   if (showResetPassword) {
//     return (
//       <form onSubmit={handleResetPassword} className="space-y-6">
//         <div className="text-center mb-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-2">Reset Password</h3>
//           <p className="text-sm text-slate-600">Enter your email to receive reset instructions</p>
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="resetEmail" className="text-slate-700 font-medium">Email Address</Label>
//           <div className="relative">
//             <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//             <Input 
//               id="resetEmail" 
//               name="resetEmail" 
//               type="email" 
//               autoComplete="email"
//               placeholder="your@email.com" 
//               value={resetEmail} 
//               onChange={(e) => setResetEmail(e.target.value)}
//               className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
//               required 
//             />
//           </div>
//         </div>
        
//         <div className="flex flex-col space-y-4 mt-8">
//           <Button 
//             type="submit" 
//             className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
//           >
//             Send Reset Link
//           </Button>
          
//           <Button 
//             type="button"
//             variant="outline" 
//             className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50" 
//             onClick={() => setShowResetPassword(false)}
//           >
//             Back to Login
//           </Button>
//         </div>
//       </form>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
//           <div className="relative">
//             <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//             <Input 
//               id="email" 
//               name="email" 
//               type="email" 
//                autoComplete="username"
//               placeholder="your@email.com" 
//               value={formData.email} 
//               onChange={handleChange} 
//               className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
//               required 
//             />
//           </div>
//         </div>
        
//         <div className="space-y-2">
//           <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
//           <div className="relative">
//             <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//             <Input 
//               id="password" 
//               name="password" 
//               autoComplete="current-password" 
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password" 
//               value={formData.password} 
//               onChange={handleChange} 
//               className="pl-10 pr-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
//               required 
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex flex-col space-y-4 mt-8">
//         <Button 
//           type="submit" 
//           className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <div className="flex items-center">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
//               Signing in...
//             </div>
//           ) : (
//             "Sign In"
//           )}
//         </Button>
        
//         <Button 
//           type="button"
//           variant="link" 
//           className="p-0 h-auto text-yellow-700 hover:text-yellow-800 font-medium text-sm" 
//           onClick={() => setShowResetPassword(true)}
//         >
//           Forgot your password?
//         </Button>
        
//         <div className="text-center">
//           <p className="text-sm text-slate-600">
//             Don't have an account?{" "}
//             <Button 
//               type="button"
//               variant="link" 
//               className="p-0 h-auto text-yellow-700 hover:text-yellow-800 font-medium" 
//               onClick={onToggleAuthMode}
//             >
//               Create one here
//             </Button>
//           </p>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

type LoginFormProps = {
  onToggleAuthMode: () => void;
  onForgotPassword: (email: string) => void;
};

const LoginForm = ({ onToggleAuthMode, onForgotPassword }: LoginFormProps) => {
  const { login, user ,sendPasswordResetOtp } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
       const loggedInUser = await login(formData.email, formData.password);

      // Now check the user from context instead of the login return value
      if (!loggedInUser || !loggedInUser.role) {
        toast({
          title: "Login Error",
          description: "User role not found",
          variant: "destructive",
        });
        return;
      }

      switch (loggedInUser.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "manufacturer":
          navigate("/manufacturer-dashboard");
          break;
        case "delivery":
          navigate("/delivery-dashboard");
          break;
        default:
          navigate("/account");
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendPasswordResetOtp(resetEmail);
      onForgotPassword(resetEmail);
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error) {
      // Error handling is done in the UserContext
    } finally {
      setIsSubmitting(false);
    }
  };
   if (showResetPassword) {
      return (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-600">Enter your email to receive reset instructions</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resetEmail" className="text-slate-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input 
                id="resetEmail" 
                name="resetEmail" 
                type="email" 
                autoComplete="email"
                placeholder="your@email.com" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                required 
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 mt-8">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Send Reset Link
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50" 
              onClick={() => setShowResetPassword(false)}
            >
              Back to Login
            </Button>
          </div>
        </form>
      );
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input 
                id="email" 
                name="email" 
                type="email" 
                 autoComplete="username"
                placeholder="your@email.com" 
                value={formData.email} 
                onChange={handleChange} 
                className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input 
                id="password" 
                name="password" 
                autoComplete="current-password" 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password" 
                value={formData.password} 
                onChange={handleChange} 
                className="pl-10 pr-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 mt-8">
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <Button 
            type="button"
            variant="link" 
            className="p-0 h-auto text-yellow-700 hover:text-yellow-800 font-medium text-sm" 
            onClick={() => setShowResetPassword(true)}
          >
            Forgot your password?
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Button 
                type="button"
                variant="link" 
                className="p-0 h-auto text-yellow-700 hover:text-yellow-800 font-medium" 
                onClick={onToggleAuthMode}
              >
                Create one here
              </Button>
            </p>
          </div>
        </div>
      </form>
    );
  };
  
  export default LoginForm;