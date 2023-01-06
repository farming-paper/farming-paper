import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag, Tooltip } from "antd";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import type { ITag } from "~/types";

const Tags: React.FC<{
  value: ITag[] | undefined;
  onChange: (arg: ITag[]) => void;
}> = ({ onChange, value }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    console.log("value", value);
  }, [value]);

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

  const handleInputConfirm = () => {
    if (
      inputValue &&
      (value || []).findIndex((item) => item.name === inputValue) === -1
    ) {
      onChange([
        ...(value || []),
        {
          name: inputValue,
          publicId: nanoid(),
        },
      ]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className="flex flex-wrap gap-1">
      {value?.map((tag) => {
        const isLongTag = tag.name.length > 20;

        const tagElem = (
          <Tag
            className="m-0 select-none"
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
            width: 100,
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
        <Tag className="bg-white border-dashed" onClick={showInput}>
          <PlusOutlined />
          <span>새 태그 추가</span>
        </Tag>
      )}
    </div>
  );
};

export default Tags;
