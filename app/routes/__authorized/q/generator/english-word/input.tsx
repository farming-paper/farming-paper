import { useNavigate } from "@remix-run/react";
import { Button, Input } from "antd";
import { useCallback, useState } from "react";
import Label from "~/common/components/Label";
import useCmdEnter from "~/common/hooks/use-cmd-enter";

export default function Page() {
  const [word, setWord] = useState("");
  const navigate = useNavigate();

  const handleNext = useCallback(() => {
    navigate("/q/generator/english-word/sentence-auto-select/" + word);
  }, [navigate, word]);

  useCmdEnter(handleNext);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-bold text-green-600">1. 단어 입력</span>
        <span>-</span>
        <span className="text-gray-400">2. 문제 점검</span>
      </div>

      <div className="flex flex-col mb-4">
        <Label htmlFor="word">영어 단어</Label>
        <Input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          id="word"
          placeholder="예: demonstration"
        />
      </div>
      <div className="flex justify-end gap-3">
        {/* <Button onClick={handleNext}>문장 자동 선택</Button> */}
        <Button onClick={handleNext} type="primary">
          다음
        </Button>
      </div>
    </>
  );
}
