"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  if (isValid === null) return <p></p>;

  return isValid ? <>{children}</> : null;
}
