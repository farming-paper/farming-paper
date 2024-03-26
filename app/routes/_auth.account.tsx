import { useNavigate, useOutletContext } from "@remix-run/react";
import { Button } from "~/common/components/mockups";

import { ExternalLink, Github } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DangerModal from "~/common/components/DangerModal";
import type { IOutletProps } from "~/types";
import { useDeleteAccountFetcher } from "./_auth.account.delete";

export default function Account() {
  const context = useOutletContext<IOutletProps>();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await context.supabase.auth.signOut();
    navigate("/login?status=logged_out");
  }, [context.supabase.auth, navigate]);

  const deleteAccountFetcher = useDeleteAccountFetcher();

  useEffect(() => {
    const data = deleteAccountFetcher.data?.data;
    if (data === "success") {
      context.supabase.auth.signOut().then(() => {
        navigate("/login?status=deleted_account");
      });
    }
  }, [context.supabase.auth, deleteAccountFetcher.data?.data, navigate]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDeleteModal = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    deleteAccountFetcher.submit(
      {},
      {
        method: "post",
        action: `/account/delete`,
      }
    );
  }, [deleteAccountFetcher]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <h1 className="my-2 text-xl font-medium">계정</h1>
        <div className="flex gap-4">
          <Button onClick={handleLogout}>로그아웃</Button>
          <Button danger type="primary" onClick={openDeleteModal}>
            계정 삭제
          </Button>
          <DangerModal
            message="정말 계정을 삭제하시겠습니까? 문제, 태그 등등이 모두 영구히 삭제됩니다."
            title="계정 삭제"
            open={deleteModalOpen}
            setOpen={setDeleteModalOpen}
            onSubmit={handleDeleteAccount}
          />
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
            <Github className="w-4 h-4" />
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
