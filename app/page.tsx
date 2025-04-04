"use client";

import { useAuthStore } from "@/stores/auth";

const Home = () => {
  const { isAuthorized } = useAuthStore();
  console.log(isAuthorized);

  return (
    <div>
      <h1>Welcome to Your Home Page</h1>
      <p>Protected content goes here...</p>
    </div>
  );
};

export default Home;
