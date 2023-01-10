import { GithubOutlined } from "@ant-design/icons";
import { useOutletContext } from "@remix-run/react";
import { Button } from "antd";
import { ExternalLink } from "lucide-react";
import { useCallback } from "react";
import type { IOutletProps } from "~/types";

export default function Account() {
  const context = useOutletContext<IOutletProps>();

  const handleLogout = useCallback(async () => {
    context.supabase.auth.signOut();
  }, [context.supabase.auth]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <h1 className="my-2 text-xl font-medium">계정</h1>
        <div className="flex gap-4">
          <Button onClick={handleLogout}>로그아웃</Button>
          <Button
            onClick={() => {
              // TODO: 계정 삭제
            }}
          >
            계정 삭제
          </Button>
        </div>
      </div>
      <div>
        <h2 className="my-2 text-lg">프로필</h2>
        <p className="text-gray-500">공사중...</p>
      </div>
      <div>
        <h2 className="my-2 text-lg">문제 푼 기록</h2>
        <p className="text-gray-500">공사중...</p>
      </div>
      <div>
        <h2 className="my-2 text-lg">ABOUT</h2>
        <div className="flex flex-wrap gap-3">
          {/* <Button target="_blank" rel="noopener noreferrer">
            건의 및 문의하기
          </Button> */}
          <Button
            type="primary"
            href="https://tally.so/r/w8NWlk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <span style={{ marginInlineStart: 0 }}>건의 및 문의하기</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </Button>
          <Button
            href="https://springfall.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <span style={{ marginInlineStart: 0 }}>개발자 블로그</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </Button>
          <Button
            href="https://github.com/farming-paper/farming-paper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <GithubOutlined />
            <span style={{ marginInlineStart: 0 }}>Github</span>
            <span className="inline-flex opacity-40">
              <ExternalLink className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
