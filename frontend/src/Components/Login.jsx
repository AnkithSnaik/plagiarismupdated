import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../Context/Authprovider";

function Login() {
  const { login } = useAuth(); // Destructure the 'login' function from useAuth hook
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const studentInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("http://localhost:4002/user/login", studentInfo);

      // Check for expected response data (token and student object)
      if (res.data && res.data.token && res.data.student) {
        toast.success("Logged in successfully");

        // Use the login function from AuthContext to set user and token in state and localStorage
        // Backend typically sends user data under a key like 'student' or 'user'
        login(res.data.student, res.data.token);

        // Close the modal (if it's being used as a <dialog> element)
        const modal = document.getElementById("my_modal_3");
        if (modal) { // Check if modal element exists to prevent errors
            modal.close();
        }
        
        // Navigate to the hero2 page after successful login
        // { replace: true } prevents navigating back to the login modal/page using browser back button
        navigate("/hero2", { replace: true }); 
      } else {
        toast.error("Unexpected response format from server after login.");
      }
    } catch (err) {
      console.error("Login Error:", err); // Log the full error for debugging
      // Display specific error message from backend if available, otherwise a generic one
      toast.error(err.response?.data?.message || "Login failed: An unknown error occurred.");
    }
  };

  return (
    // This component assumes it's rendered within a modal/dialog structure
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        {/* Close button for the modal */}
        <Link 
          to="/" // Link back to home, but also ensures modal closes
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            const modal = document.getElementById("my_modal_3");
            if (modal) {
              modal.close();
            }
          }}
        >
          ✕
        </Link>
        <h3 className="font-bold text-lg mb-4 text-center">Login</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md outline-none"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">This field is required</span>
            )}
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md outline-none"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">This field is required</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700"
            >
              Login
            </button>
            <p className="text-sm">
              Not registered?{" "}
              <Link to="/signup" className="underline text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default Login;