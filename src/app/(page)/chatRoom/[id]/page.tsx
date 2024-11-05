"use client";

import Head from "next/head";
import Image from 'next/image';
import EmojiPicker from "src/app/components/EmojiPicker";
import { useSearchParams, useRouter, useParams } from "next/navigation"; // 이 라인은 이제 필요 없을 수 있습니다.
import { Suspense, useEffect, useRef, useState } from "react";
import { deleteChatRoomsService, getChatRoomData, getChatRoomDetails } from "src/app/service/chatRoom/chatRoom.api";
import { sendMessageService, subscribeMessages } from "src/app/service/chat/chat.api";
import { ChatRoomModel } from "src/app/model/chatRoom.model";
import { ChatModel } from "src/app/model/chat.model";
import { getUnreadCount, markMessageAsRead } from "src/app/api/chat/chat.api";
import React from "react";
import { ChatRooms } from "@/app/components/ChatRooms";

export default function Home1() {
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoomModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<ChatModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef(null);
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const [sender, setSender] = useState<string>(""); // 사용자 ID
  const [unreadCount, setUnreadCount] = useState<number>(0); // 읽지 않은 메시지 수
  const [selectChatRooms, setSelectChatRooms] = useState<any[]>([]);
  const [readBy, setReadBy] = useState<{ [key: string]: boolean }>({}); // 메시지 읽음 상태 관리
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  // 채팅방 정보와 메시지를 로딩하는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined') {
        const nickname = localStorage.getItem('nickname');
        if (nickname) {
          setSender(nickname);
          setLoading(true);
          try {
            // 사용자의 채팅방 목록 가져오기
            const { chatRooms } = await getChatRoomData(nickname);
            setChatRooms(chatRooms);

            // 선택된 채팅방 ID 설정
            if (id) {
              setSelectedChatRoomId(id);
              const chatRoomDetails = await getChatRoomDetails(id);
              setSelectedChatRoom(chatRoomDetails);
              setMessages(chatRoomDetails.messages || []); // 초기 메시지 설정
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, [id]); // id가 변경될 때마다 실행

  // 읽지 않은 참가자 수를 계산하는 함수
  const countNotReadParticipants = (message: ChatModel) => {
    const readByCount = Object.keys(message.readBy).length; // 읽은 참가자 수
    return message.totalParticipants - readByCount; // 읽지 않은 참가자 수
  };

  // 로그인한 사용자가 참여하고 있는 모든 채팅방의 읽지 않은 메시지 수 가져오기
  useEffect(() => {
    if (!sender) return;

    const fetchUnreadCounts = async () => {
      try {
        const updatedChatRooms = await Promise.all(
          chatRooms.map(async (room) => {
            const unreadCountResult = await getUnreadCount(room.id, sender);
            return { ...room, unreadCount: unreadCountResult };
          })
        );

        setChatRooms(updatedChatRooms);
      } catch (error) {
        console.error('읽지 않은 메시지 수를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUnreadCounts();
  }, [sender, chatRooms]);

  // 메시지 스트리밍 및 읽음 상태 처리
  useEffect(() => {
    if (!selectedChatRoomId) return;

    const eventSource = new EventSource(`https://abc.nyamnyam.kr/api/chats/${selectedChatRoomId}`);

    eventSource.onmessage = async (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
          // 새 메시지를 기존 메시지 목록에 추가
          const updatedMessages = [...prevMessages, newMessage];

          // 메시지를 읽음으로 마킹 처리
          const isRead = newMessage.readBy ? newMessage.readBy[sender] : false; // null 체크
          if (!isRead) {
            markMessageAsRead(newMessage.id, sender)
              .then(() => {
                // 읽음 상태 업데이트
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === newMessage.id
                      ? { ...msg, isRead: true, readBy: { ...msg.readBy, [sender]: true } }
                      : msg
                  )
                );
                // 채팅방의 unreadCount를 업데이트
                setChatRooms((prevChatRooms) =>
                  prevChatRooms.map((room) =>
                    room.id === selectedChatRoomId
                      ? { ...room, unreadCount: Math.max(room.unreadCount - 1, 0) } // unreadCount 감소
                      : room
                  )
                );
              })
              .catch((error) => console.error('Failed to mark message as read:', error));
          }

          return updatedMessages; // 새 메시지 추가
        }
        return prevMessages; // 메시지가 이미 존재하면 상태를 그대로 반환
      });
    };

    eventSource.onerror = (event) => {
      console.error("EventSource 에러:", event);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 EventSource 닫기
    };
  }, [selectedChatRoomId]);



  // 메시지 전송 함수
  // sendMessage 함수에서 새로운 메시지를 보낼 때 호출
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMessageData = {
      sender,
      message: newMessage,
      readBy: { [sender]: true }, // 보낸 사용자의 읽음 상태 추가
    };

    try {
      const sentMessage = await sendMessageService(selectedChatRoomId, newMessageData);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg.id === sentMessage.id);
        return messageExists ? prevMessages : [...prevMessages, sentMessage];
      });
      setNewMessage("");
    } catch (error) {
      console.error(error);
      alert('메시지 전송 중 오류가 발생했습니다.'); // 사용자에게 알림
    }
  };

  // 이모지 선택창 표시/숨김 토글 함수
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);

  };
  // 외부 클릭 시 이모지 선택창 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // 선택창 닫기
      }
    }

    // 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // 이모티콘 선택 핸들러 함수
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };


  const handleDelete = async (nickname) => {
    if (selectChatRooms.length === 0) {
      alert("삭제할 채팅방을 선택해주세요.");
      return;
    }
    if (window.confirm("선택한 채팅방을 삭제하시겠습니까?")) {
      try {
        await deleteChatRoomsService(selectChatRooms, nickname);
        alert("채팅방이 삭제되었습니다.");
        setChatRooms(prevChatRooms =>
          prevChatRooms.filter(room => !selectChatRooms.includes(room.id))
        );
        setSelectChatRooms([]);
      } catch (error) {
        console.error('Delete operation failed:', error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const filteredChatRooms = chatRooms.filter((room) => {
    // 참가자 목록을 소문자로 변환하여 하나의 문자열로 합침
    const participantsStr = room.participants.join(' ').toLowerCase();

    // 채팅방 이름과 참가자 목록에서 검색어가 포함된 항목을 필터링
    return (
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participantsStr.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>냠냠</title>
        <meta name="author" content="Templines" />
        <meta name="description" content="TeamHost" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />

        {/* CSS Files */}
        <link rel="stylesheet" href="/assets/css/libs.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />

        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
      </Head>
      <main className="page-main">
        <h3 className="uk-text-lead">Chats</h3>
        <div className="uk-grid uk-grid-small" data-uk-grid>
          <div className="uk-width-1-3@l">
            <div className="chat-user-list">
              <div className="chat-user-list__box" style={{ width: '90%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', backgroundColor: '#F9F9F9', height: '900px', overflowY: 'auto' }}>
                {/* Header */}
                <div className="chat-user-list__head" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="avatar">
                    <Image src="/assets/img/profile.png" alt="profile" width={40} height={40} style={{ borderRadius: '50%' }} />
                  </div>
                  <h2 style={{ marginLeft: '16px', fontSize: '20px', fontWeight: 'bold', color: '#4A4A4A' }}>Chat Rooms</h2>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '8px 0' }} /> {/* 구분선 추가 */}

                {/* Search */}
                <div className="chat-user-list__search" style={{ marginBottom: '8px' }}>
                  <div className="search" style={{ position: 'relative' }}>
                    <i className="ico_search" style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#888' }}></i>
                    <input
                      type="search"
                      name="search"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '24px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        outline: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '8px 0' }} /> {/* 구분선 추가 */}

                {/* Chat Room List */}
                <div className="chat-user-list__body">
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filteredChatRooms.map((room, index) => {
                      const currentUserNickname = localStorage.getItem('nickname'); // 로그인한 유저의 닉네임

                      // 로그인한 사용자 닉네임을 제외한 참가자 목록 생성
                      const otherParticipants = room.participants.filter(participant => participant !== currentUserNickname);

                      // 참가자 목록을 문자열로 변환하여 출력
                      const otherParticipantsStr = otherParticipants.length > 0 ? otherParticipants.join(', ') : "No Participants";

                      return (
                        <React.Fragment key={room.id}>
                          <li>
                            <div className="user-item --active" style={{ padding: '10px 0', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', marginBottom: '8px' }}>
                              <div className="user-item__avatar">
                                <Image src="/assets/img/user-list-1.png" alt="user" width={40} height={40} style={{ borderRadius: '50%' }} />
                              </div>
                              <div className="user-item__desc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginLeft: '10px' }}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (room && room.id) {
                                      setSelectedChatRoomId(room.id);
                                    }
                                  }}
                                  style={{ textDecoration: 'none', color: '#4A4A4A', flexGrow: 2, fontSize: '16px' }}
                                >
                                  <div className="user-item__name">
                                    {/* 참가자 이름 출력 */}
                                    {`${otherParticipantsStr} ${room.name}`}
                                  </div>
                                </a>
                              </div>
                              <div className="user-item__info" style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <span
                                  style={{
                                    display: room.unreadCount > 0 ? 'inline-block' : 'none', // 0 이하일 때 숨김 처리
                                    backgroundColor: 'red',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '6px', // 사각형 느낌을 더 주기 위해 값 감소
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    minWidth: '20px', // 최소 너비 설정
                                    textAlign: 'center',
                                    marginRight: '10px' // 배지와 체크박스 간의 간격 추가
                                  }}
                                >
                                  {room.unreadCount}
                                </span>
                                <ChatRooms
                                  chatRoomId={room.id}
                                  nickname={localStorage.getItem('nickname')}
                                />
                              </div>
                            </div>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="uk-width-2-3@l">
            <div className="chat-messages-box">
              <div className="chat-messages-head">
                {selectedChatRoomId ? (
                  <div className="user-item">
                    <div className="user-item__avatar">
                      <Image src="/assets/img/user-list-4.png" alt="user" width={40} height={40} />
                    </div>
                    <div className="user-item__desc" style={{ width: 'full' }}>
                      <div className="user-item__name" style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                        {/* 로그인한 유저 외 다른 참가자 이름과 채팅방 이름을 함께 출력 */}
                        {`${filteredChatRooms
                          .find(room => room.id === selectedChatRoomId)
                          ?.participants
                          .filter(participant => participant !== localStorage.getItem('nickname')) // 로그인한 사용자의 닉네임을 제외
                          .join(', ') || "No Participants"} ${filteredChatRooms.find(room => room.id === selectedChatRoomId)?.name || "Unknown Room"}`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <h3>선택된 채팅방이 없습니다.</h3>
                )}
              </div>
              {selectedChatRoomId ? (
                <>
                  <div className="chat-messages-body flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`w-full messages-item ${msg.sender !== sender ? '--your-message' : '--friend-message'} flex`}
                      >
                        <div className="messages-item__avatar flex items-center mr-2">
                          {msg.sender !== sender ? (
                            <Image src="/assets/img/user-list-3.png" alt="img" width={40} height={40} />
                          ) : (
                            <Image src="/assets/img/user-list-4.png" alt="img" width={40} height={40} />
                          )}
                        </div>
                        <div className="flex flex-col justify-start">
                          <div className="flex items-center">
                            <p className="text-sm font-semibold">{msg.sender}</p>
                          </div>
                          <div className="messages-item__text">{msg.message}</div>
                          {msg.sender !== sender ? (
                            <div className="messages-item__time text-gray-500 text-xs">{formatTime(new Date(msg.createdAt))}</div>
                          ) : (
                            <div className="messages-item__time text-gray-500 text-xs ml-auto">{formatTime(new Date(msg.createdAt))}</div>
                          )}
                          {/* 안 읽은 메시지 수 표시 */}
                          {countNotReadParticipants(msg) > 0 && (
                            <span style={{ color: 'red', fontSize: '0.8em' }}>
                              {countNotReadParticipants(msg)} unread
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-messages-footer">
                    <form onSubmit={sendMessage} className="chat-messages-form flex mt-4">
                      <div className="chat-messages-form-controls flex-grow">
                        <button
                          type="button"
                          onClick={toggleEmojiPicker}
                          className="emoji-picker-button px-2 py-1 rounded-md mr-2 border"
                        >
                          😊
                        </button>

                        {showEmojiPicker && (
                          <div ref={emojiPickerRef} className="absolute bottom-16 left-0 z-50">
                            <EmojiPicker onSelectEmoji={handleEmojiSelect} />
                          </div>
                        )}

                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="chat-messages-input border border-gray-300 p-2"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
