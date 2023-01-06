import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";

const Tags: React.FC<{
  value: string[] | undefined;
  onChange: (arg: string[]) => void;
}> = ({ onChange, value }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = value?.filter((tag) => tag !== removedTag) || [];
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
    if (inputValue && (value || []).indexOf(inputValue) === -1) {
      onChange([...(value || []), inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className="flex flex-wrap gap-1">
      {value?.map((tag) => {
        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="m-0 select-none"
            key={tag}
            closable
            onClose={() => handleClose(tag)}
          >
            <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
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
