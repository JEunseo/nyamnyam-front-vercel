"use client"
import { ReplyModel } from '@/app/model/reply.model';
import { replyService } from '@/app/service/reply/reply.service';
import nookies from 'nookies';
import { FormEvent, useEffect, useState } from 'react';

const ReplyHandler: React.FC<Partial<{ postId: number; initialReplies: ReplyModel[]; currentId: string; isOpen: boolean;}>> = ({ postId, initialReplies, currentId, isOpen }) => {
    if(!isOpen) return null;

    const [localReplies, setLocalReplies] = useState<{ [key: number]:  ReplyModel[] }>({});
    const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});
    const [editReply, setEditReply] = useState<{ [key: number]: boolean }>({});
    const [editInput, setEditInput] = useState<{ [key: number]: string }>({});
    const currentUserId = nookies.get().userId;
    const nickname = localStorage.getItem('nickname') || '';

    useEffect(() => {
        setLocalReplies({[postId]: initialReplies});
    }, [initialReplies, postId]);

    // 댓글 작성 (서버 연결)
    const replySubmit = async (postId: number, e: FormEvent) => {
        e.preventDefault();

        const replyContent = replyInput[postId];
        if (!replyContent) {
            alert('댓글을 입력하세요.');
            return;
        }
        const result = await replyService.submit(postId, replyContent, currentUserId, nickname);

        if (result && result.success) {
            const { newReply } = result;

            setLocalReplies((prevReplies) => ({
                ...prevReplies,
                [postId]: [...(prevReplies[postId] || []), newReply]
            }));

            setReplyInput((prevInput)=>({
                ...prevInput,
                [postId]: ''
            }));
        }
    };

    // 댓글 작성 & 수정 
    const replyInputChange = (id: number, content: string, isEdit: boolean) => {
        if (isEdit) { // 댓글 작성 (postId)
            setReplyInput((prevInput) => ({
                ...prevInput,
                [id]: content,
            }));
        } else { // 댓글 수정 (replyId)
            setEditInput((prevInput) => ({
                ...prevInput,
                [id]: content !== undefined ? content : "",
            }));
        }
    }

    // 수정 & 저장 버튼 
    const replyEditClick = (replyId: number, currentContent: string) => {
        setEditReply((prevEdit) => ({
            ...prevEdit,
            [replyId]: true,
        }));
        setEditInput((prevInput) => ({
            ...prevInput,
            [replyId]: currentContent || "",
        }));
    };

    // 수정내용 저장 (서버연결)
    const replyEditSave = async (replyId: number, postId: number) => {
        const updateReply = await replyService.editSave(replyId, postId, editInput[replyId], currentUserId);
        if (updateReply) {
            setLocalReplies((prevReplies) => ({
                ...prevReplies,
                [postId]: prevReplies[postId]?.map((reply) =>
                    reply.id === replyId ? updateReply : reply
                )
            }));

            setEditReply((prevEditReply) => ({
                ...prevEditReply,
                [replyId]: false,
            }));
        } else {
            console.log("댓글 수정 실패");
        }
    };

    // 댓글 삭제 
    const replyDelete = async (replyId: number, postId: number) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        const updatedReplies = await replyService.remove(replyId, postId, localReplies[postId]);

        if (updatedReplies) {
            setLocalReplies((prevReplies) => ({
                ...prevReplies,
                [postId]: updatedReplies
            }));
        }
    };

    // 날짜 포맷 지정 
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);

        const [year, month, day] = formattedDate.split('.').map(part => part.trim());
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <>
            <div className="mt-4 w-full">
                {localReplies[postId] && localReplies[postId].length > 0 ? (
                    <ul className='list-none p-0 m-0'>
                        {localReplies[postId].map((reply, index) => (
                            <li key={index} className="mb-2 border-b border-gray-200 pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        <span className="inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                                            {reply.nickname}
                                        </span>
                                        {editReply[reply.id] ? (
                                            <span className="ml-2" style={{ width: "600px", display: "inline-block", whiteSpace: "nowrap" }}>
                                                <textarea
                                                    name="content"
                                                    id="content"
                                                    value={editInput[reply.id] !== undefined ? editInput[reply.id] : ""}
                                                    onChange={(e) => replyInputChange(reply.id, e.target.value, false)}
                                                    className="border rounded p-2 w-full"
                                                    style={{ minHeight: "50px", width: "100%" }}
                                                />
                                            </span>
                                        ) : (
                                            <span className="ml-2" style={{ width: "auto", display: "inline-block", whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word" }}>
                                                {reply.content}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-500 text-right" style={{ minWidth: '110px', maxWidth: '120px', marginLeft: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        {formatDate(reply.entryDate)}</div>
                                </div>

                                {reply.userId === currentUserId && (
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                            className="button-main custom-button ${editReply[reply.id] ? 'w-[50px]' : 'w-[60px]'} px-4 py-2 bg-green-500 text-white rounded"
                                            style={{ backgroundColor: editReply[reply.id] ? '#4CAF50' : '#3B82F6', marginRight: '5px', }}
                                            onClick={() => editReply[reply.id] ? replyEditSave(reply.id, postId) : replyEditClick(reply.id, reply.content)}
                                        >
                                            {editReply[reply.id] ? '저장' : '수정'}
                                        </button>
                                        <button
                                            className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
                                            style={{ marginRight: '5px' }}
                                            onClick={() => reply.id && replyDelete(reply.id, postId)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>댓글 없음</p>
                )}
            </div>
            <form onSubmit={(e) => replySubmit(postId, e)} className="my-4 flex space-x-4">
                <input
                    type="text"
                    placeholder="댓글을 입력하세요."
                    value={replyInput[postId] || ""}
                    onChange={(e) => replyInputChange(postId, e.target.value, true)}
                    className="border rounded p-2 flex-grow" />
                <button
                    type="submit"
                    className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded">
                    등록
                </button>
            </form>
        </>
    );
};

export default ReplyHandler