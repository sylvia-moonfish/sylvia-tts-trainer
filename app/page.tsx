"use client";

import { title } from "@/components/primitives";
import RecordingSection from "@/components/recordingSection";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
      {loading ? (
        <>
          <div className="inline-block max-w-xl text-center justify-center">
            <span className={title()}>불러오는 중...</span>
          </div>
          <div className="mt-4">
            <Spinner />
          </div>
        </>
      ) : !user ? (
        <Button
          color="primary"
          onPress={() =>
            router.push(
              `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!)}&response_type=code&scope=identify`
            )
          }
          radius="sm"
          size="lg"
          variant="shadow"
        >
          디스코드로 로그인
        </Button>
      ) : (
        <RecordingSection user={user} />
      )}
    </section>
  );
}
