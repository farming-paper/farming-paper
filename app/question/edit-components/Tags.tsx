import { PlusOutlined } from "@ant-design/icons";
import { useFetcher } from "@remix-run/react";
import type { InputRef } from "antd";
import { Input, message, Tag, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { action as upsertTagOneAction } from "~/routes/_authorized/tags/upsert_one";
import type { ITag } from "~/types";
import { deepclone } from "~/util";

const Tags: React.FC<{
  existingTags: ITag[];
  value: ITag[] | undefined;
  onChange: (arg: ITag[]) => void;
}> = ({ onChange, value, existingTags }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [upsertedTag, setUpsertedTag] = useState<ITag | null>(null);

  const upsertTagFetcher = useFetcher<typeof upsertTagOneAction>();

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: ITag) => {
    const newTags = value?.filter((tag) => tag.name !== removedTag.name) || [];
    // console.log(newTags);
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = useCallback(() => {
    if (
      inputValue &&
      (value || []).findIndex((item) => item.name === inputValue) === -1
    ) {
      const found = existingTags.find((item) => item.name === inputValue);

      if (found) {
        onChange([...(value || []), deepclone(found)]);
      } else {
        upsertTagFetcher.submit(
          {
            tag: JSON.stringify({ name: inputValue }),
          },
          {
            method: "post",
            action: `/tags/upsert_one`,
          }
        );

        onChange([
          ...(value || []),
          { name: inputValue, publicId: "upserting...", id: -1 },
        ]);

        message.loading({
          key: "addingTag",
          content: `"${inputValue}" 태그를 추가하는 중입니다...`,
        });
      }
    }
    setInputVisible(false);
    setInputValue("");
  }, [existingTags, inputValue, onChange, upsertTagFetcher, value]);

  useEffect(() => {
    const newTag = upsertTagFetcher.data?.data;
    if (newTag) {
      setUpsertedTag(newTag);
      message.success({
        key: "addingTag",
        duration: 2,
        content: `"${newTag.name}" 태그가 추가되었습니다.`,
      });
    } else if (upsertTagFetcher.data?.error) {
      message.error({
        key: "addingTag",
        content: `"${upsertTagFetcher.data.error.name}" 태그를 추가하는 중에 오류가 발생했습니다.`,
      });
      // eslint-disable-next-line no-console
      console.error("upsertTagFetcher.data.error", upsertTagFetcher.data.error);
    }
  }, [upsertTagFetcher.data?.data, upsertTagFetcher.data?.error]);

  useEffect(() => {
    if (upsertedTag) {
      const newTags = (value || []).map((tag) => {
        if (tag.name === upsertedTag.name) {
          return upsertedTag;
        }
        return tag;
      });
      onChange(newTags);
      setUpsertedTag(null);
    }
  }, [onChange, upsertedTag, value]);

  return (
    <div className="flex flex-wrap gap-1">
      {value?.map((tag) => {
        const isLongTag = tag.name.length > 20;

        const tagElem = (
          <Tag
            className="inline-flex items-center h-8 px-2 m-0 select-none"
            key={tag.publicId}
            closable
            onClose={() => handleClose(tag)}
          >
            <span>{isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag.name} key={tag.publicId}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          style={{
            width: 120,
            verticalAlign: "top",
          }}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          className="inline-flex items-center h-8 bg-white border-dashed"
          onClick={showInput}
        >
          <PlusOutlined />
          <span>새 태그 추가</span>
        </Tag>
      )}
    </div>
  );
};

export default Tags;
