
export async function save(message: MessageModel): Promise<any | {status: number}> {
    try {
        const messageModel = {
            channelId: message.channelId,
            senderId: message.senderId,
            content: message.content            
        }
        const response = await fetch('http://localhost:8080/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageModel)
        });
        const data: any = await response.json();
        return data;

    } catch (e) {
        console.log('There has been a problem with your fetch operation', e);
        return {status: 500 };
    }
}