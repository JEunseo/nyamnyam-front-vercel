"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {ChatRoomModel} from "@/app/model/chatRoom.model";


export default function Home1() {
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가

  const [selectChatRooms, setSelectChatRooms] = useState<any[]>([]);
  const router = useRouter();

  // 기본 상태
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); // currentPage가 변경될 때마다 데이터 새로 고침

  const fetchData = async (pageNo: number) => {
    setLoading(true); // 로딩 상태 시작

    try {
      const response = await fetch(`http://localhost:8080/api/chatRoom/findAll`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChatRooms(data);

      const totalCountResponse = await fetch('http://localhost:8080/api/chatRoom/count');
      const totalCount = await totalCountResponse.json();
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };


  // 페이지 네이션 적용
  // const fetchChannels = () => {
  //   fetch('http://localhost:8080/api/channels/findAllPerPage/1')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setChannels(data);
  //     })
  //     .catch((error) => {
  //       console.error('There has been a problem with your fetch operation:', error);
  //     });
  // };

  // 디테일 원
  const handleDetails = (id: any) => {
    console.log(id)
    router.push('/channel/details/${id}');
  };

  const handleCheck = (id: any) => {
    setSelectChatRooms((prevSelected: string[]) =>
      prevSelected.includes(id)
        ? prevSelected.filter((channelId: string) => channelId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = () => {
    if (selectChatRooms.length === 0) {
        alert("삭제할 게시글을 선택해주세요.");
        return;
    }
    if (window.confirm("선택한 게시글을 삭제하시겠습니까?")) {
        Promise.all(selectChatRooms.map((id: any) =>
            fetch(`http://localhost:8080/api/chatRoom/deleteById/${id}`, { method: 'DELETE' })
        ))
        .then(() => {
            alert("게시글이 삭제되었습니다.");
            setChatRooms(prevChatRooms => 
                prevChatRooms.filter(room => !selectChatRooms.includes(room.id)) // 삭제한 방을 제외
            );
            setSelectChatRooms([]); // 선택 초기화
        })
        .catch(error => {
            console.error('Delete operation failed:', error);
            alert("삭제 중 오류가 발생했습니다.");
        });
    }
};

  const handleCrawling = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chatRoom/crawling`, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          alert(`크롤링 결과를 받았습니다: ${data.length}개의 항목`);
        } else {
          alert('크롤링 결과가 없습니다.');
        }
      } else {
        throw new Error('응답 오류');
      }
    } catch (error: any) {
      alert(`크롤링 오류 발생: ${error.message}`);
    }
  };
  const handleNone = async () => {
    alert('크롤링 막았놓았습니다.')
  }


  const handlePage = (pageNo: number) => {
    if (pageNo < 1 || pageNo > totalPages) return; // 페이지 번호 유효성 검사
    setCurrentPage(pageNo);
  };


  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Adjust the start page if there are not enough pages before the current page
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 border-b"></th>
              <th className="py-3 px-4 border-b">채널 아이디</th>
              <th className="py-3 px-4 border-b">채널 이름</th>
              <th className="py-3 px-4 border-b">참가자</th>
            </tr>
          </thead>
          <tbody>
            {chatRooms.map((c) => (
              <tr key={c.id} className="border border-indigo-600">
                <td className="py-3 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectChatRooms.includes(c.id)}
                    onChange={() => handleCheck(c.id)}
                  />
                </td>
                <td className="py-3 px-4 border-b">
                  <Link
                    href={`/chatRoom/details/${c.id}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetails(c.id ?? null);
                    }}
                  >
                    {c.id}
                  </Link>
                </td>
                <td className="py-3 px-4 border-b">{c.name ? c.name : "No Name"}</td>
                <td className="py-3 px-4 border-b">
  {c.participants && c.participants.length > 0 ? (
    <ul>
      {c.participants.map((participant: any, index: number) => (
        <li key={index}>
          {participant.nickname || "No Nickname"}
        </li>
      ))}
    </ul>
  ) : (
    "No Participants"
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mr-2"
            onClick={handleNone}>
            크롤링
          </button>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
            onClick={() => router.push('post/register')}>
            등록하기
          </button>
          <button
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mr-2"
            onClick={handleDelete}>
            삭제하기
          </button>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
            onClick={() => handlePage(1)}>
            첫 페이지
          </button>
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <button
              onClick={() => handlePage(currentPage - 1)}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </button>
          </li>
          {getPageNumbers().map(page => (
            <li key={page}>
              <button
                onClick={() => handlePage(page)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === page ? 'text-blue-600 border-blue-300 bg-blue-50' : 'text-gray-500 border-gray-300'} hover:bg-gray-100 hover:text-gray-700`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePage(currentPage + 1)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

    </main>
  );
}