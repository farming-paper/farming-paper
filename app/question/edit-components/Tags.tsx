import { disassembleHangul } from "@toss/hangul";

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
import Loader from "~/common/components/Loader";
import NumberBall from "~/common/components/NumberBall";

import {
  createUpsertTagArgs,
  useUpsertTagFetcher,
} from "~/routes/_auth.tags.upsert_one";
import type { ITag, ITagWithCount } from "~/types";

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
  return props.data.creating ? (
    <div className="flex items-center justify-center mx-1 text-xs">
      <Loader />
    </div>
  ) : (
    <components.MultiValueRemove {...props} />
  );
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
  const [upsertingTags, upsertingTagsDispatch] = useReducer(
    upsertingTagsReducer,
    []
  );
  const { message } = App.useApp();
  const [upsertedTag, setUpsertedTag] = useState<ITag | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const upsertTagFetcher = useUpsertTagFetcher();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (upsertTagFetcher.state !== "idle" || !upsertTagFetcher.data) {
      return;
    }

    const newTagRes = upsertTagFetcher.data;
    if (newTagRes.error) {
      message.error({
        key: "addingTag",
        content: `"${newTagRes.error.name}" 태그를 추가하는 중에 오류가 발생했습니다.`,
      });
      // eslint-disable-next-line no-console
      console.error("upsertTagFetcher.data.error", upsertTagFetcher.data.error);
      return;
    }

    setUpsertedTag(newTagRes.data);

    message.success({
      key: "addingTag",
      duration: 2,
      content: `"${newTagRes.data.name}" 태그가 추가되었습니다.`,
    });
  }, [message, upsertTagFetcher.data, upsertTagFetcher.state]);

  useEffect(() => {
    if (upsertedTag) {
      onChange([...(value || []), upsertedTag]);
      upsertingTagsDispatch({ type: "remove", name: upsertedTag.name });
      setUpsertedTag(null);
    }
  }, [onChange, upsertedTag, value]);

  const { token } = theme.useToken();

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
      if (actionMeta.action === "create-option") {
        upsertingTagsDispatch({
          type: "add",
          item: actionMeta.option,
        });
        upsertTagFetcher.submit(
          createUpsertTagArgs({ name: actionMeta.option.label }),
          {
            method: "post",
            action: `/tags/upsert_one`,
          }
        );
        return;
      }

      onChange(newValue.map(selectItemToTag));
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
};

export default Tags;
