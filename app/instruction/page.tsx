"use client";

import { Card, CardBody } from "@heroui/card";

export default function Instruction() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center flex flex-col gap-4">
        <p>
          실무새는 디스코드에서 텍스트를 입력하면 해당 유저의 목소리를 흉내내어
          대신 말해주는 Text-To-Speech 봇입니다.
        </p>
        <p>목소리가 설정되어 있지 않을 경우 기본 목소리로 출력됩니다.</p>
        <p />
        <p>목소리를 훈련하는 방법에는 두 가지가 있습니다.</p>
        <p />
        <Card className="p-4">
          <CardBody className="flex flex-col gap-4">
            <p>
              디스코드 상에서 /등록 명령어를 통해 자동 훈련에 동의하실 수
              있습니다.
            </p>
            <p>
              동의하신 후에는 디스코드 보이스 채널에 참가하여 마이크를 사용할
              때마다 &quot;낮말쥐비아&quot; 봇이 목소리 샘플을 채집합니다.
            </p>
            <p>
              이 방법은 디스코드를 사용하실 때마다 자동으로 샘플이 채집되므로
              편리하다는 장점이 있지만, 대신 훈련된 목소리의 퀄리티가 좋지 않을
              수 있다는 단점이 있습니다.
            </p>
          </CardBody>
        </Card>
        <p />
        <Card className="p-4">
          <CardBody className="flex flex-col gap-4">
            <p>
              위 메뉴의 &quot;훈련하기&quot; 기능을 통해 주어지는 문장들을
              녹음하여 훈련 데이터를 수동으로 제공하실 수 있습니다.
            </p>
            <p>
              최소 50 개의 문장을 녹음해야 하기 때문에 시간이 오래 걸릴 수
              있으나, 많은 문장을 녹음해주실수록 더 좋은 퀄리티의 목소리 모델을
              기대하실 수 있습니다.
            </p>
            <p>
              50 개 이상의 문장을 녹음하신 후에는 &quot;훈련 신청하기&quot; 를
              통해 수동 훈련을 신청해주시면 됩니다.
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
