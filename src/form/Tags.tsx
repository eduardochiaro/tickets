'use client';

import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { forwardRef, DetailedHTMLProps, InputHTMLAttributes, Fragment, useRef, useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import pluck from '@/utils/pluck';

export type FormInputProps = {
  id?: string;
  name: string;
  label: string;
  value: any[];
  type?: string;
  className?: string;
  invalid?: boolean;
  handleChange?: any;
  api?: string;
  addNew?: boolean;
  updateItem: (e: any) => void;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type Ref = HTMLInputElement;

const Tags = forwardRef<Ref, FormInputProps>(
  (
    {
      id = '',
      type = 'text',
      name = '',
      label = '',
      value = [],
      placeholder = '',
      invalid = false,
      api = '/api/users',
      updateItem,
      className,
      addNew = false,
      ...props
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const inputSearchRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.length >= 3) {
          resetSearch();
          const res = await fetch(`${api}?text=${searchTerm}`);
          const elementSearch = await res.json();
          const currentElements = pluck(value, 'id');
          const elements = elementSearch.length > 0 ? elementSearch.filter((x: any) => !currentElements.includes(x.id)) : [];
          setOpenMenu(true);
          if (elements.length > 0) {
            setSearchResults(elements);
          }
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, value]);

    const addTag = (element: any) => {
      resetSearch();
      if (inputSearchRef.current) {
        inputSearchRef.current.value = '';
      }

      value.push({ ...element, new: true });
      updateItem(value);
    };

    const removeTag = (key: number) => {
      // remove elements from resume using index key
      resetSearch();
      const element = value[key];
      if (element.new) {
        value.splice(key, 1);
      } else {
        element.deleted = true;
        value[key] = element;
      }

      updateItem(value);
    };

    const resetSearch = () => {
      setOpenMenu(false);
      setSearchResults([]);
    };

    const isInvalid =
      type == 'file' ? invalid && ref != null && typeof ref !== 'function' && ref.current && ref.current.value == '' : invalid && value.length <= 0;
    return (
      <>
        <label htmlFor={id ? id : `${name}-form`} className="input-label flex items-center">
          <span className="grow">
            {label} {props.required && <span className="text-secondary-600">*</span>} ({value.length})
          </span>
        </label>

        <div className={`${isInvalid && '!border-red-400'} input-field flex flex-wrap items-center gap-2 p-2 relative mt-1`}>
          {value?.map((element, key) => (
            <Fragment key={`element-${key}`}>
              {!element.deleted && (
                <span className="relative group">
                  <span
                    className={`group relative text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-sky-600 flex-nowrap ${
                      element.new ? 'bg-red-200' : 'bg-sky-200'
                    }`}
                  >
                    {element.name}
                  </span>
                  <XCircleIcon
                    className="hidden group-hover:block h-4 w-4 absolute -top-2 -right-2 text-red-500 cursor-pointer"
                    onClick={() => removeTag(key)}
                  />
                </span>
              )}
            </Fragment>
          ))}
          <Menu as="div" className="relative grow inline-block text-left">
            <input
              ref={inputSearchRef}
              type="text"
              autoComplete="off"
              className="w-full bg-transparent border-0 py-0 focus:ring-0 min-w-fit px-2"
              placeholder={placeholder}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {openMenu && (
              <Menu.Items static className="absolute left-0 top-8 w-56 divide-y divide-gray-300 dark:divide-gray-500 drop-shadow bg-gray-50 rounded">
                {searchResults.map((element: any, key: number) => (
                  <div className="px-1 py-1" key={key}>
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`flex w-full p-2 ${active && 'bg-gray-200'}`} onClick={() => addTag(element)}>
                          {element.name}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                ))}
                {searchResults.length == 0 && (
                  <>
                    <div className="px-1 py-5">
                      <p className="text-center opacity-70">No results found</p>
                    </div>
                    {addNew && (
                      <div className="p-3 text-center">
                        <button type="button" className="button" onClick={() => addTag({ name: searchTerm, id: null })}>
                          Add &quot;<strong>{searchTerm}</strong>&quot; as new element
                        </button>
                      </div>
                    )}
                  </>
                )}
              </Menu.Items>
            )}
          </Menu>
          {isInvalid && (
            <p className="text-xs flex items-center gap-1 mt-1 text-red-400">
              <ExclamationTriangleIcon className="h-4" /> this field is required
            </p>
          )}
        </div>
      </>
    );
  },
);

Tags.displayName = 'Tags';

export default Tags;
