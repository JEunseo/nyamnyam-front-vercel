"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { tag } from "src/app/api/tag/tag.api";
import { initialTag, TagModel } from "src/app/model/tag.model";
import { tagService } from "src/app/service/tag/tag.service";

export default function TagRegister() {
  const [tags, setTags] = useState<{ [category: string]: TagModel[] }>({});
  const [tagCategory, setTagCategory] = useState<string[]>([]);
  const [formData, setFormData] = useState<TagModel>(initialTag);
  const allTags: TagModel[] = Object.values(tags).flat();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchTag();
    fetchTagCategory();

    const storedRole = localStorage.getItem('role');
    setRole(storedRole);


  }, []);

  const fetchTag = async () => {
    const data = await tag.getAllTags();
    setTags(data.sort((a: TagModel, b: TagModel) => a.tagCategory.localeCompare(b.tagCategory)));
  }

  const fetchTagCategory = async () => {
    const data = await tag.getCategoryNames();
    setTagCategory(data);
  }

  const groupTags = allTags.reduce((acc: { [key: string]: string[] }, tag) => {
    if (!acc[tag.tagCategory]) {
      acc[tag.tagCategory] = [];
    }
    acc[tag.tagCategory].push(tag.name);
    return acc;
  }, {});

  const maxLength = Math.max(...Object.values(groupTags).map((group) => group.length));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await tagService.insert(formData);
    router.push('/tag/tags');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  if (role !== 'ADMIN') {
    return (
        <div className="unauthorized text-center mt-5">
          <h2>권한이 없습니다</h2>
          <p>You do not have permission to view this content.</p>
        </div>
    );
  }

  return (
    <div className="heading4" style={{ marginTop: '30px' }}>
      <div className="w-full lg:w-3/4 xl:w-2/3 mx-auto overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mt-4 text-center">
        <thead>
          <tr className="bg-[#F46119] text-white">
            <th className="py-3 px-4 border-b text-sm">No</th>
            <th className="py-3 px-4 border-b text-sm">방문목적</th>
            <th className="py-3 px-4 border-b text-sm">분위기</th>
            <th className="py-3 px-4 border-b text-sm">편의시설</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: maxLength } as { length: number }, (_, index: number) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b text-sm">{index + 1}</td>
              {Object.keys(groupTags).map((categoty) => (
                <td key={categoty} className="py-2 px-4 border-b text-sm">
                  {groupTags[categoty][index] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>카테고리</span>
          <span>를 선택해주세요.</span>
          <select
            name="tagCategory"
            value={formData.tagCategory}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">목록</option>
            {tagCategory.map((category) => (
              <option key={category} value={category} className="item flex items-center justify-between gap-1.5">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>태그명</span>
          <span>을 입력해주세요.</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            style={{ borderColor: '#d3d3d3' }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            등록하기
          </button>
          <button
          className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => router.push(`/tag/tags`)}
        >
          목록
        </button>
        </div>
      </form>
      </div>
    </div>
  );
}
