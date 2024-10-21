"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { tag } from "src/app/api/tag/tag.api";
import {TagModel } from "src/app/model/tag.model";
import { tagService } from "src/app/service/tag/tag.service";

export default function TagList() {
  const [tags, setTags] = useState<{[category: string]: TagModel[]}>({});
  const [selectTags, setSelectTags] = useState<string[]>([]);
  const allTags: TagModel[] = Object.values(tags).flat(); 
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchTag();

    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

  }, []);

  const fetchTag = async () => {
      const data = await tag.getAllTags(); 
      setTags(data.sort((a: TagModel, b: TagModel) => a.tagCategory.localeCompare(b.tagCategory)));
  };

  const handleCheck = (name: string) => {
    setSelectTags((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((tagName) => tagName !== name)
        : [...prevSelected, name]
    );
  };

  const handleDelete = async () => {
    if (selectTags.length === 0) {
      alert("삭제할 태그를 선택해주세요.");
      return;
    }
  
    const name = selectTags[0];
    if (!name) {
      alert("삭제할 태그 이름이 올바르지 않습니다.");
      return;
    }
  
    if (window.confirm("선택한 태그를 삭제하시겠습니까?")) {
      try {
        const updatedTags = await tagService.remove(name, tags);
        if (updatedTags) {
          setTags(updatedTags);
          alert("태그가 삭제되었습니다.");
          setSelectTags([]);
          fetchTag();
        }
      } catch (error) {
        console.error("태그 삭제 중 문제가 발생했습니다:", error);
      }
    }
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
    <main className="flex min-h-screen flex-col items-center" style={{ marginTop: '30px' }}>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 text-center">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#F46119] text-white">
              <th className="py-3 px-4 border-b"></th>
              <th className="py-3 px-4 border-b">Tag Category</th>
              <th className="py-3 px-4 border-b">Tag Name</th>
            </tr>
          </thead>
          <tbody>
            {allTags.map((t) => (
              <tr key={t.name} className="border border-[#F46119]">
                <td className="py-3 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectTags.includes(t.name)}
                    onChange={() => handleCheck(t.name)}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <span>{t.tagCategory}</span>
                </td>
                <td className="py-3 px-4 border-b">{t.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => router.push("/tag/register")}
          >
            등록하기
          </button>
          <button
           className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleDelete}
          >
            삭제하기
          </button>
        </div>
      </div>
    </main>
  );
}
