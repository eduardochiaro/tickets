'use client';
import type { Issue, Status, Type, User } from '@prisma/client';
import { Input, Select, Textarea } from '@/form';
import useStaleSWR from '@/utils/staleSWR';
import { ChangeEvent, FormEvent, useReducer } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'
import { NextResponse } from "next/server";

export default function CreateIssue({ slug }: { slug: string; }) {
  const router = useRouter();
  const { data: types } = useStaleSWR(`/api/types`);

  const initialFormData = {
    title: '',
    type: '',
    description: '',
  };
  const [issueForm, updateIssueForm] = useReducer((x: any, y: any) => {
    return { ...x, ...y };
  }, initialFormData);

  const handeChanges = (e: ChangeEvent<any>) => {
    updateIssueForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.post(`/api/projects/${slug}/issues`, JSON.stringify(issueForm), {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      router.push(`/p/${slug}`);
    }).catch((err) => {
      console.log(err);
    });

  };

  return (
    <form className="mt-10" method="POST" action={`/api/projects/${slug}/issues`} onSubmit={ (e) => handleSubmit(e) }>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col col-span-2">
          <Input label="Name" name="title" id="issue-title" className="text-3xl" value={issueForm.title} required onChange={(e) => handeChanges(e)} />
        </div>
        <div className="flex flex-col">
          <Select label="Type" name="type" id="issue-type" value={issueForm.type} required onChange={(e) => handeChanges(e)}>
            <option value="">Select a type</option>
            {types?.map((s: Type) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col col-span-2">
          <Textarea label="Description" name="description" id="issue-description" required value={issueForm.description} onChange={(e) => handeChanges(e)} />
        </div>

        <div className="col-span-2 flex justify-end">
          <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
            Create Issue
          </button>
        </div>
      </div>
    </form>
  );
}
