"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, setLoginUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token && user.id) {
      navigate("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(errors);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg);
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      setLoginUser(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="w-full border-2 grid place-items-center h-screen p-3 sm:p-10">
      {error && (
        <div className="absolute top-10 w-3/4 sm:w-2/4 lg:w-1/4 h-10 text-center pt-2 font-bold bg-red-500 text-white">
          {error}
        </div>
      )}
      <section className="w-11/12 md:w-3/4 lg:w-1/2 text-center border py-5 mx-auto drop-shadow-2xl shadow-lg md:border md:border-indigo-400 rounded-sm">
        <h2 className="text-2xl sm:text-3xl text-indigo-600 font-bold">
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-11/12 mx-auto mt-2"
        >
          <div className="flex flex-col mx-auto my-5">
            <label htmlFor="email" className="text-left font-bold text-lg">
              Email
            </label>
            <input
              className="border border-indigo-100 p-2 mt-1 focus:outline-indigo-400"
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="border px-4 py-2 text-left bg-red-500 text-white">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col mx-auto my-5">
            <label htmlFor="password" className="text-left font-bold text-lg">
              Password
            </label>
            <input
              className="border border-indigo-100 p-2 mt-1 focus:outline-indigo-400"
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="border px-4 py-2 text-left bg-red-500 text-white">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              className={`w-full rounded-sm sm:w-3/4 bg-indigo-600 text-white font-bold text-uppercase text-lg px-5 py-2 cursor-pointer`}
              type="submit"
              // disabled={!isFormValid}
            >
              Login
            </button>
            <div className="cursor: none">
              Don't have an account?
              <Link to="/register" className="text-blue-600 font-bold">
                {" "}
                Register instead
              </Link>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default Login;
