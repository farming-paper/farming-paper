import { disassembleHangul } from "@toss/hangul";
import { message, theme } from "antd";
import { PlusIcon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type {
  ActionMeta,
  MultiValue,
  MultiValueGenericProps,
  MultiValueRemoveProps,
} from "react-select";
import { components } from "react-select";
import Select from "react-select/creatable";
import NumberBall from "~/common/components/NumberBall";

import {
  createUpsertTagArgs,
  useUpsertTagFetcher,
} from "~/routes/_auth.tags.upsert_one";
import type { ITag, ITagWithCount } from "~/types";

const { useToken } = theme;

type SelectItem = {
  label: string;
  value: string;
  count?: number;
  creating?: boolean;
};

const MultiValueLabel = (props: MultiValueGenericProps<SelectItem>) => {
  const { children: _children, ...restProps } = props;
  return (
    <components.MultiValueLabel {...restProps}>
      {props.data.label}
    </components.MultiValueLabel>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps<SelectItem>) => {
  const { children: _children, ...restProps } = props;
  return <>asdf</>;
};

function selectItemToTag(item: SelectItem): ITag {
  return {
    name: item.label,
    publicId: item.value,
  };
}

function upsertingTagsReducer(
  tags: SelectItem[],
  action: { type: "add"; item: SelectItem } | { type: "remove"; name: string }
) {
  switch (action.type) {
    case "add":
      return [...tags, action.item];
    case "remove":
      return tags.filter((tag) => tag.label !== action.name);
    default:
      throw new Error();
  }
}

const Tags: React.FC<{
  existingTags: ITagWithCount[];
  value: ITag[] | undefined;
  onChange: (arg: ITag[]) => void;
}> = ({ onChange, value, existingTags }) => {
  const [upsertedTag, setUpsertedTag] = useState<ITag | null>(null);
  const [upsertingTags, upsertingTagsDispatch] = useReducer(
    upsertingTagsReducer,
    []
  );
  const [isBrowser, setIsBrowser] = useState(false);
  const upsertTagFetcher = useUpsertTagFetcher();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

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
      onChange([...(value || []), upsertedTag]);
      upsertingTagsDispatch({ type: "remove", name: upsertedTag.name });
      setUpsertedTag(null);
    }
  }, [onChange, upsertedTag, value]);

  const { token } = useToken();

  const options = useMemo(() => {
    return existingTags.map((tag) => {
      return {
        label: tag.name,
        value: tag.publicId,
        count: tag.count,
        creating: false,
      };
    });
  }, [existingTags]);

  const selectValue = useMemo((): SelectItem[] => {
    return (
      value
        ?.map((tag): SelectItem => {
          return {
            label: tag.name,
            value: tag.publicId,
            creating: false,
          };
        })
        ?.concat(upsertingTags) || []
    );
  }, [upsertingTags, value]);

  const onSelectChange = useCallback(
    (newValue: MultiValue<SelectItem>, actionMeta: ActionMeta<SelectItem>) => {
      console.log(newValue, actionMeta);
      const creatings = newValue.filter((item) => item.creating === true);
      creatings.forEach((item) => {
        upsertingTagsDispatch({ type: "add", item });
        upsertTagFetcher.submit(createUpsertTagArgs({ name: item.label }), {
          method: "post",
          action: `/tags/upsert_one`,
        });
      });
      const newTags = newValue.filter((item) => item.creating !== true);
      onChange(newTags.map(selectItemToTag));
      // TODO: implement
    },
    [onChange, upsertTagFetcher]
  );

  return isBrowser ? (
    <Select
      value={selectValue}
      onChange={onSelectChange}
      isMulti={true}
      options={options}
      placeholder="태그를 입력하세요"
      components={{
        IndicatorsContainer: () => null,
        MultiValueLabel,
        MultiValueRemove,
      }}
      styles={{
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: token.colorTextPlaceholder,
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          color: state.isSelected ? token.colorText : token.colorText,
          backgroundColor: state.isSelected
            ? token.colorPrimaryBgHover
            : state.isFocused
            ? token.colorPrimaryBgHover
            : "",
          ":hover": {
            backgroundColor: token.colorPrimaryBgHover,
          },
        }),

        control: (baseStyles, state) => ({
          ...baseStyles,
          cursor: "text",
          borderColor: state.isFocused
            ? token.colorPrimaryActive
            : token.colorBorder,
          ":hover": {
            borderColor: token.colorPrimary,
            boxShadow: state.isFocused
              ? `0 0 0 ${token.controlOutlineWidth}px ${token.controlOutline}`
              : "",
          },
          backgroundColor: "",
          boxShadow: state.isFocused
            ? `0 0 0 ${token.controlOutlineWidth}px ${token.controlOutline}`
            : "",
        }),
      }}
      getNewOptionData={(inputValue) => {
        return {
          label: inputValue,
          value: inputValue,
          creating: true,
        };
      }}
      formatOptionLabel={(option) => {
        return option.creating ? (
          <div className="flex items-center gap-3">
            <PlusIcon className="w-5 h-5" />
            <span>{option.label}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>{option.label}</span>
            <NumberBall>{option.count}</NumberBall>
          </div>
        );
      }}
      filterOption={(option, rawInput) => {
        return disassembleHangul(option.label)
          .replace(/ /g, "")
          .includes(disassembleHangul(rawInput).replace(/ /g, ""));
      }}
      formatCreateLabel={(inputValue) => {
        return `새로운 태그 "${inputValue}" 추가`;
      }}
    />
  ) : null;
  // <div className="flex flex-wrap gap-1">

  //   {value?.map((tag) => {
  //     const isLongTag = tag.name.length > 20;

  //     const tagElem = (
  //       <Tag
  //         className="inline-flex items-center h-8 px-2 m-0 select-none"
  //         key={tag.publicId}
  //         closable
  //         onClose={() => handleClose(tag)}
  //       >
  //         <span>{isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}</span>
  //       </Tag>
  //     );
  //     return isLongTag ? (
  //       <Tooltip title={tag.name} key={tag.publicId}>
  //         {tagElem}
  //       </Tooltip>
  //     ) : (
  //       tagElem
  //     );
  //   })}
  //   {inputVisible && (
  //     <input
  //       ref={mergeRefs([refs.setReference, inputRef])}
  //       {...getReferenceProps()}
  //       style={{
  //         width: 120,
  //         verticalAlign: "top",
  //       }}
  //       type="text"
  //       className="tag-input"
  //       value={inputValue}
  //       onChange={handleInputChange}
  //       onBlur={handleInputConfirm}
  //       onKeyDown={handleKeyDown}
  //     />
  //   )}
  //   {!inputVisible && (
  //     <Tag
  //       className="inline-flex items-center h-8 bg-white border-dashed"
  //       onClick={showInput}
  //     >
  //       <PlusOutlined />
  //       <span>새 태그 추가</span>
  //     </Tag>
  //   )}
  //   {isOpen && (
  //     <div
  //       ref={refs.setFloating}
  //       className="shadow-sm bg-gray-50"
  //       style={{
  //         position: strategy,
  //         top: y ?? 0,
  //         left: x ?? 0,
  //         width: "max-content",
  //       }}
  //       {...getFloatingProps()}
  //     >
  //       Tooltip element
  //     </div>
  //   )}
  // </div>
};

export default Tags;
