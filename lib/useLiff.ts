import { useEffect, useState } from "react";
import liff from "@line/liff";

export function useLiff() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<{
    userId: string;
    displayName: string;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const p = await liff.getProfile();
          console.log("LIFF profile:", p);
          setProfile({ userId: p.userId, displayName: p.displayName });
        }
        setReady(true);
      } catch (e) {
        console.error("LIFF init error", e);
      }
    };
    init();
  }, []);

  return { ready, profile };
}
