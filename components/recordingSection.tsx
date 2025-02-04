"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Progress } from "@heroui/progress";
import { Tab, Tabs } from "@heroui/tabs";
import { useEffect, useState } from "react";

import { MicrophoneIcon, StopIcon, TrashIcon } from "@/components/icons";
import { title } from "@/components/primitives";
import { User } from "@/types";

interface RecordingSectionProps {
  user: User;
}

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export default function RecordingSection({
  user: _user,
}: RecordingSectionProps) {
  const [user, setUser] = useState(_user);
  const [prompts, setPrompts] = useState<{ [promptId: string]: string }>({});
  const [activePromptId, setActivePromptId] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPrompts();

    for (let i = 1; i <= 500; i++) {
      if (!user.recordings[i.toString()]) {
        setActivePromptId(i);
        break;
      }
    }
  }, []);

  const loadPrompts = async () => {
    const res = await fetch("/api/prompts");

    if (res.ok) {
      const data = await res.json();

      if (!data.error) {
        setPrompts(data);

        return;
      }
    }

    setErrorMessage("프롬프트를 가져오는데 실패했습니다.");
  };

  const startRecording = async () => {
    if (errorMessage) setErrorMessage("");
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
      });

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        setIsUploading(true);

        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

          const formData = new FormData();

          formData.append("audio", audioBlob);
          formData.append("promptId", activePromptId.toString());

          const res = await fetch("/api/recordings", {
            body: formData,
            method: "POST",
          });

          if (res.ok) {
            const data = await res.json();

            if (!data.error && data.id) setUser(data);
          }
        } catch {
          setErrorMessage("녹음된 샘플 업로드 중 오류가 발생하였습니다.");
        } finally {
          setIsRecording(false);
          setIsUploading(false);
        }
      });

      mediaRecorder.start();
    } catch {
      setIsRecording(false);
      setErrorMessage(
        "녹음 시도 중 오류가 발생하였습니다. 마이크가 사용 가능한지 확인해주세요."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const deleteRecording = async () => {
    setErrorMessage("");
    setIsUploading(true);

    try {
      const res = await fetch(`/api/recordings/${activePromptId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();

        if (!data.error && data.id) setUser(data);
      }
    } catch {
      setErrorMessage("샘플 삭제 중 오류가 발생하였습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitForTraining = async () => {
    setErrorMessage("");
    setIsUploading(true);

    try {
      const res = await fetch("/api/user/train");

      if (res.ok) {
        const data = await res.json();

        if (!data.error && data.id) setUser(data);
      }
    } catch {
      setErrorMessage("훈련 신청 중 오류가 발생하였습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert color="danger" title={errorMessage} variant="solid" />
      )}
      <Progress
        color={
          Object.keys(user.recordings).length >= 100 ? "success" : "danger"
        }
        label={`녹음된 샘플 수 ${Object.keys(user.recordings).length} / 500`}
        maxValue={500}
        minValue={0}
        value={Object.keys(user.recordings).length}
      />
      <Divider />
      <Tabs
        className="flex"
        color="primary"
        isDisabled={isRecording || isUploading}
        radius="sm"
        size="lg"
        variant="solid"
      >
        <Tab
          key="recordPage"
          className="flex flex-col items-center justify-center gap-8 w-full max-w-xl"
          title="샘플 녹음하기"
        >
          <p className={title()}>{activePromptId} 번째 샘플</p>
          <p className="text-md">
            녹음 버튼을 클릭해 다음 문장을 녹음해주세요.
          </p>
          <Card className="p-4" radius="sm" shadow="lg">
            <CardBody>
              <p className="text-lg">{prompts[activePromptId.toString()]}</p>
            </CardBody>
          </Card>
          {user.recordings[activePromptId] ? (
            <audio
              className="w-full"
              controls={true}
              src={`/api/public/recordings/${user.username}/${activePromptId}.wav`}
            >
              <track kind="captions" src={undefined} />
            </audio>
          ) : (
            <></>
          )}
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            {isRecording ? (
              <Button
                color="danger"
                fullWidth={true}
                isLoading={isUploading}
                radius="sm"
                size="lg"
                startContent={isUploading ? null : <StopIcon />}
                variant="shadow"
                onPress={() => {
                  stopRecording();
                }}
              >
                녹음 끝내기
              </Button>
            ) : (
              <Button
                color="success"
                fullWidth={true}
                isLoading={isUploading}
                radius="sm"
                size="lg"
                startContent={isUploading ? null : <MicrophoneIcon />}
                variant="shadow"
                onPress={() => {
                  startRecording();
                }}
              >
                {user.recordings[activePromptId]
                  ? "재녹음 시작"
                  : "새 녹음 시작"}
              </Button>
            )}
            <Button
              color={
                !isRecording && user.recordings[activePromptId]
                  ? "danger"
                  : "default"
              }
              fullWidth={true}
              isDisabled={isRecording || !user.recordings[activePromptId]}
              isLoading={isUploading}
              radius="sm"
              size="lg"
              startContent={isUploading ? null : <TrashIcon />}
              variant="shadow"
              onPress={() => {
                deleteRecording();
              }}
            >
              샘플 삭제
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              color={
                isRecording || activePromptId === 1 ? "default" : "primary"
              }
              isDisabled={isRecording || activePromptId === 1}
              isIconOnly={true}
              isLoading={isUploading}
              radius="sm"
              size="lg"
              variant="shadow"
              onPress={() => {
                if (activePromptId > 1) setActivePromptId(activePromptId - 1);
              }}
            >
              {"<"}
            </Button>
            <Button
              color={
                isRecording || activePromptId === 500 ? "default" : "primary"
              }
              isDisabled={isRecording || activePromptId === 500}
              isIconOnly={true}
              isLoading={isUploading}
              radius="sm"
              size="lg"
              variant="shadow"
              onPress={() => {
                if (activePromptId < 500) setActivePromptId(activePromptId + 1);
              }}
            >
              {">"}
            </Button>
          </div>
        </Tab>
        <Tab
          key="submitPage"
          className="flex flex-col items-center justify-center gap-8 w-full max-w-xl"
          title="훈련 신청하기"
        >
          <p className="text-sm">
            녹음된 샘플이 100개 이상인 경우 훈련 신청을 할 수 있습니다.
          </p>
          {user.submittedForTraining ? (
            <Button
              color="default"
              fullWidth={true}
              isDisabled={true}
              radius="sm"
              size="lg"
              variant="shadow"
            >
              이미 훈련을 신청하였습니다.
            </Button>
          ) : (
            <Button
              color="primary"
              fullWidth={true}
              isDisabled={Object.keys(user.recordings).length < 100}
              isLoading={isUploading}
              radius="sm"
              size="lg"
              variant="shadow"
              onPress={() => {
                submitForTraining();
              }}
            >
              훈련 신청하기
            </Button>
          )}
        </Tab>
      </Tabs>
    </>
  );
}
