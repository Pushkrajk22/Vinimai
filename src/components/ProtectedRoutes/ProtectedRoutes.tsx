"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/loginService/checkToken?token=${token}`
        );
        const data = await res.json();

        if (data.isValid) {
          setIsValid(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      }
    };

    validateToken();
  }, [router]);

if (isValid === null) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
  return isValid ? <>{children}</> : null;
}
